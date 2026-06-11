I have added an abc-tool-button on line 38 of src\modules\new-agreements\components\detail\forms\index.vue

do exactly bellow points

 - onclick this button call the fucntion addPlots
 - inside src\modules\new-agreements\api\NewAgreementsApi.ts configure the API call bellow
https://collaudo-abaco.bluarancio.com/sitiagri-rest-api/api_sso/v1/plots/subjects/4  19077/2026/plots?include_supply_chain=true&offset=0&count=300&_=1780491518967

 - on triggering the addPlots function call the API
