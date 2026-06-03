# https://abacogroup.easyredmine.com/issues/197918

## to test

    - you should have a Attività pianificata with start and end working hours assigned to a worker
    - after saving the activities the difference of start and end hourse will be assigend as worked hours of the worker
    - then on assigning the activity to new worker (by shortcat), you can see that the worker take only 1 hour (static)

## bug

    - the new worker should also take that difference hours from start to end of the activitie

API-POST call assignActivityToWorker()

http://localhost:9090/sitiagri-rest-api/api_sso/v1/plots/subjects/428435/2026/activities/241621/workers?

payload
{
"worker_id": 428827,
"quantity": 1,
"sco_unit_measure": "HH"
}

COMPONENT -> src\modules\activities-module\components\tiles\WorkersActivitiesTile.vue

# https://abacogroup.easyredmine.com/issues/198998

src\modules\farm-registry\components\tiles\registry\FarmLocationMap.vue
onLoadMapComponent - geocodingSearch

# http://abacogroup.easyredmine.com/issues/199923

/register-api/api/vi/register/users/admin/exits_sso_user?\_nc=1764583211488
/register-api/api/v1/register/users/lorenzo.biancuzzi@coldiretti.it/exists_sso_user

API-GET: http://localhost:9090/register-api/api/v1/register/users/admin/exists_gu_accreditamento?\_nc=1764589161668
Response: Credentials are required to access this resource.

API-GET:http://localhost:9090/register-api/api/v1/register/users/admin/exists_sso_user?\_nc=1764589574353
Response: Credentials are required to access this resource.

Have very deep analyze and check
Compare these two components compnents, tile-no-buttons and tile-container-custom

# https://abacogroup.easyredmine.com/issues/200247

# https://abacogroup.easyredmine.com/issues/200251

toggle buttons example : grapes-dashboard-module\components\tiles\dashboard\qualityIndex\detail\qualityIndexDetailTile.vue

- () ask about the label provider on the table main header
 
# ----------------

# Parent ticket https://abacogroup.easyredmine.com/issues/193903?project=false

##  --- https://abacogroup.easyredmine.com/issues/200455?project=false ----


- (from now to tomorrow evening) create the portal for 145 for 3 last ticket relatd to water supply (145.0.1) and also releaes the i18 as you have updated the labels

Report nasim that we should do a off drop of 145 and realese 145.0.1 (still we have something to add on 145)

Groups
- coldiritti want the plots groupt filter
- avanzzamanto attivita (have the group filter in header ) (Keep it as example)
- 

# 200457
- On group seleted, activate the multiple selction of plots in bellow table (plots of group)
  - the logic should be implementd in onSelect
  - DESELCT THE SELECTED PLOTS

# 200460
- a button to remove the filter of the group in side the plots list in the top header (as in the ferrero farm filter)


-------

PARENT - https://abacogroup.easyredmine.com/issues/193903

GROUP MANAGEMENT - https://abacogroup.easyredmine.com/issues/200457
    (+) group management page
        - enable multi selection on the plot table list "Appezzamenti del gruppo" 
        - on plot group selection, select all the plot list rows
    (+) instead of zooming on the curPlot/selectedPlot, zoom on the selection of the multiple plots selected
        check refreshZoom on costs-revenues-module\components\tiles\charts\carbonFootprintMap\index.vue
        check that the zoom logic doesn't break the zoom on other pages IF the map component is shared between multiple pages


- table => <src\modules\crop-plan-module\components\tiles\plotGroup\PlotGroupPlotsInGroup.vue
NOTE : (REMEMBER TO DESELECT THE PREVEIS SELCETED PLOT ON SELECING NEXT GROUP)

........................

GROUP FILTER - https://abacogroup.easyredmine.com/issues/200460 (the fearuter is aleady there)
    (+) group filter
        - add "annulla selezione" button that removes the selection
    (+) plot filter
        - add "Cancel group selection" button that removes the group selection, ONLY if the group filter is not present (you can replicate the conditions already present in the subject filter for the supply chain)

........................


DASHBOARD "COSTI ULTERIORI" - https://abacogroup.easyredmine.com/issues/200458

- add the filter plots group
  - [] Costi totali
  - [] Consumi per prodotto
  - [] Costi per attività
  - [] Costi per coltura
  - [] Consumi/costi per attività
  - [] Mappa costi per appezzamento


........................

ACTIVITIES PAGES - https://abacogroup.easyredmine.com/issues/200456
    (+) on the selection of the group filter inside the plot table component, deselect all previous selected plots, and then select all the plots of that group
    table - src\modules\activities-module\components\steps\PlotSelectionStep.vue
    
    (-) zoom on map - skip for now but write down that it is missing
    map - src\modules\activities-module\components\private\map\PlotSelectorMap.vue
    steper    - src\modules\activities-module\components\StepperContainer.vue


  - (+) check why the header on the activity wizard resume is changing height when selecting an activyty type group, if it is possible fix it, otherwise set a fixed height when the map selection is present
  - (+) paste the css for the legend of the map, also resize the legend. put it on the bottom right and shorten the width of the legend container
  - (+) fix the zoom on the selected plots: it should be triggered only when you click from the list, not from the map (check plots-->"Genera qr code" page)
  - (+) add effects on hover (make it darker on gray/yellow)
  - (+) hide coordinates panel (check props on map component, same as in the qr code map)
  - (+) check better for the zoom on all plots: it doesn't seems to work. check what you did on the group management (check refreshZoom on costs-revenues-module\components\tiles\charts\carbonFootprintMap\index.vue)
  - () check and fix bug when plot table component has virtual scroll


src\modules\activities-module\components\private\map\ActivityMap.vue
........................
PLOTS PAGES - https://abacogroup.easyredmine.com/issues/200455


BASIC INFOS
    - widget with group filter already present "Avanzamento attività"




  


<----------------------->

url: https://test-abaco.bluarancio.com/sitiagri-rest-api/api_sso/v1/user_registry/module_competencies_bulk – per visualizzare se il tab deve essere visibile o non visibile
esempio payload richiesta:
[{"software":"PMI_LOGGING","module":"MOBILE_PORTAL_REPORTS"}, ... lista dei moduli d’interesse]

esempio payload risposta:
[{"software":"PMI_LOGGING","module":"MOBILE_PORTAL_REPORTS","authorised":true},{"software":"PMI_LOGGING","module":"MOBILE_REPORT_CALLS","authorised":false},{"software":"PMI_LOGGING","module":"MOBILE_REPORT_OPERATIONS","authorised":true}]


#201799 - COPY - Implementazione Interfaccia web download report operazioni mobile

1- E' richiesta la modifica del modulo cruscotto-logging-applicativo introducendo nell'area cruscotto un tab aggiuntivo che consenta la ricerca dei dati da esportare a seguito del avvio di un dowload, mediante l'utilizzo degli stessi filtri già utilizzati per il cruscotto generale.

2 -I tab devono essere visibili in base ai permessi che l'utente avrà sul modulo e sui relativi sotto moduli. Di seguito l'ul per ottenere le informazioni sui permessi in ambiente di test:
    a) https://test-abaco.bluarancio.com/sitiagri-rest-api/api_sso/v1/user_registry/module_competencies_bulk

3- Il meccanismo di download dovrà visualizzare un messaggio di raffinamento dei criteri di ricerca restituito dal BE nel caso in cui i records da elaborare eccedono il valore 1048576.

<----------------------->
today i did
- 

Vacation on Jan/Dec: 25, 26, 27, 28, 1, 2, 3, 4, 5, 6

working day in Dec : 23, 24, 29, 30 , 31


-----------------

- do a type check on bluearancio 
  - type check
  - test the behevier of the app where they add the test
  - if the changes were global not custom (isColdiretti) you should test to follow our guid line(standard ABC design) 
  - be more carefull if they are changing anything our standard components
  

- the vue3 ckecklist markdown file
- from which module I should start to upgrade the libraries and make unit tests

<--------------------------------------------------------------------------------------->


# https://abacogroup.easyredmine.com/issues/200456
 
        BRANCH: feat/multi-plot-select-activity-200456
        MODULE: activities-module
        https://gitlab.fe.abacogroup.eu/abaco4farmer/activities-module/-/tree/feat/multi-plot-select-activity-200456?ref_type=heads
 
 
        - (+) check better for the zoom on all plots: it doesn't seems to work. check what you did on the group management (check refreshZoom on costs-revenues-module\components\tiles\charts\carbonFootprintMap\index.vue)
        - (+) put the legend on the bottom right (apply the same padding on the right also on the bottom)
        - (+) filter the plots on the map by filters (ONLY filters date/rotation-avvicendamento) - copy the filter logic from the list, do not apply them manually to the map plots
        - (+) if a group is selected, only show in the map the plots of that group
        - (+) check and fix bug when plot table component has virtual scroll
  
------------------------
 
# https://abacogroup.easyredmine.com/issues/200460
 
        BRANCH: feat/cancel-plot-selection-btn-200460
        MODULE: portal-global-state

        Rilasciato portal-global-state v2.21.0

        --------

        BRANCH: feat/coldiretti-plotgroup-filter
        MODULE: portal

        --------

        BRANCH: feat/prog-plot-group-selection
        MODULE: dashboard-module
        
        Rilasciato dashboard-module v7.12.0
        Rilasciato dashboard-module v7.12.1
        
  
        C:\ABC\costs-revenues-module\src\modules\costs-revenues-module\components\tiles\charts\carbonFootprintMap\index.vue

 
        - (+) button on nav bar filter to remove the plot group filter (only when plot group filter is not present): to be merged
        - (+) need to add the plot group on every page/dashboard programmatically:
        if the page has plot filter and doesn't have already the plot group filter, add the plot group filter
        portal/Home.vue
        dashboard-module/index.vue (add computed property that does the same)
------------------------
 
 
# https://abacogroup.easyredmine.com/issues/200457
 
        BRANCH: feat/multi-plot-select-200457
        MODULE: crop-plan-module
 
        https://gitlab.fe.abacogroup.eu/abaco4farmer/crop-plan-module/-/tree/feat/multi-plot-select-200457?ref_type=heads
        
        - (+) zoom doesn't update on list selection
        - (+) selection from map is broken (doesn't update the list selection)
        - (+) selection from the list is broken (doesn't update the map selection)
        - (+) after fixing the selection bug, be sure that on group selection, all polygons of the group become red

        Rilasciato crop-plan-module v2.51.0

----------------
TODO:

check the release Versione 145.3.4 on demetra TEST, when it is DONE! assgined the fix tickets to the 
Demetra Tester

Release ticket : https://abacogroup.easyredmine.com/issues/202658
Fixes tickets: https://abacogroup.easyredmine.com/issues/182789
               https://abacogroup.easyredmine.com/issues/201799
               
----------------

TODO:

add the hours on the tickets workd during december last week
and also add the hours for today


https://abacogroup.easyredmine.com/issues/200456
update the ticked above with the branch you did work for activities

----------------

# https://abacogroup.easyredmine.com/issues/200478

[DONE] GET: /plots/subjects/{subject_id}/plot_groups/v2
    - /sitiagri-rest-api/api/v1/plots/subjects/539649/plot_groups/v2 ()

[DONE] GET: /subjects/{subject_id}/plot_groups/v2/{plot_group_id}
[DONE] POST: /plots/subjects/{subject_id}/plot_groups/v2
[DONE] PUT: /plots/subjects/{subject_id}/plot_groups/v2/{plot_group_id}
[DONE] DELETE: /plots/subjects/{subject_id}/plot_groups/v2/{plot_group_id}


TODOS: 
    - check if the the "/sitiagri-rest-api/api" is really needed in vueconfige
    - recheck all the APIs configurations if each one of them are the exacly same APIs we need to refacore one by one
    - check all if we use the API (plot_groups) anywhere else in portal if yes refactore

BRANCH: feat/review-plot-groups-apis
MODULE: crop-plan-module
Rilasciato crop-plan-module  v2.51.4

BRANCH: feat/review-plot-groups-apis-global-state
MODULE: portal-global-state
Rilasciato portal-global-state  ....
[IMPORTANT] - add the changes in the latest portal global state or remove the last tag and add the chages on same tag

# https://abacogroup.easyredmine.com/issues/200462

BRANCH: feat/plot-group-200462
MODULE: precision-farming-module

Rilasciato precision-farming-module
non necessario aggiornamento i18n
Da compilare portal

Activites file having same changes
src\modules\activities-module\components\steps\PlotSelectionStep.vue

Note: 
    + the auto plots selection of a current plot group, fixes added portal global state, push the changes -> merge -> create tag
    + then install new portal global state in precision-farming-module and start the work form precision-farming-module
    + zoom on plot group on selecting new plot group filter 

MODULE: portal-global-state
BRNACH: feat/plot-table-comp-rafactore

Rilasciato portal-global-state v2.21.1
non necessario aggiornamento i18n
Da compilare portal


# https://abacogroup.easyredmine.com/issues/200464

MODULE: widgets-container-module 
BRNACH: feat/plot-group-filter-200464 

Rilasciato widgets-container-module v1.21.10
necessario aggiornamento i18n
Da compilare portal

------

Rilasciato dashboard-module v7.12.1


# https://abacogroup.easyredmine.com/issues/200146

MODULE: costs-revenues-module
BRNACH: feat/costi-ricavi-apis-replace-200146

Rilasciato costs-revenues-module v1.16.3
non necessario aggiornamento i18n
Da compilare portal

----

MODULE: assets-module
BRNACH: feat/pricetype-api-update-200146

il branch feat/pricetype-api-update-200146 è stato mergiato al master

----

MODULE: costs-revenues-module
BRNACH: feat/pricetype-api-update-costs-rev-200146

# https://abacogroup.easyredmine.com/issues/203773

MODULE: assets-module
BRNACH: fix/validity-label-bug-203773

Rilasciato assets-module v2.39.8
non necessario aggiornamento i18n
Da compilare portal


# https://abacogroup.easyredmine.com/issues/202359

MODULE: iot-module
BRNACH: feat/sticky-table-header

Rilasciato iot-module v1.18.1
non necessario aggiornamento i18n
Da compilare portal

# https://abacogroup.easyredmine.com/issues/200469

MODULE: alarms-module
BRNACH: feat/alarms-plots-group-filter-200469

Branch feat/alarms-plots-group-filter-200469 merge  into master

Rilasciato alarms-module v1.6.0
non necessario aggiornamento i18n
Da compilare portal

"skipLibCheck": true
---
BRNACH: various-fixes-200469


...



NOTE: types errors nel lato frontend devono essere corretti


# https://abacogroup.easyredmine.com/issues/204122
MODULE: fix/magazzino-negative-quantity-message
BRNACH: assets-module

Rilasciato assets-module v2.39.9
Da compilare portal
non necessario aggiornamento i18n





# Jan 21, 2026

# https://abacogroup.easyredmine.com/issues/200456

    BRANCH: feat/plot-group-var-fixes-200456
    MODULE: activities-module

    () fix the bug mentioned by Alessandro Capasso in the ticket
    () check if the bottom margin of the resume panel is missed by you or changes by fabio
    () check and fix bug when plot table component has virtual scroll
    () check if you can use the lates portal global state(updated PlotTableComponent)
    () organize all the notes related to this ticket in one place
    () simplify this fucntion loadPlotLayer in PlotSelectorMap




find out the plotGroupId emmited by plot-table
add that plotGroupId applyVisibilityFromGroupFilter as selectedPlotGroupId 



# Jan 23, 2026
- fix this point follow the chat
    Fabio said
    but please, dont' push code like that.. now there's no time to refactor


- Release standard Italia 146 
  - https://abacogroup.easyredmine.com/issues/202390
  - also incldue the iot-model if ticket https://abacogroup.easyredmine.com/issues/202359 is ready


- release 146.1.3-coldiretti (branch created) add the logging... module if sent by francisco
  - also release the i18n -> read https://abacogroup.easyredmine.com/issues/200465

released in coldirettin 146.1.3
  - https://abacogroup.easyredmine.com/issues/202359
  - https://abacogroup.easyredmine.com/issues/196583



------------------
src\modules\activities-module\components\steps\PlotSelectionStep.vue


# https://abacogroup.easyredmine.com/issues/204122
MODULE: fix/magazzino-negative-quantity-message
BRNACH: assets-module

Rilasciato 
non necessario aggiornamento i18n
Da compilare portal



# https://abacogroup.easyredmine.com/issues/200465
  
1- widget allarmi --
    - il servizio indexes-api viene chiamato al posto della vecchia API (servizi dbgis)
    - la nuova API supporta lot_group_id, quindi il widget ora e responsive al filtro del gruppo appezzamenti nella navbar   

    MODULE: alarms-module 
    BRANCH: feat/replace-api-dbgis-to-index-200465
    Rilasciato alarms-module v1.6.0
    Da compilare portal

    Rilasciato con il portal v147.0.1
  
---------

2- Avanzamento attività --
    - il filtro del gruppo appezzamenti è già stato aggiunto
    - l’API activities_area filtra già in base al plot_group

---------

3- WIDGET Superficie coltivata per coltura --
4- WIDGET Superficie coltivata per varietà --

   le nuove API (varieties_v2 e crops_v2) sono state configurate lato frontend per supportare il filtro del gruppo appezzamenti


   MODULE: crop-plan-module
   BRANCH: feat/plot-group-api-updates-200465
   Rilasciato crop-plan-module v2.51.3

---------

5- Seleziona tracce --

   l’API tracks_all è stata configurata nella sua nuova versione per supportare il filtro del gruppo appezzamenti

   

    BRANCH: feat/various-plotgroup-chagnes-200465
    MODULE: activities-module
    Rilasciato activities-module v2.68.5

-------------


# https://abacogroup.easyredmine.com/issues/205222
    MODULE: geophoto-module
    BRNACH: feat/demetra-print-geophoto-form-header-205222

    Rilasciato 
    non necessario aggiornamento i18n
    Da compilare portal

    NOTE - the task is done, tested and ready to merge and ready to released

    

https://collaudo-abaco.bluarancio.com/sitiagri-rest-api/api_sso/v1/plots/dashboard/activities_area?&plot_group_id=73319&subject_id=425353&campaign=2025&offset=0&count=300&sort=act_type_description


I just found that we have a value on plot-table-component called (selectedGroup) that is always in changing this value the component emits  this.$emit("groupChanged", curPlotGroup);

here with this value, which is that currrent plot group we can make our code more simplifined and clean
and also we have another prop value called navbarCurPlotGroup in the plot-table-component that at the end we can pass the curPlotGroup as it value to the plot-table-component


add the PlotComponentTable and its mixin

sync the precision map and precision select plot



# To talk with fabio ABOUT
- in this ticket they are asking the fix to be release also in 144 
    https://abacogroup.easyredmine.com/issues/203773

# fix the last comment
https://abacogroup.easyredmine.com/issues/200464


# https://abacogroup.easyredmine.com/issues/196583

  - To do a code review, merge, tag, and release
     https://gitlab.fe.abacogroup.eu/abaco4farmer/costs-revenues-module/-/merge_requests/13 


/siticatasto/dbgis-servlet/tl_data?svccode=prescription/exists_jd_organization&pk_cuaa=410786&_nc=1770297590674
/siticatasto/dbgis-servlet/tl_data?svccode=prescription/exists_jd_organization&pk_cuaa=423587&_nc=1764183068698

http://localhost:9090/iot/api/v1/farm/api/v1/farm/529769/john-deere/exist/organization?

# https://abacogroup.easyredmine.com/issues/199889

    MODULE: precision-farming-module
    BRNACH: feat/replace-dbgis-api-models-maps-199889

    Rilasciato precision-farming-module v1.17.14
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/201989

    MODULE: assets-module
    BRNACH: verification-201989
    Rilasciato assets-module v2.40.1
    Rilasciato assets-module v2.40.2

    src\modules\assets-module\components\tiles\accountingDocuments\edit\AccountingDocumentEditTile.vue
        - getAccountingDocument



https://devs4f.fe.abacogroup.eu/sitiagri-rest-api/api_basic/v1/warehouse/subjects/545307/warehouses/1943?removeZero=false&_nc=1770628122457

- this API which is loads a field "verified_date", by pressing "Gestisci lotti" of any magazin type from the "Magazzini" list
  - based on the valued of "verified_date" we add the condition

Quando un'attività arriva da GIAS e viene inserita in Demetra viene sempre richiamata l'API di insert attività con il parametro verification=true.
- anytime if an activity inserted is by coldiretti, calling the insert activity API, add a parameter verification=true.


# https://abacogroup.easyredmine.com/issues/202653

    MODULE: geophoto-module
    BRNACH: massive-download-geophoto-202653

    Rilasciato geophoto-module v2.3.0
    necessario aggiornamento i18n
    Da compilare portal


    
# https://abacogroup.easyredmine.com/issues/202653 

    MODULE: geophoto-module
    BRNACH: massive-download-geophoto-202653

    Rilasciato geophoto-module v2.3.0
    necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/203757

    MODULE: activities-module
    BRNACH: feat/activitiy-type-selector-203757

    Rilasciato activities-module v2.69.0
    necessario aggiornamento i18n
    Da compilare portal



there is the screen shot I got from my Desctop atached with chat, and also screenshots that was attached in the ticket by the creator of the ticket
so do no get confused (the one from my screen moslty with dark background)

so:
I need you to 
Do a deep analyz on the content of the ticket and the comments added by the people and give me a very clear detail about the requirment of the ticket

after you made me clear with the ticket requirment I will past you the two other child tickets related to this ticket that is for development of backend (BE) and frontend (FE)




- add the fix in alarms and push it in master
node_modules\@abaco\dashboard-module\src\modules\dashboard\components\index.vue

- add the fix in portal and push it in master
src\Home.vue

- add the fix in dashboard, test and push it in master
src\modules\dashboard\components\index.vue


# https://abacogroup.easyredmine.com/issues/206375
    MODULE: activities-module

    IMPORTANT from Fabio
    
    nikzad while you're there, check for that widget that the filter by "curPlot" (taken from the navbar plot filter) still works, because I think the api changed a bit. test that this is still working. if it's not working anymore try to understand if something on the api side changed, if it's not clear, get back to me or ask directly to lorenzo pandini

# fix on crop plan
    - syncing plot group filter with plot group selectore of the table
      

BRANCH: fix/sync-plotgroup-filters
MODULE: crop-plan-module


/sitiagri-rest-api/api_sso/v1/warehouse/subjects/418448/warehouses



sitiagri-rest-api/api_sso/v1/plots/subjects/410786/plot_groups/v2?

error 404
/sitiagri-rest-api/api_sso/v1/plots/plot_groups/v2/73327/plots?



/sitiagri-rest-api/api_sso/v1/plots/subjects/419493/plot_groups/v2?offset=0&count=25


# https://abacogroup.easyredmine.com/issues/203757

    MODULE: activities-module
    BRNACH: feat/activitiy-type-selector-203757


important points
- [+] the problem as written by simone is that you can create an execution with multiple activity types
- [+] and every activity type could need an agrochemical
- [+] and the database, in that case, doesn't know which agrochemical corresponds to the specific activity type
- [+] o the user can say agrochemical "x" is needed for activity type "joe", agrochemical "y" is needed for activity type "jimmy"
- [+] but "joe" and "jimmy" are activity types selected by the user in the 1st step
- [+] so do not show all activity types
- [+] show only in the dropdown the types selected by the user with fg_phytochemical = 1

todo steps
- [+] so you need to select the activity types selected by the user in the first step only the ones with fg_phytochemical = 1
- [+] edit/insert of agrochemicals from a new execution
- [] edit/insert of agrochemicals from an already inserted execution
- [] execution from planned activities
- [] also update the resume to show the info
- [] the dropdown selection is compulsary if > 0
- [] add all the labels in i18 portal


- [+] if it is only one activity type auto select it
- [+] by changing the activity type on dropdown, clear the value Tipo agrofarmaco field to load with new one
- [+] if the activity type is not selected disable the Tipo agrofarmaco

- IMPORTANT: do all the testings in DEVItalia and in DEVColdiritti
NOTES
- [+] the dropdown item list backgroup is not looking right, they shold not be always gray



# https://abacogroup.easyredmine.com/issues/208186

    MODULE: widgets-container-module
    Merged to the master and the branch deleted    

    Rilasciato widgets-container-module v1.21.11
    non necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/206235

    MODULE: crop-plan-module 
    BRNACH: feat/demetra-labels-gruppo-to-campo-206235

    Rilasciato crop-plan-module v2.51.8
    necessario aggiornamento i18n
    Da compilare portal

include treatement-registry-module and portal-global-state module in beleaf i18nVariant #206235

@FromStore(CropPlanModule.MODULE_ID) isColdiretti!: boolean;

@FromStore(MODULE_ID) isColdiretti!: boolean;


# TREATMENT-REGISTER-MODULE
[] no-plot-group-selected
[] print-filter-plot-group


# PORTAL-GLOBAL-STATE
[] add-new-plot-group
[] no-plot-group-found
[] no-plot-group-selected
[] plot-group-selected
[] remove-plot-group-selection
[] select-plot-group

# CROP_PLAN
 [+] add-new-plot-group
 [+] add-new-plot-field
    
 [+] add-selected-to-group
 [+] add-selected-to-field

 [+] cannot-select-a-plot-outside-group
 [+] cannot-select-a-plot-outside-field

 [+] click-on-plot-to-select-one
 [+] click-on-plot-to-select-one-from-field

 [+] confirm-delete-plot-group
 [+] confirm-delete-plot-field

 [+] confirm-move-to-current-group
 [+] confirm-move-to-current-field

 [+] delete-selected-plot-group
 [+] delete-selected-plot-field

 [never-used] edit-plot-group
 [] edit-plot-field

 [+] edit-selected-plot-group
 [+] edit-selected-plot-field

 [+] forest-group
 [+] forest-field

 [+] group
 [+] field-label

 [+] new-group
 [+] new-field

 [+] plot-group-map
 [+] plot-field-map

 [+] plot-group-name
 [+] plot-field-name

 [+] plot-not-in-current-group
 [+] plot-not-in-current-field

 [+] plots-in-group
 [+] plots-in-field

 [+] remove-selected-from-group
 [+] remove-selected-from-field

 [never-used] search-plot-by-group
 [] search-plot-by-field

 [+] select-a-group
 [+] select-a-field

 [+] go-to-plot-group
 [+] go-to-field
 
 [+] plot-already-present-in-group
 [+] plot-already-present-in-field

 [+] plot-groups
 [+] plot-fields



# --- DSS widgets replicating ----#

# 1-  Rischio infettivo Botrytis cinerea
  - BRANCH: feat/dss-botrytis-cinerea-infection-risk
  - MODULE: widgets-container-module 


# 2 - Rilasci infettanti di ascospore
  - BRANCH: feat/dss-infective-ascospore-releases
  - MODULE: widgets-container-module 
  
- check the TileView type


# 3- Peronospora Della Vite
  - BRANCH: feat/peronospora-della-vite-widget
  - MODULE: widgets-container-module 

# DSS Widgets MAIN brach
    feat/all-new-dss-widgets


# DDS Init Branch
    feat/dss-init
    - [] the chart toggle style

NOTES:
- remove the the test route before commit the widgets "/test-dss-widgets"
- rename the DSSChartTileViewToggle to DSSTopTileMultiViewToggle 
- add all the label in the i18 once confimerd, remember the WIDGET_CODE in idividual widget
- seprate the type model files 
- ask daniele about the APIs
- update the initial branch with new models folder
- 
# --- END DSS widgets replicating ----#

Blocks data table have two components
  - container.vue
    - AbcTopTileButton to download the excel file
    - rendring the Table component
  
  - table.vue
    - the table header contians all the filters for each column


.................

# ---------
Branch: test-xyz-api
Module:widgets-container-module

# https://abacogroup.easyredmine.com/issues/209652
    BRNACH: fix/crop-prices-209652
    MODULE: costs-revenues-module
    
    Rilasciato costs-revenues-module v1.16.5
    non necessario aggiornamento i18n
    Da compilare portal


    
# https://abacogroup.easyredmine.com/issues/203949
    BRNACH: fix/refresh-captcha-particle-search-203949
    MODULE: map_web_module
    
    Rilasciato map_web_module
    non necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/211043
    BRNACH: fix/inserted-area-increasing-211043
    MODULE: activities-module
    
    Rilasciato activities-module
    necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/209418
    BRNACH: feat/seeds-monitoring-widget-209418
    MODULE: widgets-container-module
    
    Rilasciato widgets-container-module v1.22.0
    necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/211233
    BRNACH: fix/forbid-diff-agm-group-code-select-211233
    MODULE: activities-module
    
    Rilasciato activities-module v2.69.2
    necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/207875
    BRNACH: fix/restrict-team-workers-to-workforce
    MODULE: assets-module
    
    Rilasciato assets-module v2.40.4
    necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/213088
    BRNACH: feat/demetra-cadastral-download-button
    MODULE: crop-plan-module
    
    Rilasciato crop-plan-module 
    necessario aggiornamento i18n
    Da compilare portal

    - Il pulsante è solo per Coldiretti?
  
# https://abacogroup.easyredmine.com/issues/212507
    BRNACH: fix/defense-risk-label-212507
    MODULE: widgets-container-module
    
    Rilasciato widgets-container-module
    non necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/214083
    BRNACH: fix/tracing-label
    MODULE: assets-module
    
    Rilasciato assets-module v2.40.5
    non necessario aggiornamento i18n
    Da compilare portal

# https://abacogroup.easyredmine.com/issues/214149
    BRNACH: feat/fe-team-worker-validity-ref-date-214149
    MODULE: assets-module
    
    Rilasciato assets-module v2.40.6
    necessario aggiornamento i18n
    Da compilare portal


    BRNACH: feat/activites-fe-team-worker-validity-ref-date-214149
    MODULE: activities-module
    
    Rilasciato activities-module  v2.69.3
    necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/214146
    BRNACH: fix/delivery-from-lot-input-blur-reset-214146
    MODULE: activities-module
    
    Rilasciato activities-module v2.69.3
    nonnecessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/215416
    BRNACH: fix/seed-monitoring-widget-random-fixes-215416
    MODULE: widgets-container-module 
    
    Rilasciato widgets-container-module
    non necessario aggiornamento i18n
    Da compilare portal

# https://abacogroup.easyredmine.com/issues/190509
    BRNACH: feature/190509-fix-qr-traceability-ordering
    MODULE: assets-module
    
    Rilasciato assets-module v2.40.9
    non necessario aggiornamento i18n
    Da compilare portal


    BRNACH: feature-activities/190509-fix-qr-traceability-ordering
    MODULE: activities-module v2.69.6
    
    Rilasciato activities-module
    non necessario aggiornamento i18n
    Da compilare portal

# https://abacogroup.easyredmine.com/issues/190509
    BRNACH: feature/190509-fix-qr-traceability-ordering
    MODULE: assets-module
    
    Rilasciato assets-module v2.40.9
    non necessario aggiornamento i18n
    Da compilare portal

## ....... new supply chain contract......... ###
    
# https://abacogroup.easyredmine.com/issues/216641
    BRNACH: feat/216641-modulo-ges-contratti-di-filiera
    MODULE: agreements-module

    Rilasciato agreements-module 
    necessario aggiornamento i18n
    Da compilare portal

   1. Gestione pagina filiere - FE (Manage Filiere Page - Frontend)
    
    This ticket is about building the entire Filiere Management section.    
    This corresponds directly to:
       - FS001 mockup (filiere dashboard)
       - FS002 mockup (create/edit filiera form)



# https://abacogroup.easyredmine.com/issues/216643
    BRNACH: feature/216643-filiera-contracts-page
    MODULE: agreements-module

    Rilasciato agreements-module 
    necessario aggiornamento i18n
    Da compilare portal

   2. Ticket #216643 — Gestione pagina contratti di filiera - FE    
   
    This ticket is for the Contracts Dashboard/List page.
    You need a page that shows contracts belonging to a specific filiera.
    This corresponds to:
        - FS005 mockup


# https://abacogroup.easyredmine.com/issues/216645
    BRNACH: feature/216645-create-filiera-contract
    MODULE: agreements-module

    Rilasciato agreements-module 
    necessario aggiornamento i18n
    Da compilare portal

   3. Ticket #216645 — Pagina creazione nuovo contratto per una filiera - FE
        
    (Create New Contract Page - Frontend)
    This is the biggest and most important ticket.
    This corresponds to:
       - FS006 mockup
       - contract creation flow in functional analysis
     
# https://abacogroup.easyredmine.com/issues/216647
    BRNACH: feature/216647-contractor-plots-selection
    MODULE: agreements-module

    Rilasciato agreements-module 
    necessario aggiornamento i18n
    Da compilare portal

   1. Ticket #216647 — Nuova pagina selezione appezzamenti per contraente

        (New Plot Selection Page for Contractor)

        This ticket is specifically about the plots selection page.

        This page already exists in old legacy system, but now must be rebuilt in Vue.

        The ticket explicitly says:

        “old page is currently used”

        and

        “must be rewritten in Vue”



# https://abacogroup.easyredmine.com/issues/217590
    BRNACH: fix/planned-harvest-product-frontend-217591
    MODULE: activities-module

    Rilasciato activities-module v2.69.7
    necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/217591
    BRNACH: fix/semente-remove-banca-dati-option-217590
    MODULE: assets-module

    Rilasciato assets-module v2.40.10
    necessario aggiornamento i18n
    Da compilare portal


# https://abacogroup.easyredmine.com/issues/217610
    BRNACH: fix/field-visit-217610
    MODULE: widgets-container-module 

    Rilasciato widgets-container-module v1.22.4
    non necessario aggiornamento i18n
    Da compilare portal



some change for needed in UI or Nuovo contratto form
1 - the wide of the form is too large, make it less keep in the center




some change for needed in UI or Contratti table

- I have attached WarehouseDetailTile.vue component with its UI screenshot from assets module
- add the three status of the contracts with circled points at the header of the table
- add the total contract also on the header


# https://abacogroup.easyredmine.com/issues/214148
    BRNACH: fix/ddt-operation-type-214148
    MODULE: assets-module
    
    Rilasciato assets-module v2.40.8
    Rilasciato assets-module v2.40.11
    non necessario aggiornamento i18n
    Da compilare portal





On adding a new contract using the post endpoint bellow, I see that it is not apearing in the list of contracts
i ask the reason from team backend and they update me with information you can see in the message screenshot


POST: http://localhost:9090/sitiagri-rest-api/api_sso/v1/agreements/agreements

payload
{
    "agreement_type_id": "2",
    "agreement_code": "GH-2323",
    "agreement_desc": "GH-2323 Description",
    "end_date": "1782770400000",
    "start_date": "1780264800000",
    "subjects": [
        {
            "sco_party_type": "SCAFFI",
            "subject_id": "411346"
        },
        {
            "sco_party_type": "SCHEAD",
            "subject_id": "411368"
        }
    ]
}
----------------------------------------

and as per the new infomation they said bellow is the updated version of endpoint response

{
    "offset": 0,
    "count": 1,
    "totalcount": 1,
    "records": [
        {
            "varieta": null,
            "codice_filiera": "FIL-2026-012",
            "descrizione": "Filiera dedicata alla produzione di olio",
            "coltura": "OLIVE",
            "pk_cuaa_capo_filiera": 418466,
            "cuaa_capo_filiera": "cicciopasticcio",
            "denominazione_capo_filiera": "PANDINI LORENZO",
            "pk_cuaa": 411306,
            "cuaa": "00060700564",
            "denominazione": "COOPERNOCCIOLE SOCIETA' COOPERATIVA AGRICOLA",
            "num_contratti_attivi": 2,
            "pkid_filiera": 7,
            "dt_inizio": 1779198951000,
            "dt_fine": 253402210800000,
            "utente": "ADMIN",
            "dt_update": 1779198951000,
            "dt_insert": 1779198951000,
            "dt_delete": 1779803507000
        }
    ]
}


Have a good check the code and update the front end carefully