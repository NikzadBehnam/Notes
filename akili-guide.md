## Configurazione akili farmer front end ticket
https://abacogroup.easyredmine.com/issues/240513


## Teams conversation recap
https://teams.microsoft.com/l/meetingrecap?driveId=b%21ddT8KqzA6karJw9SldVo34VNx-zkuqRMmKtjmNhfrEg15lsoBEJCS7gahNJITWK2&driveItemId=01KVJU7FWZQIHOADOTUVBZVBBYSV5D3LSF&sitePath=https%3A%2F%2Fabacospa-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fs_volponi_abacogroup_eu%2FIQDZgg7gDdOlQ5qEOJV6Pa5FAU-Acsu4fuBZYAlPs6U6PUU&fileUrl=https%3A%2F%2Fabacospa-my.sharepoint.com%2F%3Av%3A%2Fg%2Fpersonal%2Fs_volponi_abacogroup_eu%2FIQDZgg7gDdOlQ5qEOJV6Pa5FAU-Acsu4fuBZYAlPs6U6PUU&iCalUid=040000008200E00074C5B7101A82E0080000000074E06004C04CDD01000000000000000010000000EC05BF310784454991BFA0984E4DF3B4&threadId=19%3Ameeting_MGI1NjUwZGEtMWUxMy00OTRlLThkMmEtZmI5ZjI1NTdmNmNl%40thread.v2&organizerId=0a1b355f-d947-4a6c-a8e8-5d9c3a9cf882&tenantId=5e28663c-e660-49d6-903f-985346a982c4&callId=8461a953-d399-4f13-a175-a4c640d2070b&threadType=Meeting&meetingType=Scheduled&subType=RecapSharingLink_RecapChiclet

- on min 33 starts the example implementation
    
## checklists and description on akili 
  # FS (Functional Analysis)
    - [] It is very important that you read the function specification very accuratly
      - if you are missing any information in this documents, 
      - or maybe you understand that there is some missing that you only know as the Farmer FE developer
      - for example, the columns of a table, the required field of a form, action button of a table
    - [] Update all the abaco dependencies mentioned in the ticket 240513
    - [] Check the if the FS tagged with porper tags `Functional specification with UI`
    - [] Start the creating process by clicking `CREATE PROCESS`
      - On the User interface section select `UI01 Generate layout with HTML wireframe` and continue till the process starts in control tower
      - Then this will create the layout that you can check and read the detail in `UI Layouts`
        - [] after the process is compeleted it will create one layout document for every page (for FS0001, FS0002), check and confirm all the UI Layouts are generated
        - [] after you read and confirm the UIL document you should save and validate the document, untill the UIL is not validated it is not useable
      - The next step is the DS (Design Specification)

      - NOTE: of course the reality is the sometime you wont all the APIs as the BE developer is still developing
              so in that case or you should continue with BE process, of write in the documents a note with a concept like `there are the APIs that already done, and also there is some APIs that are not already done for those cases just write some mockup data so atleast you can build the page`
  
  # DS (Design specification)
      - Design specifications - BE -> contains the API sepecifications
      - Design specifications - FE -> linked between the UI and API 
        - for example what API to be used to fill the table
    - now we can start to create the DS
    - [] Go back to FS, click on create a new process
    - [] From the processes options, selecte the `UI03 Generate UI design specs`
      - [] From Input documents section select only involved FS files and the involved the UIL and DS-BE files
      - [] Continue the process and controll the state of the process in control tower
      - if Will create create DS added on filder Design Specifications - FE
      - [] Save and validate the UID file to be usable with salvatore
      - [] Read all the detail accuratly
      - [] after you read and understand the UID, at the end of the document add the `NOTE API MOCK` -> save and validate
      - the next step is setting up the salvatore

  # Stting up the salvatore
   - we have all the docuents, the FS, UIL, DS we can start with salvatore
   - [] to have a proper result it is recommended to use a new window (empty workspace) of MS-Code
   - in case of first time using salvatore - 
        - [] open salvatore -> click + button on Workspace section -> select a profile (Vue-Farmer) -> Specific ID
        - [] copy project id from Akili, by clicking the copy button on the top of the project name
        - [] add the id to savatore and Enter
        - then in the workspave of salvatore you can see the project is added
        - and also you can see our profile is also added with the skills
        - [] IMPORTANT: Salvatore -> Settings -> Synced tags -> User interface -> select all the checklist
          - by checking that you can see in worspave you will have DS-FE, DS-BE, FS, Layout Docs, you can open in vscode, and you can open in main akili app 
   - [] refresh the work space to fetch the latest files (any time you are making any changes in akili then you should refresh the workspace)
   - [] update the tiles framework
   - [] prendere package.json con script di lint:fix-format-typecheck e aggiungere agents.md (copiare da farm-registry),
   - [] creare file .env con credenziali di test
   - [] in the workspace go to the DS-FE selecte the one you want to create click on the arrow to open dropdown
   - [] on the list click build page, it will ask to download additional documets -> confirm and will load all the documents
   - [] check if all the documents are actually there, an no additional documents are added
   - in here if you need you can add more context
   - in this poit you can START

NOTE API MOCK
Quando NESSUNA API TROVATA COMPATIBILE creare mock asincroni utilizzando  async/await . Definire una struttura dati coerente con le esigenze della UI e generare dati di mock realistici e completi, sufficienti a popolare correttamente tutti i componenti dell’interfaccia.

## skills
https://gitlab.fe.abacogroup.eu/akili/skills/diagram-tech-skills
  - for frontend we have two skills
    - languages\vue\salv-vue-farmer
      - is a general instruction and this would be the one that I may be need to be involved mostly
      - the file SKILL.md contians all instruction and here it is expected that you change it
      - for example  `Header selectors and page scope` is describtion to add the farm selector at top navbar
      - SKILL.md is the entry point and this file can not go like 200 rows
        - so in case if the argument is wide then create a sub document and save in languages\vue\salv-vue-farmer\references and link it to SKILL.md
      - for the case of the API which are use commonly in our UI we have frameworks\farmer\salv-sdk-farmer-apis\SKILL.md
        - for example plots, farm registry, compaign ...


    - languages\vue\salv-vue-nuxt-ui



# Handi points
  - to check the skill of a project click on the project name -> manage skills -> you can see the skills of the project


