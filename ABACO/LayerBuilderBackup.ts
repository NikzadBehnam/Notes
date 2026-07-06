import BaseLayer from "ol/layer/Base";
import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import TileLayer from "ol/layer/Tile";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";
import { HTTPClient } from "@abaco/web-common/src/HTTP";
import SsoVuexModule from "@abaco/sso-web-module/src/abaco-module/state";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import { WMSLayer, WMTSLayer, MapLayer, DBGISLayer, WPSLayer, BingLayer, GeoRaster, WLayer } from "./models/Layer";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Style, Icon, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import { Extent } from "ol/extent";
import Geometry from "ol/geom/Geometry";
import Feature, { FeatureLike } from "ol/Feature";
import { AbcFeature } from "./models/AbacoMap";
import wkt from "ol/format/WKT";
import ID from "@abaco/web-components/src/ID";
import BingMaps from "ol/source/BingMaps";
import { Cluster } from "ol/source";
import Text from "ol/style/Text";
import { Point, Polygon, MultiPolygon } from "ol/geom";
import { Selected } from "@abaco/map-web-module/src/modules/map-web-module/models/AbacoMap";
import OlGeometry from "ol/geom/Geometry";
import { GeometryCollection } from "ol/geom";

export const FEATURE_ID = "abaco_feature_id";
export const OVERLAY_ID = "abaco_overlay_id";
export const LAYER_ID = "abaco_id";
export const ADD_TO_LEGEND = "abaco_add_to_legend";

export const MAX_COUNT_BEFORE_GEOM_OPTIMIZATION = 1000;
export const CLUSTER_THRESHOLD_LEVEL = 15; //greater means more zoomed in
export const CLUSTER_ZOOM_PADDING = 250;

export type StyleFunction = (feature: FeatureLike, layerName: string, resolution?: number) => Style | null;
export interface WktInfo {
    wkt: string;
    id?: string | number;
    additionalProperties?: Record<string, any>;
}

export interface BuildVectorOptions {
    addToLegend?: boolean;
    styleFunction?: StyleFunction;
    features?: Feature<Geometry>[];
    layerId?: string;
    download?: boolean;
    additionalProperties?: Record<string, any>;
}

export type OnLoadLayerErrorFunc = (layerDef: MapLayer) => void;

export interface BuildLayerOptions {
    mbr?: Extent;
    pkCuaa?: number | null;
    pkCuaaSCLeader?: number | null;
    campaign?: number;
    styleFunction?: StyleFunction;
    setOrigin?: boolean;
    onLoadLayerError?: OnLoadLayerErrorFunc;
    zIndex?: number;
    isPrint?: boolean;
}

export interface BuildedLayerResultError {
    hasError: true;
    result: MapLayer;
}

export interface BuildedLayerResultOk {
    hasError: false;
    result: BaseLayer;
}

export type BuildedLayerResult = BuildedLayerResultError | BuildedLayerResultOk;

const iconStylesMap: { [key: string]: Style } = {};

const WKT = new wkt();
const ProxyWMSWPSPage = "DbMAP_CsWps/proxyWmsWps.jsp";

export default class LayerBuilder {
    private http: HTTPClient;
    private noAuthHttp: HTTPClient;
    private parser: WMTSCapabilities;
    private ssoStore?: SsoVuexModule;

    constructor(http: HTTPClient, ssoStore?: SsoVuexModule) {
        this.noAuthHttp = new HTTPClient();
        this.http = http;
        this.parser = new WMTSCapabilities();
        this.ssoStore = ssoStore;
    }

    public async buildLayersWithOption(
        layers: MapLayer[],
        buildLayerOptions?: BuildLayerOptions
    ): Promise<BuildedLayerResult[]> {
        const res: BuildedLayerResult[] = [];
        let buildedLayer: BaseLayer | undefined;
        for (let l = 0; l < layers.length; l++) {
            try {
                buildedLayer = await this.buildSingleLayer(
                    layers[l],
                    buildLayerOptions?.mbr,
                    buildLayerOptions?.pkCuaa,
                    buildLayerOptions?.pkCuaaSCLeader,
                    buildLayerOptions?.campaign,
                    buildLayerOptions?.styleFunction,
                    l,
                    buildLayerOptions?.setOrigin,
                    buildLayerOptions?.onLoadLayerError,
                    buildLayerOptions?.isPrint
                );
                if (buildedLayer) {
                    res.push({ result: buildedLayer, hasError: false });
                } else {
                    res.push({ result: layers[l], hasError: true });
                }
            } catch (error) {
                res.push({ result: layers[l], hasError: true });
                console.error(error);
            }
        }
        return res;
    }

    public async buildSingleLayerWithOptions(
        layer: MapLayer,
        buildLayerOptions?: BuildLayerOptions
    ): Promise<BuildedLayerResult> {
        try {
            const buildedLayer = await this.buildSingleLayer(
                layer,
                buildLayerOptions?.mbr,
                buildLayerOptions?.pkCuaa,
                buildLayerOptions?.pkCuaaSCLeader,
                buildLayerOptions?.campaign,
                buildLayerOptions?.styleFunction,
                buildLayerOptions?.zIndex,
                buildLayerOptions?.setOrigin,
                buildLayerOptions?.onLoadLayerError,
                buildLayerOptions?.isPrint
            );
            if (buildedLayer) {
                return { result: buildedLayer, hasError: false };
            }
        } catch (error) {
            console.error(error);
        }
        return { result: layer, hasError: true };
    }

    public async buildLayers(
        layers: MapLayer[],
        mbr?: Extent,
        pkCuaa?: number | null,
        pkCuaaSCLeader?: number | null,
        campaign?: number,
        styleFunction?: StyleFunction,
        setOrigin = false,
        onLoadLayerError?: OnLoadLayerErrorFunc,
        isPrint = false
    ): Promise<BaseLayer[]> {
        const res: BaseLayer[] = [];
        let buildedLayer: BaseLayer | undefined;

        for (let l = 0; l < layers.length; l++) {
            try {
                buildedLayer = await this.buildSingleLayer(
                    layers[l],
                    mbr,
                    pkCuaa,
                    pkCuaaSCLeader,
                    campaign,
                    styleFunction,
                    l,
                    setOrigin,
                    onLoadLayerError,
                    isPrint
                );
                if (buildedLayer) {
                    res.push(buildedLayer);
                }
            } catch (error) {
                console.error(error);
            }
        }
        return res;
    }

    public async buildSingleLayer(
        layer: MapLayer,
        mbr?: Extent,
        pkCuaa?: number | null,
        pkCuaaSCLeader?: number | null,
        campaign?: number,
        styleFunction?: StyleFunction,
        zIndex = 0,
        setOrigin = false,
        onLoadLayerError?: OnLoadLayerErrorFunc,
        isPrint = false
    ): Promise<BaseLayer | undefined> {
        let res: BaseLayer | undefined;
        switch (layer.type) {
            case "WMS":
                res = this.buildWMSLayer(layer, setOrigin, onLoadLayerError, isPrint);
                break;
            case "WPS":
                res = this.buildWPSLayer(layer, setOrigin, isPrint);
                break;
            case "WMTS":
                res = await this.buildWMTSLayer(layer, setOrigin, onLoadLayerError, isPrint);
                break;
            case "DBGIS":
                if (!mbr) {
                    throw new Error("Missing mbr");
                }
                res = await this.buildDBGISLayer(layer, mbr, pkCuaa, pkCuaaSCLeader, campaign, styleFunction);
                break;
            case "BING":
                res = this.buildBingLayer(layer, onLoadLayerError);
                break;
            case "GEORASTER":
                res = this.buildGeoRaster(layer, setOrigin, onLoadLayerError, isPrint);
                break;
            default:
                throw new Error("Layer type not supported");
        }
        if (res) {
            res.set(LAYER_ID, layer.pkid);
            res.setZIndex(zIndex);
        }
        return res;
    }

    private buildGeoRaster(
        layer: GeoRaster,
        setOrigin = false,
        onLoadLayerError?: OnLoadLayerErrorFunc,
        isPrint = false
    ): BaseLayer | undefined {
        let buildedLayer = undefined;

        const sourceParams: any = {
            url: this.computeLayerUrl(layer.url, isPrint),
            ratio: 1,
            params: {
                STYLES: layer.styles ? layer.styles : "",
                VERSION: layer.WMSversion ? layer.WMSversion : "1.1.1",
                TRANSPARENT: layer.transparent ? "TRUE" : "FALSE",
                BGCOLOR: layer.bgcolor,
                FORMAT: layer.format,
                EXCEPTIONS: layer.WMSexceptions,
                SRS: layer.srs,
                ...layer.params
            },
            crossOrigin: this.computeCrossOrigin(layer, setOrigin)
        };

        const source = new ImageWMS(sourceParams);
        source.on("imageloaderror", event => {
            this.onLoadLayerError(layer, onLoadLayerError);
        });

        buildedLayer = new ImageLayer({
            source: source,
            visible: this.computeVisibility(layer)
        });

        return buildedLayer;
    }

    //TODO guardare flipFlag su openLayer
    private buildWMSLayer(
        layer: WMSLayer,
        setOrigin = false,
        onLoadLayerError?: OnLoadLayerErrorFunc,
        isPrint = false
    ): BaseLayer | undefined {
        if (!layer.layers || layer.layers.length === 0) {
            throw new Error(`Malformatted WMS ${layer.pkid}, must have at least one layer`);
        }
        if (layer.url.indexOf(ProxyWMSWPSPage) != -1) {
            const serverUrl = layer.url.replace(ProxyWMSWPSPage, "3draster_deegree-wps");
            layer.params.serverUrl = serverUrl;
        }
        const layers = layer.layers.map(l => l.name);
        if (layers.length === 0) {
            return;
        }
        const sourceParams = {
            url: this.computeLayerUrl(layer.url, isPrint),
            ratio: 1,
            params: {
                LAYERS: layer.layers.map(l => l.name),
                STYLES: layer.styles ? layer.styles : "",
                VERSION: layer.WMSversion ? layer.WMSversion : "1.1.1",
                TRANSPARENT: layer.transparent ? "TRUE" : "FALSE",
                BGCOLOR: layer.bgcolor,
                FORMAT: layer.format,
                EXCEPTIONS: layer.WMSexceptions,
                SRS: layer.srs,
                ...this.getExtraLanguageParam(layer),
                ...layer.params
            },
            crossOrigin: this.computeCrossOrigin(layer, setOrigin)
        };

        const resolutions = this.computeResolution(layer);

        const layerParams = {
            minResolution: resolutions.maxResolution,
            maxResolution: resolutions.minResolution,
            visible: this.computeVisibility(layer)
        };

        if (layer.tile === "N") {
            const source = new ImageWMS(sourceParams);
            source.on("imageloaderror", event => {
                this.onLoadLayerError(layer, onLoadLayerError);
            });
            return new ImageLayer({
                source: source,
                ...layerParams
            });
        } else {
            throw new Error("WMS " + layer.label + " tiled not supported, use WMTS");
        }
    }

    private buildWPSLayer(layer: WPSLayer, setOrigin = false, isPrint = false): BaseLayer | undefined {
        layer.url = layer.url.replace("3draster_deegree-wps/services", ProxyWMSWPSPage);
        const serverUrl = layer.url.replace(ProxyWMSWPSPage, "3draster_deegree-wps");
        layer.params.serverUrl = serverUrl;

        layer.tile = "N";

        const WMSLayer: WMSLayer = { ...layer, type: "WMS" };
        return this.buildWMSLayer(WMSLayer, setOrigin, undefined, isPrint);
    }

    private getExtraLanguageParam(layer: WLayer): Record<string, string> {
        const params = layer.params || {};
        const paramKeys = Object.keys(params);
        const hasExtraViewContext = paramKeys.some(key => key.toLowerCase() === "extraview_context");
        const hasExtraLanguage = paramKeys.some(key => key.toLowerCase() === "extralanguage");
        const locale = this.ssoStore?.user?.locale;

        if (!hasExtraViewContext || hasExtraLanguage || !locale) {
            return {};
        }

        return {
            extralanguage: locale
        };
    }

    private buildBingLayer(layer: BingLayer, onLoadLayerError?: OnLoadLayerErrorFunc): BaseLayer {
        const source = new BingMaps({
            key: layer.params.key,
            imagerySet: layer.params.bingType,
            // <= 19 will alwasy see an image, but at higher zoom is stretched, > 19 at higher zoom you will see the bing placeholder
            maxZoom: 19
        });
        source.on("tileloaderror", event => {
            this.onLoadLayerError(layer, onLoadLayerError);
        });
        const bingLayer = new TileLayer({
            visible: this.computeVisibility(layer),
            preload: Infinity,
            source: source
        });

        return bingLayer;
    }

    private async buildWMTSLayer(
        layer: WMTSLayer,
        setOrigin = false,
        onLoadLayerError?: OnLoadLayerErrorFunc,
        isPrint = false
    ): Promise<BaseLayer> {
        let http = this.http;
        if (layer.params.gptoken) {
            http = this.noAuthHttp;
        }
        const res = await http.get(layer.url, {
            params: {
                gptoken: layer.params.gptoken,
                REQUEST: "GetCapabilities",
                SERVICE: "WMTS"
            }
        });
        const capabilities = this.parser.read(res.data);
        const resolutions = this.computeResolution(layer);

        try {
            const options = optionsFromCapabilities(capabilities, {
                layer: layer.layers[0].name,
                matrixSet: layer.tilematrixset,
                crossOrigin: this.computeCrossOrigin(layer, setOrigin),
                updateWhileAnimating: false
            });
            if (options.url) {
                options.url = this.computeLayerUrl(options.url, isPrint);
            }
            if (options.urls) {
                options.urls = options.urls.map(url => this.computeLayerUrl(url, isPrint));
            }
            const source = new WMTS(options);
            source.on("tileloaderror", event => {
                this.onLoadLayerError(layer, onLoadLayerError);
            });
            return new TileLayer({
                source: new WMTS(options),
                minResolution: resolutions.maxResolution,
                maxResolution: resolutions.minResolution,
                visible: this.computeVisibility(layer)
            });
        } catch (error) {
            console.error(error);
            throw new Error("Malformatted WMTS capabilities");
        }
    }

    private async buildDBGISLayer(
        layer: DBGISLayer,
        mbr: Extent,
        pkCuaa?: number | null,
        pkCuaaSCLeader?: number | null,
        campaign?: number,
        styleFunction?: StyleFunction
    ): Promise<BaseLayer> {
        const geoJsonObj = await this.getVectorFeatures(layer, mbr, pkCuaa, pkCuaaSCLeader, campaign);

        const effectiveLayer = layer.layers[0];
        return new VectorLayer({
            source: new VectorSource({
                features: geoJsonObj
            }),
            style: feature => {
                if (styleFunction) {
                    const res = styleFunction(feature, effectiveLayer.name);
                    if (res) {
                        return res;
                    }
                }

                const src = effectiveLayer.image_base_url + feature.getProperties().image_url;
                let ret = iconStylesMap[src];
                if (!ret) {
                    ret = new Style({ image: new Icon({ src }) });
                    iconStylesMap[src] = ret;
                }
                return ret;
            },
            maxResolution: effectiveLayer.minRes ? effectiveLayer.minRes : undefined,
            minResolution: effectiveLayer.maxRes ? effectiveLayer.maxRes : undefined,
            visible: effectiveLayer.visible
        });
    }

    private onLoadLayerError(layerDef: MapLayer, onLoadLayerError?: OnLoadLayerErrorFunc) {
        console.error("Error loading image " + layerDef.name);
        if (onLoadLayerError) {
            onLoadLayerError(layerDef);
        }
    }

    async getVectorFeatures(
        layer: DBGISLayer,
        mbr: Extent,
        pkCuaa?: number | null,
        pkCuaaSCLeader?: number | null,
        campaign?: number
    ): Promise<Feature<Geometry>[]> {
        const effectiveLayer = layer.layers[0];

        let url = effectiveLayer.url.replace("&dbgauth=basic", "");

        if (pkCuaa) {
            url = url.replace("#extraoid:int#", pkCuaa.toString());
        }

        if (pkCuaaSCLeader) {
            url = url.replace("#extrascs:int#", pkCuaaSCLeader.toString());
        }

        if (campaign) {
            url = url.replace("#extrayear:int#", campaign.toString());
        }

        const res = await this.http.get(url, {
            params: {
                x1: mbr[0],
                y1: mbr[1],
                x2: mbr[2],
                y2: mbr[3]
            }
        });

        const geoJsonObj: Feature<Geometry>[] = [];
        const geoJson = new GeoJSON();

        res.data.entities.forEach((en: AbcFeature) => {
            geoJsonObj.push(
                new Feature({
                    geometry: geoJson.readGeometry(en.gshape),
                    category: en.category,
                    image_url: en.image_url,
                    description: en.description,
                    pkid: en.pkid
                })
            );
        });

        return geoJsonObj;
    }

    private computeLayerUrl(url: string, isPrint: boolean) {
        if (!isPrint) {
            return url;
        }
        const noCacheString = "print=true";
        if (url.includes("?")) {
            return url + "&" + noCacheString;
        }
        return url + "?" + noCacheString;
    }

    private computeVisibility(layer: MapLayer): boolean {
        const isPriorityVisible = (layer.priority && layer.priority === 1) || !layer.priority;
        if (layer.layers.length && isPriorityVisible) {
            return layer.layers.some(child => child.visible);
        }
        if (layer.type === "DBGIS") {
            return false;
        }
        return layer.visible && isPriorityVisible ? true : false;
    }

    private computeResolution(layer: WMSLayer | WMTSLayer) {
        const res = {
            minResolution: layer.maxRes ? layer.maxRes : undefined,
            maxResolution: layer.minRes ? layer.minRes : undefined
        };
        if (res.maxResolution && res.minResolution) {
            return res;
        } else if (layer.layers) {
            const minReslayers = layer.layers.filter(l => l.minRes !== null).map(l => l.minRes) as number[];
            const maxReslayers = layer.layers.filter(l => l.maxRes !== null).map(l => l.maxRes) as number[];
            res.maxResolution = Math.min(...maxReslayers);
            res.minResolution = Math.max(...minReslayers);
        }

        if (res.maxResolution === Infinity) {
            res.maxResolution = undefined;
        }

        if (res.minResolution === -Infinity) {
            res.minResolution = undefined;
        }
        return res;
    }

    private computeCrossOrigin(layer: WMTSLayer | WMSLayer | GeoRaster, setOrigin: boolean) {
        if (setOrigin && !layer.url.startsWith(window.origin)) {
            return "Anonymous";
        }
        return null;
    }
}

function getZoomFromResolution(resolution: number): number {
    const maxResolution = 156543.03392804097; // at zoom level 0
    return Math.log2(maxResolution / resolution);
}
function getSimplifyToleranceFromResolution(resolution: number): number {
    const pixelFactor = 3.5; // increase to increase simplification
    const maxTolerance = 200; // maximum tolerance for simplification, so that features are not overly simplified at outer zoom levels, increase to increase simplification
    return Math.min(maxTolerance, resolution * pixelFactor);
}

const clusterDefaultStyle = new Style({
    image: new CircleStyle({
        radius: 14,
        stroke: new Stroke({
            color: "#3c6c7c",
            width: 2
        }),
        fill: new Fill({
            color: "#fff"
        })
    }),
    text: new Text({
        font: "bold 14px sans-serif",
        offsetY: 2,
        fill: new Fill({
            color: "#3c6c7c"
        })
    })
});

export function buildVectorLayer(wkts: WktInfo[], options?: BuildVectorOptions, force?: boolean) {
    if (!options) {
        options = {};
    }
    if (!options.features) {
        options.features = [];
    }
    let feat;
    wkts.forEach(w => {
        feat = WKT.readFeature(w.wkt);
        feat.set(FEATURE_ID, w.id ? w.id : ID.next());
        if (w.additionalProperties) {
            feat.setProperties(w.additionalProperties);
        }
        options!.features?.push(feat);
    });
    const featureSource = new VectorSource({
        features: options?.features
    });
    let isClusterable = false;
    if (featureSource.getFeatures().length > MAX_COUNT_BEFORE_GEOM_OPTIMIZATION && !force) {
        isClusterable = featureSource.getFeatures().every(feature => {
            const geometry = feature.getGeometry();
            return (
                (geometry && geometry.getType() === "Polygon") || (geometry && geometry.getType() === "MultiPolygon")
            );
        });
    }
    const layer = new VectorLayer({
        source: featureSource,
        minZoom: isClusterable ? CLUSTER_THRESHOLD_LEVEL : undefined,
        style: function(feature, resolution) {
            if (options?.styleFunction) {
                const res = options?.styleFunction(feature, "null", resolution);
                if (res) {
                    const geometry = (feature as Feature<Geometry>).getGeometry();
                    if (geometry && typeof geometry.simplify === "function") {
                        const zoom = getZoomFromResolution(resolution);
                        const minZoomForSimplification = 15; // full detail at zoom X and higher, decrease to increase simplification
                        if (zoom < minZoomForSimplification) {
                            const tolerance = getSimplifyToleranceFromResolution(resolution);
                            const simplifiedGeometry = geometry.simplify(tolerance);
                            if (typeof (res as any).setGeometry === "function") {
                                res.setGeometry(simplifiedGeometry);
                            }
                        } else {
                            if (typeof (res as any).setGeometry === "function") {
                                res.setGeometry(geometry);
                            }
                        }
                    } else if (geometry) {
                        if (typeof (res as any).setGeometry === "function") {
                            res.setGeometry(geometry);
                        }
                    }
                    return res;
                }
            }
            return new Style({
                stroke: new Stroke({
                    color: "blue"
                }),
                fill: new Fill({
                    color: [2, 2, 255, 0.3]
                })
            });
        }
    });
    layer.setZIndex(999);
    layer.set(OVERLAY_ID, ID.next());
    layer.set(ADD_TO_LEGEND, options?.addToLegend);
    layer.set(LAYER_ID, options?.layerId);
    layer.setProperties({ ...layer.getProperties(), ...options?.additionalProperties });
    return layer;
}

export function buildClusterVectorLayer(wkts: WktInfo[], options?: BuildVectorOptions, force?: boolean) {
    if (!options) {
        options = {};
    }
    if (!options.features) {
        options.features = [];
    }
    let feat;
    wkts.forEach(w => {
        feat = WKT.readFeature(w.wkt);
        feat.set(FEATURE_ID, w.id ? w.id : ID.next());
        if (w.additionalProperties) {
            feat.setProperties(w.additionalProperties);
        }
        options!.features?.push(feat);
    });

    const featureSource = new VectorSource({
        features: options?.features
    });
    let isClusterable = false;
    if (featureSource.getFeatures().length > MAX_COUNT_BEFORE_GEOM_OPTIMIZATION || force) {
        isClusterable = featureSource.getFeatures().every(feature => {
            const geometry = feature.getGeometry();
            return (
                (geometry && geometry.getType() === "Polygon") || (geometry && geometry.getType() === "MultiPolygon")
            );
        });
    }
    const clusterPointsFeatures: Feature<Point>[] = [];
    if (isClusterable) {
        featureSource.getFeatures().forEach(feature => {
            const geometry = feature.getGeometry();
            if (geometry && (geometry.getType() === "Polygon" || geometry.getType() === "MultiPolygon")) {
                let centroid: Point | null = null;
                if (geometry.getType() === "Polygon") {
                    centroid = (geometry as Polygon).getInteriorPoint();
                } else if (geometry.getType() === "MultiPolygon") {
                    const points = (geometry as MultiPolygon).getInteriorPoints();
                    centroid = points.getFirstCoordinate() ? new Point(points.getFirstCoordinate()) : null;
                }
                if (centroid) {
                    const pointFeature = new Feature(centroid);
                    pointFeature.set("polygonFeature", feature); // keep a reference
                    clusterPointsFeatures.push(pointFeature);
                }
            }
        });
    }
    const clusterPointsFeaturesSource = new VectorSource({
        features: clusterPointsFeatures
    });
    const clusterSource = new Cluster({
        distance: 50,
        source: clusterPointsFeaturesSource
    });
    const layer = new VectorLayer({
        source: clusterSource,
        maxZoom: CLUSTER_THRESHOLD_LEVEL,
        style: function(feature, resolution) {
            // const isCluster = feature.get("features").length > 1;
            // if (isCluster) {
            if (options?.styleFunction) {
                const res = options?.styleFunction(feature, "null", resolution);
                if (res) {
                    return res;
                }
            }
            const text = feature.get("features").length.toString();
            const style = clusterDefaultStyle.clone();
            style.getText().setText(text);
            return style;
        }
    });
    layer.setZIndex(999);
    layer.set(OVERLAY_ID, ID.next());
    layer.set(ADD_TO_LEGEND, options?.addToLegend);
    layer.set(LAYER_ID, options?.layerId);
    layer.setProperties({ ...layer.getProperties(), ...options?.additionalProperties });
    return layer;
}

export function buildVectorLayerFromWKT(
    wkts: WktInfo[],
    features?: Feature<Geometry>[],
    styleFunction?: StyleFunction,
    force?: boolean
) {
    if (!features) {
        features = [];
    }
    let feat;
    wkts.forEach(w => {
        feat = WKT.readFeature(w.wkt);
        feat.set(FEATURE_ID, w.id ? w.id : ID.next());
        if (w.additionalProperties) {
            feat.setProperties(w.additionalProperties);
        }
        features?.push(feat);
    });
    const featureSource = new VectorSource({
        features: features
    });
    let isClusterable = false;
    if (featureSource.getFeatures().length > MAX_COUNT_BEFORE_GEOM_OPTIMIZATION && !force) {
        isClusterable = featureSource.getFeatures().every(feature => {
            const geometry = feature.getGeometry();
            return (
                (geometry && geometry.getType() === "Polygon") || (geometry && geometry.getType() === "MultiPolygon")
            );
        });
    }

    const layer = new VectorLayer({
        source: featureSource,
        minZoom: isClusterable ? CLUSTER_THRESHOLD_LEVEL : undefined,
        style: function(feature, resolution) {
            if (styleFunction) {
                const res = styleFunction(feature, "null");
                if (res) {
                    const geometry = (feature as Feature<Geometry>).getGeometry();
                    if (geometry && typeof geometry.simplify === "function") {
                        const zoom = getZoomFromResolution(resolution);
                        const minZoomForSimplification = 15; // full detail at zoom X and higher, decrease to increase simplification
                        if (zoom < minZoomForSimplification) {
                            const tolerance = getSimplifyToleranceFromResolution(resolution);
                            const simplifiedGeometry = geometry.simplify(tolerance);
                            if (typeof (res as any).setGeometry === "function") {
                                res.setGeometry(simplifiedGeometry);
                            }
                        } else {
                            if (typeof (res as any).setGeometry === "function") {
                                res.setGeometry(geometry);
                            }
                        }
                    } else if (geometry) {
                        if (typeof (res as any).setGeometry === "function") {
                            res.setGeometry(geometry);
                        }
                    }
                    return res;
                }
            }
            return new Style({
                stroke: new Stroke({
                    color: "blue"
                }),
                fill: new Fill({
                    color: [2, 2, 255, 0.3]
                })
            });
        }
    });
    layer.setZIndex(999);
    layer.set(OVERLAY_ID, ID.next());
    return layer;
}

export function buildClusterVectorLayerFromWKT(
    wkts: WktInfo[],
    features?: Feature<Geometry>[],
    styleFunction?: StyleFunction,
    force?: boolean
) {
    if (!features) {
        features = [];
    }
    let feat;
    wkts.forEach(w => {
        feat = WKT.readFeature(w.wkt);
        feat.set(FEATURE_ID, w.id ? w.id : ID.next());
        if (w.additionalProperties) {
            feat.setProperties(w.additionalProperties);
        }
        features?.push(feat);
    });

    const featureSource = new VectorSource({
        features: features
    });
    let isClusterable = false;
    if (featureSource.getFeatures().length > MAX_COUNT_BEFORE_GEOM_OPTIMIZATION || force) {
        isClusterable = featureSource.getFeatures().every(feature => {
            const geometry = feature.getGeometry();
            return (
                (geometry && geometry.getType() === "Polygon") || (geometry && geometry.getType() === "MultiPolygon")
            );
        });
    }
    const clusterPointsFeatures: Feature<Point>[] = [];
    if (isClusterable) {
        featureSource.getFeatures().forEach(feature => {
            const geometry = feature.getGeometry();
            if (geometry && (geometry.getType() === "Polygon" || geometry.getType() === "MultiPolygon")) {
                let centroid: Point | null = null;
                if (geometry.getType() === "Polygon") {
                    centroid = (geometry as Polygon).getInteriorPoint();
                } else if (geometry.getType() === "MultiPolygon") {
                    const points = (geometry as MultiPolygon).getInteriorPoints();
                    centroid = points.getFirstCoordinate() ? new Point(points.getFirstCoordinate()) : null;
                }
                if (centroid) {
                    const pointFeature = new Feature(centroid);
                    pointFeature.set("polygonFeature", feature); // keep a reference
                    clusterPointsFeatures.push(pointFeature);
                }
            }
        });
    }
    const clusterPointsFeaturesSource = new VectorSource({
        features: clusterPointsFeatures
    });
    const clusterSource = new Cluster({
        distance: 50,
        source: clusterPointsFeaturesSource
    });
    const layer = new VectorLayer({
        source: clusterSource,
        maxZoom: CLUSTER_THRESHOLD_LEVEL,
        style: function(feature, resolution) {
            // const isCluster = feature.get("features").length > 1;
            // if (isCluster) {
            if (styleFunction) {
                const res = styleFunction(feature, "null", resolution);
                if (res) {
                    return res;
                }
            }
            const text = feature.get("features").length.toString();
            const style = clusterDefaultStyle.clone();
            style.getText().setText(text);
            return style;
        }
    });
    layer.setZIndex(999);
    layer.set(OVERLAY_ID, ID.next());
    return layer;
}

export function writeFeature(feature: Feature<Geometry>) {
    return WKT.writeFeature(feature);
}

export function readFeature(wkt: WktInfo) {
    const feature = WKT.readFeature(wkt.wkt);
    feature.set(FEATURE_ID, wkt.id ? wkt.id : ID.next());
    return feature;
}

export function isPickedObjectCluster(pickedObject: Selected[]): boolean {
    const firstPickedFeature = pickedObject?.[0]?.features?.[0] as any;
    const isCluster =
        Array.isArray(firstPickedFeature?.values_?.features) && firstPickedFeature.values_.features.length > 0;
    return isCluster;
}

export function getClusterZoomGeometry(pickedObject: Selected[]): GeometryCollection | null {
    const firstPickedFeature = pickedObject?.[0]?.features?.[0] as any;
    if (firstPickedFeature) {
        const clusterFeatures = firstPickedFeature.values_.features as Feature<OlGeometry>[];
        if (clusterFeatures.length > 0 && clusterFeatures.filter(f => f.getGeometry()).length > 0) {
            const totalFeatures: Feature<Geometry>[] = [];
            Array.prototype.push.apply(totalFeatures, clusterFeatures);
            const geometriesTemp: Geometry[] = totalFeatures.map(f => f.getGeometry() as Geometry);
            const geometries: GeometryCollection = new GeometryCollection();
            geometries.setGeometries(geometriesTemp);
            return geometries;
        }
    }
    return null;
}
