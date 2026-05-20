# TOAST ALERT

    ```js
        @Inject() toast!: (message: string, options?: ToastOptions) => void;
        import { ToastOptions } from "@abaco/web-common/src/app/Toasted";
        this.toast(this.i18n("report-download-failed") as string, { type: "error" });
        this.toast(this.i18n("report-downloaded") as string, { type: "success" });
    ```

---


# to change the local envirnment type
- go to the main.ts of the module and update bellow function with desired envronment name
 
abacoApp.add(
    new SsoWebModule({ useSSO1: true, environment: "coldiretti" }, (user) => {
        setI18N({ locale: user.locale, dateFormat: user.dateFormat });
        abacoApp.setLanguage(user.locale);
        menu.loadMenu();
    })
);


# to envirnment type

    ```js
        import SSOModule from "@abaco/sso-web-module/src/abaco-module";
        @Inject(SSOModule.MODULE_ID) ssoModule!: SSOModule;

        private get isPortalFerrero() {
            return this.ssoModule.environment.toLowerCase().indexOf("ferrero") > -1;
        }
        
        private get isPortalColdiretti() {
            return this.ssoModule.environment.includes("coldiretti");
        }
    ```

# UPDATE ALL ABACO PACKAGES

        ncu @abaco/* -u

...

# get all result on of NextPagedResults api Example

    you can see getAllAgreements src\modules\ferrero-fixed-dashboard-module\api\agreementsApi.ts and alos the function bellow

        ```js
        public async getAllCadastral(
            businessId: number,
            cropPlanId: number,
            domainZoneId: string,
            pointInTime: Date,
            version: string | null
        ): Promise<NextPagedResults<CadastralData>> {
            let count = 0;
            let res: CadastralData[] = [];
            let nextKey = null;
            do {
                const curPage: NextPagedResults<CadastralData> = await this.getCadastral(
                    businessId,
                    cropPlanId,
                    domainZoneId,
                    pointInTime,
                    version,
                    nextKey
                );
                count += curPage.count;
                res = [...res, ...curPage.records];
                nextKey = curPage.nextKey;
            } while (nextKey);

            const pageRes = { count: count, records: res, nextKey: null };
            return pageRes;
        }



    // async getAllAgreements(pkCuaa: number, filter: AgreementFilter): Promise<Agreement[]> {
    //     let res: Agreement[] = [];
    //     let nextKey = null;
    //     let count = 0;

    //     do {
    //         const params = {
    //             nextKey,
    //             agreement_id: filter && filter.id ? filter.id : undefined,
    //             agreement_code: filter && filter.code ? filter.code : undefined,
    //             agreement_type: filter && filter.type ? filter.type : undefined,
    //             agreement_status: filter && filter.status ? filter.status : undefined,
    //         };

    //         const response = await this.http.get(`/fhc/api/v1/agreements/subjects/${pkCuaa}`, { params });
    //         const curPage: NextPagedResults<Agreement> = response.data;

    //         count += curPage.count;
    //         res = [...res, ...curPage.records];
    //         nextKey = curPage.nextKey;
    //     } while (nextKey);

    //     return res;
    // }
        ```

---

# fontAwsome Spinner

        <i v-if="printing" class="fa-solid fa-spinner-third fa-spin" style="--fa-animation-duration: 0.8s"></i>

---

# How to calculate the council_id from the drawn polygon:

    1 - every time the draw is updated (function "updateMapLayout"), find its centroid (an array of coordinates of the center of the polyong) (how to: src\modules\crop-plan-module\components\private\PlotMapComponent.vue, row 284)
    2 - pass the coordinates as "lat" and "long" query params to this API "/v1/plots/dictionary_councils"
    3 - get the first record from the API

---

<abc-loader v-if="isDisabled" size="20" class="opacity-50" />

---


Here’s a **short, clear, and future-proof reminder note**, rewritten to be easy to understand at a glance:

---

# Login not working on local (ColdIretti)

If username and password work on the online portal but do not work on the local Coldiretti server, the issue is usually SSO configuration.

- Check `main.ts` and enable API SSO.

Path example:
`C:\ABC\costs-revenues-module\src\main.ts`

Make sure this is set:

```ts
const abacoApp = new Application({
  http: new HTTPClient({ useApiSSO: true }),
  rootComponent: Home
});
```

Always verify `useApiSSO: true` when local authentication fails but works online.


# ----------------

aggiornare tutte le lib abaco
ncu @abaco/*
ncu @abaco/* -u
npm i -g npm-check-updates
 
"vue": "<=2.6.14",
"vue-template-compiler": "<=2.6.14"