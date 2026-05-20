
we have a huge app developed by vue2,
the task is to Imigrate the app from vue2 to vue3
the app made with different modules, and we should do the migration module by module

even the main app is made by all the modules, but some modules are also dependend to to another

I already migrated some modules from vue2 to vue3, and released there vue3 specific versions

but we can not use them in the production as all the modules are not in vue3 version

so we are working on the modules that there dependencies are already migrated to vue3

one of the modules that I already did imegrated from vue2 to vue3, we can use it as refrence to have a synchronized logic, and easy process( in my conversion I will call that module-vue3 to be more clear)

the module I am going to work on its migration is called farm-registry

the base implementions and configurations files for example (.npmrc, env.d.ts, eslint.config.js, index.html, package.json, README.md, tsconfig.app.json, tsconfig.json, tsconfig.node.json, vite.config.ts ...) should be cofigured exactly with same logics we have in module-vue3

there is some dependencies that some of them are not supportable by vue3, so I have updated there version to be compitable with vue3 or in case there was not any version of them supporting vue3, I found mostly similar libraries for example (i am using vue-facing-decorator instead of vue-property-decorator )

I have also attached some files from my module-vue3 (AbcTable.vue, AbcSelectableCard.vue, AbcTabs.vue ), have a look on to better understand the logic of implementing vue3 features and new libraries like (vue-facing-decorator)

the vue3 supported version of the module that farm-registry is dependend on is as bellow
    @abaco/map-web-module" -> v3.0.0
    @abaco/sso-web-module" -> v4.0.1
    @abaco/tiles-framework" -> v8.0.5
    @abaco/web-common" -> v3.0.9
    @abaco/web-components" -> v5.0.16
    @abaco/menu-module" -> v4.0.0
so they should be updated in package.json
- to terminal actions does not needed to be done by AI-Agent(codex), it should ask me to do as it may take log time or possible error


ATTENTION! to be more clear and accurate on your analyse, ask me any file or inormation you need more, I have an attached screen shot of module-vue3 folder structur too
ATTENTION! do not start any development yet

REQUEST:
  - be very accurate, deep and precise and analyes every single file and segment of the farm-registry module and attaced files (if possible even the node_modules)
  - I need a very detailed and compelete checklist to the process of imegiration of farm-registry module
  - the checklist should be made in step by step phases
  - i will check the changes, test the implementations if everthing is working well I will  commit the phase changes and we will start the next phase
  - using this checklist, I will start the process with with codex
  - I also need a very detailed and accurate propmt to describe the process to Codex and then start the phases