import Vue from "vue";
import { AbacoWebModule, ApplicationReadyEvent } from '@abaco/web-common/src/app';
import globals from "./globals";
import MapVuexModule from './state';
import { HTTPClient } from '@abaco/web-common/src/HTTP';
import LayerBuilder from './LayerBuilder';
import { MapBusEvent } from './models/MapEvents';
import MapApi from "./api/MapApi";
import GeocodingApi from "./api/GeocodingApi";
import ParcelApi from "./api/ParcelApi";
import SsoVuexModule from "@abaco/sso-web-module/src/abaco-module/state";
import SSOModule from "@abaco/sso-web-module/src/abaco-module";
import WpsLegendBuilder from "./services/WpsLegendBuilder";
import { MapConstructOptions } from "./models/AbacoMap";
import ThemeApi from "./api/ThemeApi";

export const MODULE_ID = "map_web_module";

const state = new MapVuexModule();

interface BusReady {
    readyCount: number;
    retryCount: number;
}

export default class MapModule implements AbacoWebModule {
    public static MODULE_ID = MODULE_ID;

    private layerBuilder!: LayerBuilder;
    private mapBus!: Vue;
    private busReady!: { [mapId: string]: BusReady };
    private apiCreated = false;
    private ssoStore!: SsoVuexModule;

    private mpApi!: MapApi;
    private gcApi!: GeocodingApi;
    private thApi!: ThemeApi;
    private prApi!: ParcelApi;
    private wpsBuilder!: WpsLegendBuilder;
    private environment!: string;

    readonly apiAlertTimeout = 500;

    readonly id = MODULE_ID;
    readonly globalComponents = globals;
    readonly vuexModule = state;
    countingTime = 0;
    http!: HTTPClient;

    constructor(options?: MapConstructOptions) {
        this.mapBus = new Vue();
        this.busReady = {};
        if(options){
            this.environment = options.environment || "portal";
        }
    }

    async onApplicationReady(event: ApplicationReadyEvent) {
        const ssoModule = event.modules.find(m => m.id === SSOModule.MODULE_ID) as SSOModule | undefined;
        if (!ssoModule) {
            throw new Error("SSO module non found");
        }
        this.ssoStore = ssoModule.vuexModule;
    }

    async beforeEnterAnyRoutes(http: HTTPClient) {
        if (this.apiCreated) {
            return;
        }
        this.apiCreated = true;
        this.http = http;

        const LayerBuilder = (await import("./LayerBuilder")).default;
        this.layerBuilder = new LayerBuilder(http, this.ssoStore);

        const MapApi = (await import("./api/MapApi")).default;
        this.mpApi = new MapApi(http);

        const GeocodingApi = (await import("./api/GeocodingApi")).default;
        this.gcApi = new GeocodingApi(http);

        const ThemeApi = (await import("./api/ThemeApi")).default;
        this.thApi = new ThemeApi(http)

        const ParcelApi = (await import("./api/ParcelApi")).default;
        this.prApi = new ParcelApi(http)

        const WpsLegendBuilder = (await import("./services/WpsLegendBuilder")).default;
        this.wpsBuilder = new WpsLegendBuilder(http, this.ssoStore);
    }

    public get LayerBuilder(): LayerBuilder {
        return this.layerBuilder;
    }

    public get mapApi(): MapApi {
        return this.mpApi;
    }

    public get themeApi(): ThemeApi {
        return this.thApi
    }

    public get geocodingApi(): GeocodingApi {
        return this.gcApi;
    }

    public get parcelApi(): ParcelApi {
        return this.prApi;
    }

    public get wpsLegendBuilder(): WpsLegendBuilder {
        return this.wpsBuilder;
    }

    public emit(mapId: string, address: string, event: MapBusEvent) {
        if (this.busReady[mapId].readyCount >= 2) {
            this.mapBus.$emit(mapId + address, event)
        } else if (this.busReady[mapId].retryCount > 0) {
            this.busReady[mapId].retryCount--;
            setTimeout(() => {
                this.emit(mapId, address, event);
            }, 500);
        }
    }

    public setReady(mapId: string) {
        if (!this.busReady[mapId]) {
            this.busReady[mapId] = {
                retryCount: 4,
                readyCount: 1
            }
        } else {
            this.busReady[mapId].readyCount++;
        }
    }

    public getMapBus() {
        return this.mapBus;
    }

    public setInvalidatePlotCache(val: boolean){
        this.vuexModule.invalidatePlotCache = val;
    }

}
