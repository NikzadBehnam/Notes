import { DateHelper } from "@abaco/web-components/src/components/DateUtils";
import { PagingParams, PagedResults } from "@abaco/web-common/src/Paging";
import { HTTPClient, propsToDatePaged, propsToDate } from "@abaco/web-common/src/HTTP";
import {
    Activity,
    Bbch,
    FormType,
    ActivityOut,
    ActivityFormDataOut,
    ActivityProvider,
    ActivityMarker,
    ViolationItem,
    PlotSettings,
    ListActivityInMatrix
} from "../models/Activity";
import { Task } from "../models/Task";
import { toHA } from "../models/Utils";
import { copyUnitMeasure } from "../models/Product";
import axios, { CancelTokenSource } from "axios";
import { TemporaryActionOut } from "../models/Action";

const DETENTORI_ENDPOINTS: Record<string, string> = {
    TESTBLUARANCIOACTIVITIES: "https://test-abaco-activities-api.bluarancio.com", // admin.bluarancio.new / Welcome_0
    COLBLUARANCIOACTIVITIES: "https://collaudo-abaco-activities-api.bluarancio.com", // admin.bluarancio.new / Welcome_0
    LIVBLUARANCIOACTIVITIES: "https://demetra-activities-api.bluarancio.com", // admin.bluarancio.new / Welcome_0
    LOCAL: (typeof window !== "undefined")
        ? (`http://localhost:${process.env.VUE_APP_DEV_SERVER_PORT || window.location.port}`)
        : `http://localhost:${process.env.VUE_APP_DEV_SERVER_PORT}`,
  };
     
function getDetentoriEnvFromHost(): keyof typeof DETENTORI_ENDPOINTS {
    const host = window.location.hostname.toLowerCase();
    if (host.includes("localhost")) return "TESTBLUARANCIOACTIVITIES";
    if (host.includes("test")) return "TESTBLUARANCIOACTIVITIES";
    if (host.includes("collaudo")) return "COLBLUARANCIOACTIVITIES";
    return "LIVBLUARANCIOACTIVITIES";
}

export default class ActivityApi {
    private http: HTTPClient;
    private cancelTokenSource: CancelTokenSource | null;
    private activitiesColdirettiUrl: string;

    constructor(http: HTTPClient) {
        this.http = http;
        this.cancelTokenSource = null;
        const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
        const env = getDetentoriEnvFromHost();
        this.activitiesColdirettiUrl = DETENTORI_ENDPOINTS[env];
    }

    public async getPlotSettings(pkCuaa: number): Promise<PlotSettings> {
        const res = await this.http.get(`/sitiagri-rest-api/api_basic/v1/plots/subjects/${pkCuaa}/settings`);
        return res.data;
    }

           
    public async getFormTypes(
        pkCuaa: number,
        pagingParams: PagingParams,
        filter?: number
    ): Promise<PagedResults<FormType>> {
        if (this.cancelTokenSource) {
            this.cancelTokenSource.cancel();
        }
        this.cancelTokenSource = axios.CancelToken.source();
        const res = await this.http.get(`/sitiagri-rest-api/api_basic/v1/plots/subjects/${pkCuaa}/form_types`, {
            params: {
                offset: pagingParams.offset,
                count: pagingParams.count,
                filter: filter ? `frm_type_id eq ${filter}` : undefined
            },
            cancelToken: this.cancelTokenSource?.token
        });

        return res.data;
    }

    public async getFormType(id: number): Promise<FormType> {
        const res = await this.http.get(`/sitiagri-rest-api/api_basic/v1/plots/form_types/${id}`, {});
        return res.data;
    }

    public async getActivity(plot_id: number, action_id: number): Promise<Activity> {
        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/plots/plots/${plot_id}/activities/${action_id}`
        );

        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        toHA(res.data, ["irrigation.area_covered"]);
        copyUnitMeasure(res.data.products, "sco_unit_measure", "unit_measure");
        copyUnitMeasure(res.data.phytochemicals, "sco_unit_measure", "unit_measure");
        copyUnitMeasure(res.data.fertilizers, "sco_unit_measure", "unit_measure");
        //res.data = toShortDescription(res.data);
        return res.data;
    }

    public async getProtocolName(pkCuaa: number, protocol_id: number): Promise<string | null> {
        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/protocols/subjects/${pkCuaa}/dictionary_protocols`,
            {
                params: {
                    count: 1,
                    offset: 0,
                    filter: `protocol_id eq ${protocol_id}`
                }
            }
        );

        return res.data.records.length > 0 ? res.data.records[0].template_description : null;
    }

    public async getActivityWOPlot(pk_cuaa: number, campaign: number, action_id: number): Promise<Activity> {
        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pk_cuaa}/${campaign}/activities/${action_id}`
        );

        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        copyUnitMeasure(res.data.products, "sco_unit_measure", "unit_measure");
        copyUnitMeasure(res.data.phytochemicals, "sco_unit_measure", "unit_measure");
        //res.data = toShortDescription(res.data);
        return res.data;
    }

    //PLANNED ACTIVITIES EXECUTED AND NOT EXECUTED OF THE DAY
    public async getDayPlannedActivities(
        pkCuaa: number,
        campaign: number,
        from: Date | null,
        to: Date | null
    ): Promise<Activity[]> {
        const fromTime = from ? new DateHelper(from).startOfDay().toDate() : null;
        const fromTimeConverted = fromTime ? new DateHelper(fromTime).format("yyyy-MM-dd HH:mm:ss") : null;
        const toTime = to ? new DateHelper(to).startOfDay().toDate() : null;
        if (toTime) {
            toTime.setHours(23, 59, 59, 999);
        }
        const toTimeConverted = toTime ? new DateHelper(toTime).format("yyyy-MM-dd HH:mm:ss") : null;

        const filter: string[] = [];
        filter.push(`fg_worker eq 1`);
        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pkCuaa}/${campaign}/activities`,
            {
                params: {
                    filter: filter.length ? filter : undefined,
                    from: fromTimeConverted && toTimeConverted ? fromTimeConverted : undefined,
                    to: fromTimeConverted && toTimeConverted ? toTimeConverted : undefined,
                    sort: `-planned_date`,
                    resources: true
                }
            }
        );
        propsToDatePaged(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        //res.data.records = toShortDescriptionArray(res.data.records);
        return res.data.records;
    }

    public async getPlannedActivities(
        pkCuaa: number,
        campaign: number,
        pagingParams: PagingParams,
        from: Date | null,
        to: Date | null,
        showExecuted: boolean,
        showNotExecuted: boolean,
        plot_id?: number,
        excludeProtocols?: boolean,
        workerId?: number | null
    ): Promise<PagedResults<Activity>> {
        const fromTime = from ? new DateHelper(from).startOfDay().toDate() : null;
        const fromTimeConverted = fromTime ? new DateHelper(fromTime).format("yyyy-MM-dd HH:mm:ss") : null;
        const toTime = to ? new DateHelper(to).startOfDay().toDate() : null;
        if (toTime) {
            toTime.setHours(23, 59, 59, 999);
        }
        const toTimeConverted = toTime ? new DateHelper(toTime).format("yyyy-MM-dd HH:mm:ss") : null;

        const filter: string[] = [];
        if (!showExecuted) {
            filter.push(`working_date eq`);
        }
        if (!showNotExecuted) {
            filter.push(`working_date ne`);
        }
        if (plot_id) {
            filter.push(`plot_id eq ${plot_id}`);
        }
        if (excludeProtocols) {
            filter.push(`is_protocol eq 0`);
        }

        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pkCuaa}/${campaign}/activities`,
            {
                params: {
                    filter: filter.length ? filter : undefined,
                    from: fromTimeConverted && toTimeConverted ? fromTimeConverted : undefined,
                    to: fromTimeConverted && toTimeConverted ? toTimeConverted : undefined,
                    worker_id: workerId != null ? workerId : undefined,
                    offset: pagingParams.offset,
                    count: pagingParams.count,
                    sort: `-planned_date`
                }
            }
        );
        propsToDatePaged(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        //res.data.records = toShortDescriptionArray(res.data.records);
        return res.data;
    }

    public async getAllPlannedActivities(
        pkCuaa: number,
        campaign: number,
        from: Date | null,
        to: Date | null,
        showExecuted: boolean,
        showNotExecuted: boolean,
        plot_id?: number,
        excludeProtocols?: boolean,
        workerId?: number | null
    ): Promise<Activity[]> {
        let count = 0;
        let res: Activity[] = [];
        let totalcount = 0;
        do {
            const curPage = await this.getPlannedActivities(
                pkCuaa,
                campaign,
                { offset: count, count: 300 },
                from,
                to,
                showExecuted,
                showNotExecuted,
                plot_id,
                excludeProtocols,
                workerId
            );
            count += curPage.count;
            totalcount = curPage.totalcount;
            res = [...res, ...curPage.records];
        } while (count < totalcount);

        return res;
    }
    public async getPlannedActivitiesCount(
        pkCuaa: number,
        campaign: number,
        from: Date | null,
        to: Date | null,
        showExecuted: boolean,
        showNotExecuted: boolean,
        plot_id?: number,
        excludeProtocols?: boolean,
        workerId?: number | null
    ): Promise<number> {
        const fromTime = from ? new DateHelper(from).startOfDay().toDate() : null;
        const fromTimeConverted = fromTime ? new DateHelper(fromTime).format("yyyy-MM-dd HH:mm:ss") : null;
        const toTime = to ? new DateHelper(to).startOfDay().toDate() : null;
        if (toTime) {
            toTime.setHours(23, 59, 59, 999);
        }
        const toTimeConverted = toTime ? new DateHelper(toTime).format("yyyy-MM-dd HH:mm:ss") : null;
        const filter: string[] = [];
        if (!showExecuted) {
            filter.push(`working_date eq`);
        }
        if (!showNotExecuted) {
            filter.push(`working_date ne`);
        }
        if (plot_id) {
            filter.push(`plot_id eq ${plot_id}`);
        }
        if (excludeProtocols) {
            filter.push(`is_protocol eq 0`);
        }
        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pkCuaa}/${campaign}/activities`,
            {
                params: {
                    filter: filter.length ? filter : undefined,
                    from: fromTimeConverted && toTimeConverted ? fromTimeConverted : undefined,
                    to: fromTimeConverted && toTimeConverted ? toTimeConverted : undefined,
                    worker_id: workerId != null ? workerId : undefined,
                    offset: 0,
                    count: 0
                }
            }
        );
        return res.data.totalcount;
    }

    public async getAllActivities(
        pkCuaa: number,
        campaign: number,
        from: Date | null,
        to: Date | null,
        plot_id?: number,
        workerId?: number | null
    ): Promise<Activity[]> {
        let count = 0;
        let res: Activity[] = [];
        let totalcount = 0;
        do {
            const curPage = await this.getPlannedActivities(
                pkCuaa,
                campaign,
                { offset: count, count: 300 },
                from,
                to,
                true,
                true,
                plot_id,
                undefined,
                workerId
            );
            count += curPage.count;
            totalcount = curPage.totalcount;
            res = [...res, ...curPage.records];
        } while (count < totalcount);

        return res;
    }

    public async getIncomingActivities(
        pkCuaa: number,
        campaign: number,
        pagingParams: PagingParams,
        plot_id?: number
    ): Promise<PagedResults<Activity>> {
        const dt = new DateHelper()
            .startOfDay()
            .toDate()
            .getTime();
        let apiPath = `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pkCuaa}/${campaign}/activities`;
        if (plot_id) {
            apiPath = `/sitiagri-rest-api/api_basic/v1/plots/plots/${plot_id}/activities`;
        }
        const res = await this.http.get(apiPath, {
            params: {
                filter: `planned_date ge ${dt}`,
                offset: pagingParams.offset,
                count: pagingParams.count
            }
        });
        propsToDatePaged(res.data, ["planned_date", "planned_date_to"]);
        //res.data.records = toShortDescriptionArray(res.data.records);
        return res.data;
    }

    public async getDictionaryActivities(
        pk_cuaa: number,
        form_type: number,
        paging: PagingParams,
        noToken?: boolean
    ): Promise<PagedResults<Activity>> {
        if (this.cancelTokenSource && !noToken) {
            this.cancelTokenSource.cancel();
        }
        this.cancelTokenSource = axios.CancelToken.source();
        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pk_cuaa}/form_types/${form_type}/dictionary_generic_activities`,
            {
                params: {
                    offset: paging.offset,
                    count: paging.count
                },
                cancelToken: !noToken ? this.cancelTokenSource?.token : undefined
            }
        );

        return res.data;
    }

    public async fetchBulkFormTypes(
        pk_cuaa: number,
        form_types: number[],
        noToken?: boolean
    ): Promise<{ frmTypeId: number; activityTypes: Activity[] }[]> {
        const result: { frmTypeId: number; activityTypes: Activity[] }[] = [];   
        if (this.cancelTokenSource && !noToken) {
            this.cancelTokenSource.cancel();
        }
        this.cancelTokenSource = axios.CancelToken.source();
        const res = await this.http.post<{ frm_type_id: number; actions: Activity[] }[]>(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pk_cuaa}/form_types/dictionary_generic_activities`,

            form_types,
            {                
                cancelToken: !noToken ? this.cancelTokenSource.token : undefined
            }
        );
        res.data.forEach(ft => {
            result.push({ frmTypeId: ft.frm_type_id, activityTypes: ft.actions });
        });

        return result;
    }

    public async getDictionaryActivity(pk_cuaa: number, form_type: number): Promise<Activity[]> {
        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pk_cuaa}/form_types/${form_type}/dictionary_generic_activities`,
            {
                params: {
                    offset: 0,
                    count: 300
                }
            }
        );
        return res.data.records;
    }

    public async getDictionaryBbch(plot_id: number): Promise<Bbch[]> {
        const res = await this.http.get(`/sitiagri-rest-api/api_basic/v1/plots/plots/${plot_id}/dictionary_bbch`, {
            params: {
                offset: 0,
                count: 300
            }
        });

        return res.data.records;
    }

    public async getBbch(plot_id: number, bbch_code: string): Promise<Bbch> {
        const res = await this.http.get(`/sitiagri-rest-api/api_basic/v1/plots/plots/${plot_id}/dictionary_bbch`, {
            params: {
                offset: 0,
                count: 1,
                filter: `bbch_code eq ${bbch_code}`
            }
        });

        return res.data.records[0];
    }

    public async getTasks(pk_cuaa: number, act_type_id: number): Promise<Task[]> {
        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pk_cuaa}/dictionary_generic_activities/${act_type_id}/tasks`,
            {
                params: {
                    offset: 0,
                    count: 300
                }
            }
        );

        return res.data.records;
    }

    public async editFormDataWPlot(
        plot_id: number,
        action_id: number,
        formData: ActivityFormDataOut
    ): Promise<Activity> {
        const res = await this.http.put(
            `/sitiagri-rest-api/api_basic/v1/plots/plots/${plot_id}/activities/${action_id}`,
            formData
        );
        //res.data = toShortDescription(res.data);
        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        return res.data;
    }

    public async editFormDataWOPlot(
        pkCuaa: number,
        campaign: number,
        action_id: number,
        formData: ActivityFormDataOut
    ): Promise<Activity> {
        const res = await this.http.put(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pkCuaa}/${campaign}/activities/${action_id}`,
            formData
        );
        //res.data = toShortDescription(res.data);
        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        return res.data;
    }

    public async createNewPlannedActivity(plot_id: number, activity: ActivityOut): Promise<Activity> {
        const res = await this.http.post(`/sitiagri-rest-api/api_basic/v1/plots/plots/${plot_id}/activities`, activity);

        //res.data = toShortDescription(res.data);
        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        return res.data;
    }

    public async createNewPlannedActivityWOPlot(
        pkCuaa: number,
        campaign: number,
        activity: ActivityOut
    ): Promise<Activity> {
        const res = await this.http.post(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pkCuaa}/${campaign}/activities`,
            activity
        );

        //res.data = toShortDescription(res.data);
        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        return res.data;
    }

    public async deleteActivityWoPlot(pk_cuaa: number, campaign: number, action_id: number): Promise<Activity> {
        const res = await this.http.delete(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pk_cuaa}/${campaign}/activities/${action_id}`
        );
        //res.data = toShortDescription(res.data);
        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        return res.data;
    }

    public async deleteActivityFromProtocol(
        plot_id: number,
        protocol_id: number,
        action_id: number
    ): Promise<Activity> {
        const res = await this.http.delete(
            `/sitiagri-rest-api/api_basic/v1/protocols/plots/${plot_id}/protocols/${protocol_id}/activities/${action_id}`
        );
        //res.data = toShortDescription(res.data);
        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        return res.data;
    }

    public async deleteActivityFromProtocolWOPlot(
        pk_cuaa: number,
        protocol_id: number,
        campaign: number,
        action_id: number
    ): Promise<Activity> {
        const res = await this.http.delete(
            `/sitiagri-rest-api/api_basic/v1/protocols/subjects/${pk_cuaa}/${campaign}/protocols/${protocol_id}/activities/${action_id}`
        );
        //res.data = toShortDescription(res.data);
        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        return res.data;
    }

    public async deleteActivity(plot_id: number, action_id: number): Promise<Activity> {
        const res = await this.http.delete(
            `/sitiagri-rest-api/api_basic/v1/plots/plots/${plot_id}/activities/${action_id}`
        );
        //res.data = toShortDescription(res.data);
        propsToDate(res.data, ["planned_date", "planned_date_to", "working_date", "working_date_to"]);
        return res.data;
    }

    public async getActivityType(pk_cuaa: number): Promise<ActivityProvider> {
        const res = await this.http.get(`/sitiagri-rest-api/api_basic/v1/plots/subjects/${pk_cuaa}/activity_settings`);
        return res.data;
    }

    public async getActivityMarkers(pk_cuaa: number, campaign: number, action_id: number): Promise<ActivityMarker[]> {
        const res = await this.http.get(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${pk_cuaa}/${campaign}/activities/${action_id}/markers`
        );
        return res.data;
    }

    public async getSplitActivities(plot_id: number, activitiesObj: ActivityOut): Promise<TemporaryActionOut[]> {
        const res = await this.http.post(`/treatment-register-api/api/v1/etl/plots/${plot_id}/action`, activitiesObj);
        return res.data;
    }

    public async validateActivity(
        pk_cuaa: number,
        brgId: number,
        actionOut: TemporaryActionOut[]
    ): Promise<ViolationItem[]> {
        const res = await this.http.post(
            `/treatment-register-api/api/v1/brgChecker/${pk_cuaa}/brgHeader/${brgId}/onTheFly/check`,
            actionOut
        );
        return res.data;
    }

    public async sendActivityToIot(plotId: number, activityId: number) {
        const url = `/sitiagri-rest-api/api_basic/v1/plots/plots/${plotId}/activities/${activityId}/iot`;
        const res = await this.http.post(url);
        if (res.status / 100 > 2) {
            return false;
        }
        return true;
    }

    public async checkCarbonFootprintItemFactor(itemType: string, itemId: number) {
        const url = `/esg-api/api/v1/esg/dataset/types/${itemType}?itemId=${itemId}`;
        const res = await this.http.get(url);
        if (res.data && res.data.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    public async linkMapToActivity(subjectId: number, campaign: number, activityId: number, calculationId: number) {
        const res = await this.http.post(
            `/sitiagri-rest-api/api_basic/v1/plots/subjects/${subjectId}/${campaign}/activities/${activityId}/recipe_maps`,
            [calculationId]
        );
        return res.data;
    }
    
    public async getActivitiesInMatrix(): Promise<ListActivityInMatrix> {
        try {
            const res = await axios.get<ListActivityInMatrix>(`/activities-api/api/v1/complementary-act`, {
                withCredentials: true
            });
            return res.data;
        } catch (error) {
            console.warn("Cannot load complementary activity matrix, continuing without matrix constraints", error);
            return {};
        }
    }

    public async checkDrivingLicenseExpiration(pkCuaa: number, worker_id: number, activity_date: Date): Promise<boolean> {
        try {
            const res = await axios.post<boolean>(
                `/activities-api/api/v1/workers/licences/validity`,
                {
                    subjectId: pkCuaa,
                    workerId: worker_id,
                    activityDate: activity_date
                },
                {
                    withCredentials: true
                }
            );
            return res.data;
        } catch (error) {
            console.warn("Cannot check driving licence validity, continuing without blocking worker selection", error);
            return false;
        }
    }

}
