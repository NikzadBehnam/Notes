# Ticket #220278 - PCG JSON File Import Technical Analysis

## 1. Executive Summary

Ticket #220278 does require Front End development in Portal Global State if the intended behavior is to let the user select a JSON file for a generic Demetra import parameter declared as `parameter_type = "java.io.File"`.

The current generic import page is implemented in this repository, `@abaco/portal-global-state`, and is used by the Portal/Demetra application as package version `2.22.3`. The page preserves `parameter_type` in the model but does not use it to select a file component, except for one numeric check for `java.lang.Integer`.

Root cause:

`src/modules/global-state/components/import/ImportTile.vue` renders every visible parameter as either:

- an `abc-date-input` only when `sco_descr_parameter` is `RCFROM` or `RCA_TO`;
- otherwise an `abc-input`.

There is no branch for `java.io.File`, so a file parameter falls into the generic `abc-input` branch and appears as a textbox.

The request flow is also not file-capable today. `ImportTile.vue` stores parameter values as `string | number | null`, and `ImportApi.verifyImport()` serializes them into one pipe-separated `params` string inside a `FormData`. It never stores a browser `File`, never appends `source_file`, `file`, or another binary field, and never receives or propagates a returned `FILE_ID`.

Conclusion:

- Portal Global State owns the generic import parameter UI.
- The current generic import UI does not recognize `java.io.File`.
- Configuration alone cannot make `java.io.File` render as a file selector in this UI.
- Existing `abc-file-input` and other upload examples can be reused as UI/request patterns, but no generic import implementation exists yet.
- Based on available local code, the missing behavior is FE-side. Backend capability is documented in `import pcg.docx`, but the backend source repositories named in the document are not present locally, so BE non-involvement is not fully source-code-proven here.

## 2. Investigation Scope

This was an analysis-only investigation. No source implementation changes were made. The only repository file created is this report.

Inputs treated as evidence, not instructions:

- `C:/Users/n.behnam/Downloads/#220278 - COPY - DEMETRA (Cooperative) - Import PCG da file json.pdf`
- `C:/Users/n.behnam/Documents/import pcg.docx`
- pasted screenshots from ticket/email #213425
- pasted request text

Primary repository:

- `C:/ABC/portal-global-state`

Related local repositories/modules inspected:

- `C:/ABC/portal`
- `node_modules/@abaco/web-components`
- `node_modules/@abaco/farm-registry`
- additional local `C:/ABC` search for upload patterns and backend/import terms

## 3. Provided Context and Known Architecture

The ticket export says the current question is whether the Demetra web page manages file inputs.

Source:

`C:/Users/n.behnam/Downloads/#220278 - COPY - DEMETRA (Cooperative) - Import PCG da file json.pdf`

Relevant extracted ticket note:

```text
How to implement the import is described in the provided documentation.
It remains to be verified whether the Demetra web page handles file-type inputs.
```

The technical DOCX says the generic import backend supports file parameters through `java.io.File`, stores the uploaded file in alternativeRMI, and passes the import code a `FILE_ID`.

Source:

`C:/Users/n.behnam/Documents/import pcg.docx`

Relevant extracted text:

```text
The import already includes a file parameter "java.io.File" ...
The specified file is saved on alternativeRMI and the import is passed
the FILE_ID parameter populated with the ID of the file on alternativeRMI.
```

This is useful backend contract context, but backend source code for `sitiagri-rest-api`, `servizi`, `servizi-custom-coldiretti`, `asynchronous-import-container`, and `asynchronous-import-coldiretti` was not present in the local workspace, so the backend implementation itself remains unverified from source in this investigation.

## 4. Repositories / Modules Investigated

### Portal Global State

Repository:

`C:/ABC/portal-global-state`

Package:

`@abaco/portal-global-state`

Version:

`2.22.3`

Source:

`package.json`

```json
{
  "name": "@abaco/portal-global-state",
  "version": "2.22.3"
}
```

### Portal consuming app

Repository:

`C:/ABC/portal`

The portal app has a Demetra-specific mode and consumes Portal Global State as a package.

Source:

`C:/ABC/portal/package.json:96`

```json
"@abaco/portal-global-state": "2.22.3"
```

Source:

`C:/ABC/portal/src/main.ts`

Relevant logic:

```ts
const isOntDemetra = MODE === "coldiretti-ont-demetra";
...
abacoApp.add(new PortalGlobalStateModule());
```

This means a Portal Global State fix normally requires a new package release and a consuming Portal dependency update.

### Web Components

Module:

`node_modules/@abaco/web-components`

Finding:

The standard `abc-file-input` exists and emits browser file selections.

### Farm Registry

Module:

`node_modules/@abaco/farm-registry`

Finding:

Farm Registry uses `abc-file-input` for document fields and uses `FormData` upload APIs, but these are document/involved-worker specific, not generic import APIs.

## 5. Current Import Flow

### Entry point: plot tile

File:

`src/PlotTile.vue`

Relevant lines:

```vue
5: <import-button
6:     importType="PLOT"
7:     @import-done="onImportDone"
8:     :showImport.sync="showImport"
9:     :showImportModal.sync="showImportModal"
10: />
```

Reason it matters:

The generic plot import feature is opened from the plot tile with `importType="PLOT"`, matching the object type shown in the ticket/context.

### Import list

File:

`src/modules/global-state/components/import/ImportButton.vue`

Relevant lines:

```vue
7: @click="onSelectImportMethod(index)"
8: v-for="(item, index) in importMethodsPage.records"
12: <p class="font-semibold">{{ item.ds_import_method }}</p>
```

Relevant function:

```ts
57: private async loadImpMethods() {
58:     this.importMethodsPage = await this.globalState.importApi.getImportMethods(this.importType, {
59:         offset: 0,
60:         count: 300,
61:     });
62: }
```

Reason it matters:

The import menu is not hardcoded per import method. It comes from the backend import-method API for the object type.

### Selected import modal

File:

`src/modules/global-state/components/import/ImportButton.vue`

Relevant lines:

```vue
20: <import-tile
21:     :objectImportId="importType"
22:     :import-method="curImportMethod"
...
25:     :parametersToSet="parametersToSet"
26: />
```

Relevant function:

```ts
80: private onSelectImportMethod(index: number) {
81:     this.curImportMethod = this.importMethodsPage.records[index];
...
87:     if (this.showImportModal !== null) {
88:         this.showImportModalInternal = true;
89:     } else {
90:         this.$emit("open-import-modal", this.importType, this.curImportMethod, this.parametersToSet);
91:     }
92: }
```

Reason it matters:

The default path opens `ImportTile.vue`. There is also an extension hook via `open-import-modal` when `showImportModal === null`, but `PlotTile.vue` passes a boolean, so the standard `ImportTile` path is used for plot imports.

### API client

File:

`src/modules/global-state/api/ImportApi.ts`

Relevant methods:

```ts
19: async getImportMethods(object_type_id: string, paging: PagingParams)
20:     `/sitiagri-rest-api/api_basic/v1/services/import/${object_type_id}/imports`
```

```ts
32: async getParameters(object_type_id: string, import_method_id: string)
34:     `/sitiagri-rest-api/api_basic/v1/services/import/${object_type_id}/imports/${import_method_id}/parameters`
```

```ts
106: async verifyImport(...)
132: `/sitiagri-rest-api/api_basic/v1/services/import/${object_type_id}/imports/${import_method_id}/imports`
```

```ts
172: async executeImport(object_type_id: string, import_method_id: string, import_id: number)
175: `/sitiagri-rest-api/api_basic/v1/services/import/${object_type_id}/imports/${import_method_id}/imports/${import_id}`
```

Reason it matters:

The full generic import API flow is wrapped in `ImportApi.ts`.

## 6. Portal Global State Investigation

Portal Global State registers the import components globally.

File:

`src/modules/global-state/globals.ts`

Relevant lines:

```ts
12: "ImportTile": () => import("./components/import/ImportTile.vue"),
13: "ImportButton": () => import("./components/import/ImportButton.vue"),
```

The module creates the import API wrapper on route entry.

File:

`src/modules/global-state/index.ts`

Relevant lines:

```ts
90: const ImportApi = (await import("./api/ImportApi")).default;
91: this.imprtApi = new ImportApi(http);
...
98: get importApi() {
99:     return this.imprtApi;
100: }
```

Conclusion:

Portal Global State is the owner of the generic import UI and generic import API wrapper used by the plot import page.

## 7. Import Parameter Rendering

File:

`src/modules/global-state/components/import/ImportTile.vue`

Renderer excerpt:

```vue
35: <abc-form ref="form" class="flex flex-wrap gap-4" @submit="verifyImport">
36:     <div v-for="param in visibleParameters" :key="param.sco_descr_parameter" class="flex-grow">
37:         <abc-date-input
38:             v-if="param.sco_descr_parameter === 'RCFROM' || param.sco_descr_parameter === 'RCA_TO'"
...
61:         <abc-input
62:             v-else
63:             :is-disabled="!param.fg_editable"
64:             :is-numeric="param.parameter_type === 'java.lang.Integer'"
65:             :label="param.ds_parameter"
66:             :value="getParamValue(param)"
67:             @input="setParamValue(param, arguments[0])"
68:             :rules="param.fg_mandatory ? mandatoryField : undefined"
69:             :placeholder="param.de_parameter"
70:         ></abc-input>
```

Parameter filtering/state:

```ts
625: get visibleParameters() {
626:     this.refillParameters();
627:     return this.parameters.filter((p) => p.fg_visible);
628: }
```

Mandatory/editable behavior:

- visible: `fg_visible` filters the parameter list.
- mandatory: `fg_mandatory` applies `mandatoryField` validation rules to the rendered input.
- editable: `fg_editable` disables only the generic `abc-input` branch.

There is no lookup branch, no generic date branch by `parameter_type`, and no file branch. Date rendering is hardcoded to `sco_descr_parameter === "RCFROM"` or `"RCA_TO"`, not `parameter_type`.

## 8. Handling of `java.io.File`

### Model preserves the type string

File:

`src/modules/global-state/models/Import.ts`

Relevant lines:

```ts
16: export interface ImportParameter {
...
28:     parameter_type: string;
29:     parameter_name: string;
30:     cod_descr_parameter: string;
31: }
```

The model can receive `parameter_type = "java.io.File"` as data.

### Renderer does not recognize it

File:

`src/modules/global-state/components/import/ImportTile.vue`

Relevant renderer logic:

```vue
37: <abc-date-input
38:     v-if="param.sco_descr_parameter === 'RCFROM' || param.sco_descr_parameter === 'RCA_TO'"
...
61: <abc-input
62:     v-else
64:     :is-numeric="param.parameter_type === 'java.lang.Integer'"
```

Explanation:

`java.io.File` does not satisfy the date condition and does not have a dedicated branch. It reaches the `v-else` branch and is rendered as `abc-input`. The only use of `parameter_type` in the renderer is `java.lang.Integer`, and that only toggles numeric behavior on `abc-input`.

### State cannot hold a `File`

File:

`src/modules/global-state/models/Import.ts`

```ts
100: export interface ParameterOut {
101:     parameter_name: string;
102:     parameter_value: string | number | null;
103: }
```

File:

`src/modules/global-state/components/import/ImportTile.vue`

```ts
634: private setParamValue(p: ImportParameter, val: string | number | null) {
```

Explanation:

The generic parameter-value model and setter do not allow `File`, `FileList`, or a file metadata object.

Conclusion:

The current UI does not support `java.io.File`. It is not partially wired in the generic import page.

## 9. Verification and Execution Flow

### Verification

File:

`src/modules/global-state/components/import/ImportTile.vue`

Relevant lines:

```ts
646: private async verifyImport(onProgressionModalShown = false) {
...
661: const isValid = this.form.validate();
662: if (isValid) {
...
667:     this.importRes = await this.globalState.importApi.verifyImport(
668:         this.objectImportId,
669:         this.importMethod.import_method_id,
670:         this.parameterValues,
671:         this.farm ? this.farm.pk_cuaa : null,
672:         this.notes ? this.notes : undefined
673:     );
```

### Execution

File:

`src/modules/global-state/components/import/ImportTile.vue`

Relevant lines:

```ts
729: private async executeImport() {
...
736:     this.importRes = await this.globalState.importApi.executeImport(
737:         this.objectImportId,
738:         this.importMethod.import_method_id,
739:         this.importRes.import_id!
740:     );
```

The execution phase only sends `import_id`. Any file needed by execution must already have been handled during verification/staging.

## 10. API / Multipart File Upload Investigation

### Generic import API currently serializes textual params only

File:

`src/modules/global-state/api/ImportApi.ts`

Relevant lines:

```ts
113: let paramsString = "";
114: parameterValues.forEach((pv) => {
115:     if (pv.parameter_value) {
116:         paramsString = paramsString.concat(`${pv.parameter_name}=${pv.parameter_value}|`);
117:     }
118: });
119: if(pk_cuaa){
120:     paramsString = paramsString.concat(`SUBJECT_ID=${pk_cuaa.toString()}`);
121: }
122: const formData = new FormData();
123: formData.append("params", paramsString);
124: formData.append("object_type_id", object_type_id);
125: formData.append("import_method_id", import_method_id);
126: if (notes) {
127:     formData.append("notes", notes);
128: }
131: const res = await this.http.post(
132:     `/sitiagri-rest-api/api_basic/v1/services/import/${object_type_id}/imports/${import_method_id}/imports`,
133:     formData
134: );
```

Finding:

`FormData` is already used, but only for textual fields. The generic import API does not append `source_file`, `sourceFile`, `file`, or any file parameter. It also does not use `parameter_type` to choose request serialization.

### Existing non-import multipart examples

Farm Registry document upload:

File:

`node_modules/@abaco/farm-registry/src/modules/api/DocumentsApi.ts`

```ts
48: public async insertDocumentAttachment(
...
54:     const formData = new FormData();
55:     if (file && file !== null && file !== undefined && formFile) {
56:         formData.append("file", formFile, file.name);
57:     }
59:     const res = await this.http.post(
60:         `/checklist-api/api/v1/documents/content/document/${documentId}/rows/${rowId}/upload`,
61:         formData
62:     );
```

Farm Registry involved-worker upload:

File:

`node_modules/@abaco/farm-registry/src/modules/api/InvolvedApi.ts`

```ts
341: const formData = new FormData();
342: if (file && file !== null && file !== undefined && form.source_file) {
343:     formData.append("source_file", form.source_file, file.name);
344: }
```

Finding:

The FE stack has established `FormData` upload patterns, including `source_file`, but they are not connected to generic imports.

### Backend endpoint contract

The pasted email screenshots show an API signature with a second import endpoint consuming multipart form data and taking:

```text
@FormDataParam("source_file") InputStream ...
@FormDataParam("source_file") FormDataContentDisposition ...
@FormDataParam("params") String pipedParams
```

This was not verified from local backend source because that source was not present.

## 11. Existing Reusable File Components

### `abc-file-input`

File:

`node_modules/@abaco/web-components/src/components/input/AbcFileInput.vue`

Relevant lines:

```vue
10: <input
15:     type="file"
16:     :value="currentVal"
17:     @input="updateCurrentVal"
...
24:     :accept="accept != null ? accept : ''"
25: />
```

File-change behavior:

```ts
100: private updateCurrentVal(e: any) {
101:     if (e && e.target && e.target.files && e.target.files.length > 0) {
102:         this.currentVal = e.target.value;
103:         const fileData = e.target.files[0];
104:         this.filename = fileData.name;
105:         this.$emit("file-change", e.target.files);
106:     } else {
107:         this.filename = null;
108:         this.currentVal = null;
109:     }
110: }
```

Fit:

This is the standard Abaco file selector and is suitable as the UI control for a generic import file parameter.

### Farm Registry document-field usage

File:

`node_modules/@abaco/farm-registry/src/modules/farm-registry/components/tiles/documents/GroupFieldInputs.vue`

Relevant lines:

```vue
132: <template v-if="getRowTypeFromCode(field.sco_type) == 'file'">
133:     <abc-file-input
134:         :rules="field.fg_mandatory === 'S' && fieldFakeFile(field) == null ? mandatoryRule : []"
135:         :label="field.ds_description"
136:         :fake-value="fieldFakeFile(field)"
137:         @file-change="checkFieldFile(field, $event)"
...
168:     </abc-file-input>
```

State/upload behavior:

```ts
406: private async checkFieldFile(field: DocumentFieldFull, files: File[]) {
407:     if (files && files.length > 0) {
...
413:         this.fieldsFiles.push({ rowId: field.row_id, file: files[0], updated: true });
...
416:     this.updateFile(field.row_id);
```

```ts
442: const res = await this.farmerRegistryModule.documentsApi.insertDocumentAttachment(
443:     this.curDocument!.document_id,
444:     rowId,
445:     formFile,
446:     cur.file
447: );
453: if (res.data && res.data.fileId) {
454:     this.groupField.find((f) => f.row_id === rowId)!.file_id = res.data.fileId;
455: }
```

Fit:

This is useful as a UI and state-management pattern, but the API is document-specific. It should not be reused directly for generic import uploads.

## 12. Root Cause

Finding:

`java.io.File` is rendered as a textbox because the generic import renderer has no file branch and sends all non-year parameters to `abc-input`.

Source:

`src/modules/global-state/components/import/ImportTile.vue`

Relevant code:

```vue
37: <abc-date-input
38:     v-if="param.sco_descr_parameter === 'RCFROM' || param.sco_descr_parameter === 'RCA_TO'"
...
61: <abc-input
62:     v-else
64:     :is-numeric="param.parameter_type === 'java.lang.Integer'"
```

Technical explanation:

- `parameter_type = "java.io.File"` reaches the `v-else`.
- The `v-else` is `abc-input`.
- `parameter_type` is only checked for `java.lang.Integer`.
- `ParameterOut` cannot store `File`.
- `ImportApi.verifyImport()` cannot append `File` to `FormData`.

Therefore the reported `FILE ID` textbox is the expected result of the current source code.

## 13. Configuration vs Development Assessment

Configuration alone is not sufficient.

Reason:

The backend/configuration can expose a parameter with:

```json
{
  "parameter_name": "ID_FILE",
  "parameter_type": "java.io.File",
  "fg_visible": 1,
  "fg_editable": 1,
  "ds_parameter": "FILE ID"
}
```

But the FE renderer does not map `java.io.File` to a file component. No alternative configuration value was found in Portal Global State that would trigger a generic file input. The only explicit type-based branch is:

```vue
:is-numeric="param.parameter_type === 'java.lang.Integer'"
```

Development is required in Portal Global State to:

- recognize file parameter type(s);
- render `abc-file-input`;
- store the selected `File`;
- validate mandatory files;
- send the selected file through the expected import endpoint contract.

## 14. FE vs BE Responsibility

Classification:

FE required; BE change unconfirmed.

What is source-code-proven:

- FE does not render `java.io.File` correctly.
- FE does not store/send a file for generic imports.
- FE already has generic import methods and can post a `FormData`, but only with text fields.

What is document-supported but not source-code-proven locally:

- Backend import infrastructure supports `java.io.File`.
- Backend stores the file and passes `FILE_ID` to import processing.
- The multipart endpoint accepts `source_file` plus `params`.

If the backend contract from the DOCX/email is accurate, the required missing functionality is FE-only. If the backend endpoint differs by environment or requires a different form field name than `source_file`, the future FE change may need BE/API confirmation but not necessarily BE code.

## 15. Exact Files and Functions Involved

### Definitely involved

Repository/module:

`@abaco/portal-global-state`

File:

`src/modules/global-state/components/import/ImportTile.vue`

Responsibility:

Generic import modal, parameter rendering, parameter state, verification/execution orchestration.

Relevant code:

- template parameter renderer lines 35-70
- `visibleParameters()` lines 625-628
- `setParamValue()` lines 634-644
- `verifyImport()` lines 646-727

Why involved:

This is where `java.io.File` currently becomes `abc-input`, and where selected file state would need to be collected.

Repository/module:

`@abaco/portal-global-state`

File:

`src/modules/global-state/models/Import.ts`

Responsibility:

Generic import method/parameter/result TypeScript contracts.

Relevant code:

- `ImportParameter.parameter_type` line 28
- `ParameterOut.parameter_value: string | number | null` lines 100-103

Why involved:

The parameter-value model cannot represent a selected file.

Repository/module:

`@abaco/portal-global-state`

File:

`src/modules/global-state/api/ImportApi.ts`

Responsibility:

Generic import API wrapper.

Relevant code:

- `getImportMethods()` lines 19-30
- `getParameters()` lines 32-45
- `verifyImport()` lines 106-135
- `executeImport()` lines 172-177

Why involved:

`verifyImport()` must be changed or overloaded to send the selected file using the backend contract.

### Probably involved

Repository/module:

`@abaco/portal-global-state`

File:

`src/modules/global-state/components/import/ImportButton.vue`

Responsibility:

Import-method menu and modal entry.

Why probably involved:

Not required for basic file support, but relevant if file imports need a custom modal route or an extension point.

Repository/module:

`@abaco/web-components`

File:

`node_modules/@abaco/web-components/src/components/input/AbcFileInput.vue`

Responsibility:

Standard file input component.

Why probably involved:

Should be reused. No modification is currently indicated.

Repository/module:

`C:/ABC/portal`

Files:

- `package.json`
- `package-lock.json`

Responsibility:

Consuming Portal application dependency lock.

Why probably involved:

A Portal Global State package release would need to be consumed by Portal/Demetra.

### Investigated but likely not requiring changes

Repository/module:

`@abaco/farm-registry`

Files:

- `components/tiles/documents/GroupFieldInputs.vue`
- `src/modules/api/DocumentsApi.ts`
- `src/modules/api/InvolvedApi.ts`

Responsibility:

Document/involved upload workflows.

Why likely not involved:

They provide useful patterns but are not generic import code and should not be changed for this ticket.

## 16. Recommended Solution

No implementation was performed. A future implementation should be small and localized.

Recommended sequence:

1. Define a canonical file-parameter check in `ImportTile.vue`, for example `param.parameter_type === "java.io.File"`.
2. Render `abc-file-input` for file parameters.
3. Add file-specific state separate from textual `ParameterOut[]`, for example keyed by `parameter_name`.
4. Apply mandatory validation to the file input, preserving existing validation for text/date/numeric parameters.
5. Do not serialize the browser `File` into the pipe-separated `params` string.
6. Extend `ImportApi.verifyImport()` to accept an optional selected file, or a structured parameter payload containing text params plus file params.
7. Append the file to `FormData` using the backend-confirmed field name, likely `source_file` based on the email screenshots.
8. Preserve current `params`, `object_type_id`, `import_method_id`, `notes`, and `SUBJECT_ID` behavior for non-file parameters.
9. Preserve the current verify-then-execute flow: verification creates/returns `import_id`; execution still sends `PUT .../imports/{import_id}`.
10. Protect all non-file imports by keeping their request body identical when no file parameter is present.

Open contract question before implementation:

Confirm with backend or API docs whether the file field name must be `source_file`, whether the file parameter name (`ID_FILE`) should also appear in `params`, and whether multiple file parameters are possible or unsupported.

## 17. Dependency / Release Impact

Portal app:

`C:/ABC/portal/package.json:96`

```json
"@abaco/portal-global-state": "2.22.3"
```

Portal Global State package:

`C:/ABC/portal-global-state/package.json`

```json
"name": "@abaco/portal-global-state",
"version": "2.22.3"
```

Impact:

If the fix is made in Portal Global State, it should be released as a new `@abaco/portal-global-state` version. The Portal/Demetra consuming app should then bump `@abaco/portal-global-state` and update its lockfile/build.

Because `C:/ABC/portal` uses an exact dependency version in `package.json`, publishing the package alone is not enough for that app; the dependency must be updated.

## 18. Regression Risks

The import page is generic, so regression protection matters.

Main risks:

- String parameters: must keep using `abc-input` and pipe serialization.
- Integer parameters: must keep `is-numeric` behavior for `java.lang.Integer`.
- Year parameters: `RCFROM` and `RCA_TO` must keep the year picker behavior.
- Hidden parameters: `fg_visible = 0` must remain hidden.
- Mandatory parameters: current `abc-form` validation must still block invalid submission.
- Editable parameters: `fg_editable` must still disable editable controls.
- Default values: existing `default_value` initialization and `parametersToSet` behavior must be preserved.
- `SUBJECT_ID`: current `pk_cuaa` injection must not be dropped.
- Verification: non-file imports must send the same payload as today.
- Execution: import execution by `import_id` must remain unchanged.
- Async imports: current progression polling and modals must remain unchanged.
- Multiple parameters: text parameters must still be included alongside a selected file.
- Multiple file parameters: behavior is currently undefined; either support explicitly or reject/guard clearly after backend contract confirmation.

Potential existing issue noticed but not changed:

`visibleParameters()` calls `refillParameters()`, which resets `parameterValues` from defaults whenever the computed property recalculates. This is existing behavior and was not changed. Any future file-state implementation should avoid introducing additional resets of selected files.

## 19. Testing Strategy

### Static/code-level verification

Check:

- `ImportTile.vue` has a branch for `java.io.File`.
- `abc-input` remains the fallback for non-file, non-year parameters.
- `ParameterOut` or a new model can represent file state without breaking existing callers.
- `ImportApi.verifyImport()` appends a file only when present.
- Existing `params` string construction is unchanged for imports without files.

### UI test

Mock/import an API parameter response containing:

```json
{
  "parameter_name": "ID_FILE",
  "parameter_type": "java.io.File",
  "fg_visible": 1,
  "fg_editable": 1,
  "fg_mandatory": 1,
  "ds_parameter": "FILE ID"
}
```

Expected:

- The page renders a file selector, not a textbox.
- Selecting a JSON file displays the selected file name.
- Other text/numeric/date parameters still render as before.

### Request/network test

With a selected file and verify clicked, browser Network should show:

- `POST /sitiagri-rest-api/api_basic/v1/services/import/PLOT/imports/{method}/imports`
- request body is multipart form data;
- text field `params` contains non-file parameters;
- file part is present under backend-confirmed name, likely `source_file`;
- `object_type_id`, `import_method_id`, and optional `notes` are still present.

### Mandatory validation

With no file selected and `fg_mandatory = 1`:

- `this.form.validate()` should fail;
- no verify network request should be sent;
- the file input should show the standard mandatory validation message.

### Successful file case

With a valid JSON file selected:

- verification should return an `import_id`;
- clicking import should still call the existing `PUT .../imports/{import_id}`;
- async progression behavior should be unchanged if `fg_asynchronous = 1`.

### Existing import regression

Run an existing non-file import:

- verify request body should be equivalent to current behavior;
- no file field should be appended;
- numeric/year/default/hidden parameter behavior should be unchanged.

### Automated tests

No existing automated tests for `ImportTile.vue`, `ImportButton.vue`, or `ImportApi.ts` were found in this repository during the search. Future work should add focused unit tests around:

- parameter rendering by type;
- file selection state;
- `verifyImport()` request construction with and without file parameters.

## 20. Answers to the 14 Main Questions

### Q1. Is Portal Global State actually responsible for the generic Demetra import parameter page?

YES.

`PlotTile.vue` uses `ImportButton` with `importType="PLOT"`, `ImportButton.vue` opens `ImportTile.vue`, and `ImportTile.vue` renders the generic import parameters. `C:/ABC/portal` consumes `@abaco/portal-global-state` version `2.22.3`.

### Q2. Does the current UI recognize `parameter_type = "java.io.File"`?

NO.

The renderer only uses `parameter_type` for `java.lang.Integer` numeric input. There is no `java.io.File` check.

### Q3. Does the current UI provide any file-selection component for generic imports?

NO.

`ImportTile.vue` does not render `abc-file-input` or any `<input type="file">`.

### Q4. Why does the reported `java.io.File` parameter render as a textbox?

Because it falls through to the `v-else` branch in `ImportTile.vue`, which is `abc-input`. The `v-if` branch only handles `RCFROM`/`RCA_TO`; all other parameters become text/numeric `abc-input`.

### Q5. Does an existing standard file-upload component already exist that can be reused?

YES.

`AbcFileInput.vue` exists in `@abaco/web-components` and is used by Farm Registry document fields. It emits `file-change` with `FileList`.

### Q6. Does the FE already contain an API/service capable of sending the file using multipart/form-data?

PARTIALLY.

The generic `ImportApi.verifyImport()` already sends `FormData` to the import endpoint, but it only appends textual fields and never appends a file. Other modules contain file upload examples using `FormData`, including `source_file`, but no generic import API wrapper currently sends a file.

### Q7. Can the issue be solved through import configuration alone?

NO.

No configuration value found in the code maps `java.io.File` to a file selector. `java.io.File` currently renders as the default `abc-input`.

### Q8. Is new FE development required?

YES.

FE development is required to render, store, validate, and submit file parameters in generic imports.

### Q9. Is any BE change required for the specific missing functionality?

UNCONFIRMED, likely NO if the documented backend contract is accurate.

The DOCX and email context say backend file support exists. Local backend source was not available to prove the endpoint behavior.

### Q10. Which exact repository/files/functions would need modification if we implement the fix?

Definitely:

- `C:/ABC/portal-global-state/src/modules/global-state/components/import/ImportTile.vue`
- `C:/ABC/portal-global-state/src/modules/global-state/models/Import.ts`
- `C:/ABC/portal-global-state/src/modules/global-state/api/ImportApi.ts`

Probably:

- `C:/ABC/portal/package.json`
- `C:/ABC/portal/package-lock.json`

Reusable but likely unchanged:

- `node_modules/@abaco/web-components/src/components/input/AbcFileInput.vue`

### Q11. Would Portal Global State require a new library/package release and dependency upgrade in Demetra?

YES.

Portal consumes `@abaco/portal-global-state` as package version `2.22.3`. A package release plus Portal dependency update is expected.

### Q12. What is the smallest standard solution consistent with the current architecture?

Add file parameter handling inside the existing generic import flow:

- render `abc-file-input` for `java.io.File`;
- store selected `File` separately from text params;
- validate mandatory file input;
- extend `ImportApi.verifyImport()` to append the selected file using the backend-confirmed multipart field name;
- keep existing verify/execute/progression behavior unchanged.

### Q13. What are the main regression risks?

Breaking existing generic imports by changing parameter serialization, validation, default handling, or async execution flow. The future implementation must be no-op for imports without file parameters.

### Q14. How should the future implementation be tested?

Use unit/static checks for render branching and request construction; UI test with `parameter_type = "java.io.File"`; Network test for multipart file part; mandatory validation test; successful verify/execute test; and regression tests for existing non-file imports.

## 21. Unknowns / Additional Information Needed

Backend/API contract items to confirm before implementation:

- Exact multipart field name for the file: `source_file`, `file`, or parameter-specific name.
- Whether the file parameter name `ID_FILE` should be included in `params`, omitted, or replaced by a returned `FILE_ID`.
- Whether verification stores the file and injects `FILE_ID` automatically.
- Whether more than one `java.io.File` parameter can exist in one import.
- Whether accepted file type should be constrained to JSON in UI via `accept`.
- Whether the Demetra environment uses `api_basic` or `api_sso` path through the HTTP client/proxy at runtime.

Local source not available:

- `sitiagri-rest-api`
- `servizi`
- `servizi-custom-coldiretti`
- `asynchronous-import-container`
- `asynchronous-import-coldiretti`

## 22. Final Conclusion

### Does ticket #220278 require development?

YES.

### Primary owner

FE, specifically Portal Global State.

### Root cause

The generic import parameter renderer does not handle `parameter_type = "java.io.File"` and falls back to `abc-input`. The generic import request builder also cannot carry a browser `File`.

### Required code area

`@abaco/portal-global-state`:

- `ImportTile.vue`
- `Import.ts`
- `ImportApi.ts`

### Backend change required

UNCONFIRMED, likely NO for the missing UI behavior if the documented backend contract is correct.

### Recommended next action

Confirm the exact backend multipart contract, then implement file-parameter support in Portal Global State and release a new `@abaco/portal-global-state` package for the Portal/Demetra application.
