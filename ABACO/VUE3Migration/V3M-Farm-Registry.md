# More accurate migration phases for `farm-registry`

## Phase 0 — Audit and migration map only

No code changes.

Codex must inspect:

```text
package.json
vue.config.js
tsconfig.json
main.ts
App.vue
routes.ts
state.ts
FarmInvolvedContainer.vue
InvolvedWorkerTile.vue
CampaignApi.ts
ContractApi.ts
InvolvedApi.ts
DocumentEditUtils.ts
DateUtils.ts
all models
all components
all module index files if present
```

Main findings already visible:

```text
Vue 2 bootstrap:
- main.ts uses import Vue from "vue"
- Vue.use(...)
- abacoApp.start((h) => h(App)).then((vue) => vue.$mount("#app"))

Vue 2 decorators:
- vue-property-decorator in App.vue
- FarmInvolvedContainer.vue
- InvolvedWorkerTile.vue
- DocumentEditUtils.ts
- DateUtils.ts

Vue 2 template syntax:
- .sync is used in InvolvedWorkerTile.vue
- :value + @input is used in InvolvedWorkerTile.vue
- v-model must be checked against Vue 3 component APIs

Vue CLI:
- vue.config.js must be migrated to vite.config.ts
- publicPath must become Vite base
- devServer.proxy must be preserved

Store:
- state.ts uses Abaco decorators: AbacoVuexModule, @State, @FromStore
- must verify Vue 3-compatible behavior from @abaco/web-common v3.0.9

Router:
- routes.ts imports RouteConfig from @abaco/web-common/src/app
- must verify whether this type still exists in Vue 3 version
```

---

## Phase 1 — Configuration migration

Files to create/replace:

```text
.npmrc
env.d.ts
eslint.config.js
index.html
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
```

Important Vite requirements:

```ts
base: "/portal/"
server: {
  port: 9090,
  proxy: {
    "/sso2": { target: DEFAULT_TARGET, changeOrigin: true },
    "/i18n": { target: DEVS4F, changeOrigin: true },
    "/farm-registry": { target: DEFAULT_TARGET, changeOrigin: true },
    "/schede": { target: DEFAULT_TARGET, changeOrigin: true },
    "/sitiagri-rest-api": { target: DEFAULT_TARGET, changeOrigin: true },
    "/anag-api": { target: DEFAULT_TARGET, changeOrigin: true },
    "/sitiInfoRestApi": { target: DEFAULT_TARGET, changeOrigin: true },
    "/geocoding-api/api": { target: DEFAULT_TARGET, changeOrigin: true },
    "/dashboard/api": { target: DEFAULT_TARGET, changeOrigin: true },
    "/checklist-api": { target: DEFAULT_TARGET, changeOrigin: true }
  }
}
```

Do not copy `index.html` blindly from `module-vue3`, because the reference points to:

```html
<script type="module" src="/src/quick-test/main.ts"></script>
```

For `farm-registry`, it should point to the real entry, probably:

```html
<script type="module" src="/src/main.ts"></script>
```

or the actual path if `main.ts` is under another folder.

---

## Phase 2 — Package migration

Replace current Vue 2 package setup with Vue 3/Vite setup.

Required Abaco dependency versions:

```json
{
  "@abaco/map-web-module": "v3.0.0",
  "@abaco/sso-web-module": "v4.0.1",
  "@abaco/tiles-framework": "v8.0.5",
  "@abaco/web-common": "v3.0.9",
  "@abaco/web-components": "v5.0.16",
  "@abaco/menu-module": "v4.0.0"
}
```

Remove:

```json
"@vue/cli-service"
"@vue/cli-plugin-babel"
"@vue/cli-plugin-eslint"
"@vue/cli-plugin-typescript"
"@vue/cli-plugin-unit-jest"
"vue-template-compiler"
"vue": "<=2.6.14"
"vue-router": "^3.5.4"
"typescript": "^3.9.7"
"eslint": "^6.7.2"
"vue-property-decorator"
"vue-class-component"
```

Add/align:

```json
"vue": "^3.5.25",
"vue-router": "^4.6.4",
"vuex": "^4.1.0",
"vue-facing-decorator": "^4.0.1",
"vite": "^7.3.0",
"typescript": "~5.9.3",
"vue-tsc": "~3.0.8",
"@vitejs/plugin-vue": "^6.0.3"
```

Scripts should become:

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --ignore-pattern \".scannerwork/*\"",
  "lint:fix": "eslint . --ignore-pattern \".scannerwork/*\" --fix",
  "type-check": "vue-tsc --build --force",
  "test": "vue-tsc --build --force"
}
```

Codex must ask you to run:

```bash
pnpm install
```

---

## Phase 3 — Bootstrap migration in `main.ts`

Current `main.ts` is one of the riskiest files.

It currently does:

```ts
Vue.use(TilesFramework)
Vue.use(WebComponents)
abacoApp.start((h) => h(App)).then((vue) => vue.$mount("#app"))
```

Codex must verify the Vue 3 API of:

```text
@abaco/web-common/src/app/Application
@abaco/web-components/src/components
@abaco/tiles-framework/src/components
@abaco/sso-web-module/src/abaco-module
@abaco/menu-module/src/modules/menu/index
```

Likely migration target:

```ts
import { createApp } from "vue";
```

But Codex must not assume `Application.start()` still works the same in `@abaco/web-common@3.0.9`.

Required checks:

```text
- Does Application still accept rootComponent?
- Does Application.start still receive render function?
- Does it now return Vue app instead of Vue instance?
- Does WebComponents install through app.use?
- Does TilesFramework install through app.use?
- Does setI18N still exist?
- Does SsoWebModule constructor signature still match?
- Does MenuModule loadMenu still work the same?
```

---

## Phase 4 — Decorator migration

Replace:

```ts
import { Vue, Component, Prop, Inject, Watch, Ref } from "vue-property-decorator";
```

with:

```ts
import { Vue, Component, Prop, Inject, Watch, Ref } from "vue-facing-decorator";
```

Files confirmed:

```text
App.vue
FarmInvolvedContainer.vue
InvolvedWorkerTile.vue
DocumentEditUtils.ts
DateUtils.ts
```

Also search the full repository.

Special attention:

```text
@FromStore
@State
AbacoVuexModule
```

These are from `@abaco/web-common/src/app`, not `vue-property-decorator`, so do not replace them blindly.

---

## Phase 5 — Template migration

Confirmed risky file:

```text
InvolvedWorkerTile.vue
```

Required changes:

```vue
:search.sync="councilSelected.descr"
```

becomes likely:

```vue
v-model:search="councilSelected.descr"
```

and:

```vue
:search.sync="userSearch"
```

becomes:

```vue
v-model:search="userSearch"
```

This pattern must be checked against `@abaco/web-components@5.0.16`.

Also check:

```vue
:value="companyCode"
@input="checkCompanyCode"
```

In Vue 3 this may need to become:

```vue
:model-value="companyCode"
@update:model-value="checkCompanyCode"
```

or keep as-is only if `abc-input` still emits native `input`.

---

## Phase 6 — Router migration

`routes.ts` may not need a full rewrite if Abaco `Application` owns router registration, but Codex must check this.

Current route objects are simple and probably reusable:

```text
name
path
component lazy import
meta.navbarItems
props
```

Risks:

```text
RouteConfig type may have changed
meta.navbarItems structure may have changed
farm-select-nav-bar-item registration must still work
```

---

## Phase 7 — State/store migration

`state.ts` uses:

```ts
export default class FarmerRegistryVuexModule extends AbacoVuexModule
```

with many `@State()` decorators.

Do not rewrite this to plain Vuex unless required.

Codex must inspect `@abaco/web-common@3.0.9` usage from the migrated reference module, then decide.

Important typo to preserve unless intentionally fixed:

```ts
refreshInvoledLaborList
```

Do not rename it unless all usages are updated.

---

## Phase 8 — API files migration

Files:

```text
CampaignApi.ts
ContractApi.ts
InvolvedApi.ts
```

These are mostly framework-independent.

Checklist:

```text
- Check HTTPClient import path still valid
- Check propsToDate and propsToDatePaged still exist
- Check PagedResults and PagingParams paths
- Check response shape assumptions
- Do not refactor API logic
```

---

## Phase 9 — Utility/mixin migration

Files:

```text
DocumentEditUtils.ts
DateUtils.ts
```

Actions:

```text
- Replace vue-property-decorator with vue-facing-decorator
- Verify class mixin behavior still works
- Check DateHelper path in @abaco/web-components@5.0.16
- Remove unused imports:
  SSO_MODULE_ID in DocumentEditUtils.ts looks unused
  FromStore/SSO_MODULE_ID may be needed in DateUtils.ts
```

---

## Phase 10 — Validation and manual testing

Codex must ask you to run each command:

```bash
pnpm install
pnpm type-check
pnpm lint
pnpm build
pnpm dev
```

Manual tests:

```text
- login through SSO
- menu loading
- /farm/registry
- /farm/registry-detail
- /farm/labor
- /farm/organization
- /farm/supply-chain
- farm selection navbar
- empty farm behavior
- involved workers tile
- council autocomplete
- linked user autocomplete
- document modal
- API empty responses
```

---

# Improved Codex prompt

```text
You are migrating the @abaco/farm-registry module from Vue 2 / Vue CLI to Vue 3 / Vite.

Do not start coding immediately.

First perform Phase 0 only: inspect the repository and produce a precise migration report. Do not edit files yet.

Hard rules:
1. Do not migrate the whole module in one step.
2. Work phase by phase.
3. After each phase, stop and summarize exact changed files.
4. I will test and commit before allowing the next phase.
5. Preserve business logic. Do not refactor unrelated code.
6. Use the already migrated module-vue3 as the reference.
7. Use vue-facing-decorator instead of vue-property-decorator.
8. Keep Abaco module behavior equivalent unless Vue 3 compatibility requires changes.

Current farm-registry facts:
- package name: @abaco/farm-registry
- current version: 4.11.12
- currently Vue 2 / Vue CLI
- current scripts use vue-cli-service
- current Vue version is <=2.6.14
- current router is vue-router 3
- current TypeScript is 3.9
- current build config is vue.config.js
- current publicPath is /portal
- dev server port is 9090
- vue.config.js contains many proxies that must be preserved in vite.config.ts

Required Vue 3 Abaco versions:
- @abaco/map-web-module: v3.0.0
- @abaco/sso-web-module: v4.0.1
- @abaco/tiles-framework: v8.0.5
- @abaco/web-common: v3.0.9
- @abaco/web-components: v5.0.16
- @abaco/menu-module: v4.0.0

Use these Vue 3 concepts:
- Vue 3
- Vite
- PNPM
- vue-router v4
- vuex v4 if Vuex is still required
- vue-facing-decorator
- TypeScript decorators enabled
- ESLint flat config like module-vue3
- tsconfig split like module-vue3:
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json

Before changing anything, inspect:
- package.json
- vue.config.js
- tsconfig.json
- main.ts
- App.vue
- routes.ts
- state.ts
- FarmInvolvedContainer.vue
- InvolvedWorkerTile.vue
- CampaignApi.ts
- ContractApi.ts
- InvolvedApi.ts
- DocumentEditUtils.ts
- DateUtils.ts
- all module index files
- all components
- all models
- all services
- all utilities

Search for Vue 2-only patterns:
- import Vue from "vue"
- Vue.use
- Vue.prototype
- Vue.extend
- Vue.set
- Vue.delete
- vue-property-decorator
- vue-class-component
- vue-template-compiler
- beforeDestroy
- destroyed
- filters
- $listeners
- $scopedSlots
- $children
- .sync
- value/input component v-model pattern
- @input
- RouteConfig from Vue Router 3 or Abaco old API

Known risky files:
- main.ts because it uses Vue.use, Application, SSO, MenuModule, WebComponents, TilesFramework, and abacoApp.start
- InvolvedWorkerTile.vue because it uses .sync, many v-models, decorators, refs, watchers, autocomplete, modal, form validation
- state.ts because it uses AbacoVuexModule and @State decorators
- routes.ts because RouteConfig comes from @abaco/web-common/src/app
- vue.config.js because all proxies must be converted to Vite server.proxy
- tsconfig.json because it is Vue CLI/Webpack/Jest oriented

Phase 0 output must include:
1. Exact list of files that need changes.
2. Exact list of dependencies to remove.
3. Exact list of dependencies to add/update.
4. Exact Vue 2 APIs found and where.
5. Exact template migration points.
6. Exact risks.
7. Questions before implementation.
8. Proposed Phase 1 implementation plan.

Do not edit files in Phase 0.
```
