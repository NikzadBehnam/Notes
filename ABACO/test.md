import { HTTPClient } from "@abaco/web-common/src/HTTP";
import { PagedResults, PagingParams } from "@abaco/web-common/src/Paging";
import { CatastoCouncil, CatastoMassivoProgress, CatastoMassivoStartResponse } from "../models/CatastoMassivo";

export default class CatastoMassivoApi {
    private http: HTTPClient;

    constructor(http: HTTPClient) {
        this.http = http;
    }

    public async getCouncils(filter: string | null, paging: PagingParams): Promise<PagedResults<CatastoCouncil>> {
        const filters = ["fg_active eq 1"];
        if (filter) {
            filters.push(`^council_label like ${filter.toUpperCase()}`);
        }

        const res = await this.http.get("/sitiagri-rest-api/api_basic/v1/plots/dictionary_councils", {
            params: {
                offset: paging.offset,
                count: paging.count,
                filter: filters,
                administrative_tree: true
            }
        });
        return res.data;
    }

    public async startImport(council: CatastoCouncil): Promise<CatastoMassivoStartResponse> {
        const province_code = council.province_code;
        const cadastral_dataset = council.cadastral_dataset;
        const council_code = council.council_code;

        const url = `/aggiorna-catasto-api/api/v1/aggiornacatasto/regione/${cadastral_dataset} /provincia/${province_code}/comune/${council_code}`;
        const res = await this.http.put(url, undefined, {
            params: {
                download: true,
                fl_calcola_intersezioni: 1
            }
        });
        return res.data;
    }

    public async getProgress(importId: number): Promise<CatastoMassivoProgress> {
        const res = await this.http.get(`/aggiorna-catasto-api/api/v1/aggiornacatasto/progress/import/${importId}`);
        return res.data;
    }
}
