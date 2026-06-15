# MANDATORY WORKING RULES:
  - Do NOT make extra changes.
  - Do NOT do unrelated refactors.
  - Do NOT rename, move, or restructure files unless strictly necessary.
  - Do NOT introduce new abstractions unless clearly needed for this exact ticket.
  - Do NOT modify existing working logic unless required by this ticket.
  - Keep the implementation very minimal.
  - Keep the implementation descriptive and maintainable.
  - Keep the implementation fully aligned with the existing logic and patterns already used in this module.
  - Reuse existing company global/shared components and existing project conventions.
  - Avoid speculative improvements.
  - Avoid cleanup changes unrelated to this ticket.
  - This codebase is huge, so safe integration is more important than clever refactoring.
  - If you touch a file, only change what is needed for this ticket.
  - Before coding, first inspect the existing logic and follow the same implementation style already used in nearby files.
  - If multiple implementation options are possible, choose the one with:
  - the smallest safe diff
  - the best consistency with existing code
- the lowest risk in a large legacy codebase
# ------------------------

- translate the old framework page into a vue page
- skip the resume list, make directly the plot selection page
- remove the campaign filter, take it from the navbar dropdown
- add a supplier dropdown filter with the agreements suppliers
- the list api will get the subject id from the supplier dropdown filter
- post/delete to select/unselect to be taken from the old page, the number after /contract is the contract_id
- select all/deselect all
- use plot-talbe component as in  the activities for coldiretti, same props, especially to sho the map preview in the list
- add subject column to plot table component
- maybe copy map and logic from qr code plot selection, but with map preview prop
- ask simone/lorenzo for crop/variety filter

# ------------------------


```md
Now implement the pending plot-selection fix for the new agreements feature.

Context:
- We already investigated that plot selection currently does NOT enforce these two business rules:
  1. Selectable plots must come only from agreement contractors/parties of type `PRODUTTORE`.
  2. Selectable plots must be filtered by the species or variety configured in the linked supply chain / filiera.
- Do not regress the existing POST/DELETE plot association behavior or the list/map synchronization.

Target area:
- `C:\ABC\agreements-module\src\modules\new-agreements\components\detail\forms\index.vue`
- `C:\ABC\agreements-module\src\modules\new-agreements\components\detail\forms\AgreementPlotsSelectionModal.vue`
- `C:\ABC\agreements-module\src\modules\new-agreements\components\detail\forms\AgreementPlotsSelectionMap.vue`
- `C:\ABC\agreements-module\src\modules\new-agreements\api\NewAgreementsApi.ts`
- `C:\ABC\agreements-module\src\modules\new-agreements\components\NewFilieraAgreementForm.vue`
- `C:\ABC\agreements-module\src\modules\new-agreements\components\stepper\PartiesStep\SearchParty.vue`

Required investigation before coding:
- Inspect how current agreement parties are loaded with `getAgreementPartiesForEdit`.
- Identify the real field/code used for party type `PRODUTTORE`; do not hardcode blindly if the dictionary/API gives the value.
- Inspect how the linked filiera exposes crop/species/variety fields, especially `crop_code` and `seed_variety_id`.
- Check whether `getSubjectPlots` backend supports crop/species/variety params. If not, determine whether safe frontend filtering is possible from returned plot fields.

Implementation goal:
- When opening the `Appezzamenti` selection modal from agreement detail, fetch/load only plots belonging to producer parties of the current agreement.
- Filter those plots by the linked filiera species/variety.
- Keep selected plots hydrated from the agreement, so already-linked plots appear selected.
- Preserve map/list two-way synchronization.
- Preserve POST/DELETE API calls and update selected state using returned `plot_id`.

Validation:
- Run targeted TypeScript and ESLint checks for changed files.
- Do not make unrelated refactors.
- If backend data is insufficient for exact filtering, stop and clearly report the missing backend contract instead of guessing.

NOTE:
- at the end give me a clear detail about the fix you did on any segment, (why and where )
- as the project is so big, do not run the commands like, npm build , npm run serve .... 
```

MENTIION in every fixing case
 - at the end give me a clear detail about the fix you did on any segment, (why and where )
 - as the project is so big, do not run the commands like, npm build , npm run serve .... 

# -----------

I have found out a very seriuas issue
we alrady have PlotTableComponent, that we usually use for our different features


# -----------

we have some corrections we should add to the plot-table-component we have used for our plots list AgreementPlotsSelectionModal.

as you can see in the screenshot attached from qrCodeGenerationTile.vue component, we have a filter embeded with PlotTableComponent.vue that we activate it any where we use PlotTableComponent.vue

Request - 1 > I need this filter to be activated also in out plot-table-component we have impelemented for our plots list in AgreementPlotsSelectionModal.vue

in another screen shot you can see we have use the plot-table-component in src\modules\activities-module\components\steps\PlotSelectionStep.vue line 96.
here we have a column showing every single plot shape we have in the map


Request - 2 > I need you to also activate same exact column for plot-table-component we have impelemented for our plots list in AgreementPlotsSelectionModal.vue


in the chat I have attached 
    - the qrCodeGenerationTile.vue to checkout the Filter implementation
    - the PlotSelectionStep.vue to checkout the plots shpe column 
    - the PlotTableComponent.vue to checkout the structure of the component



Do a very deep, accurate and spread check on every files I have attached and all files releted to them
analyse the implemetaion of plot-table-component clearly

Then considering the  MANDATORY WORKING RULES update our AgreementPlotsSelectionModal as per Request-1 and Request-2



# MANDATORY WORKING RULES:
  - Do NOT make extra changes.
  - Do NOT do unrelated refactors.
  - Do NOT rename, move, or restructure files unless strictly necessary.
  - Do NOT introduce new abstractions unless clearly needed for this exact ticket.
  - Do NOT modify existing working logic unless required by this ticket.
  - Keep the implementation very minimal.
  - Keep the implementation descriptive and maintainable.
  - Keep the implementation fully aligned with the existing logic and patterns already used in this module.
  - Reuse existing company global/shared components and existing project conventions.
  - Avoid speculative improvements.
  - Avoid cleanup changes unrelated to this ticket.
  - This codebase is huge, so safe integration is more important than clever refactoring.
  - If you touch a file, only change what is needed for this ticket.
  - Before coding, first inspect the existing logic and follow the same implementation style already used in nearby files.
  - If multiple implementation options are possible, choose the one with:
  - the smallest safe diff
  - the best consistency with existing code
- the lowest risk in a large legacy codebase