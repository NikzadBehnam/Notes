Below are the two roadmaps and copy-ready Codex prompts.

**1. `@abaco/menu-module` Roadmap**
Primary conclusion: this module probably needs **no feature implementation**. Its job is to load the backend hierarchy and match allowed backend menu leaves against local frontend `MenuItem.id`s.

For Catasto Massivo, the required behavior is already the existing pattern:

- Backend hierarchy contains a leaf with id `import-catasto`, under `BACK OFFICE`.
- `@abaco/coldiretti-embedded-sections-module` exposes a local menu item with id `import-catasto`.
- `@abaco/menu-module` maps the backend leaf to that local item.
- The parent `BACK OFFICE` group comes from backend hierarchy, not from a frontend module.

Implementation guidance:

- Do not hardcode Catasto Massivo in `@abaco/menu-module`.
- Do not add a Back Office group manually.
- Verify that `mapMenu` already supports a backend parent with a new child leaf.
- Add or update tests only if the project already has menu mapping tests.
- The test should prove that a backend leaf `import-catasto` is shown when a local menu item with id `import-catasto` exists.
- If no test setup exists, document the expected contract instead of changing runtime code.

Copy-ready prompt for the `menu-module` project:

```text
We need to validate the menu behavior for a new Coldiretti Back Office feature named “Import Catasto” / “Catasto Massivo”.

Please inspect `@abaco/menu-module` and confirm how backend hierarchy menu entries are matched with frontend module `MenuItem`s.

Expected architecture:
- Backend hierarchy provides a parent group such as BACK OFFICE.
- Backend hierarchy includes a child leaf with id `import-catasto`.
- A registered frontend module will expose a local `MenuItem` with the same id: `import-catasto`.
- `@abaco/menu-module` should map the backend hierarchy leaf to the local frontend menu item.
- The menu module should not hardcode Catasto Massivo, Back Office, or Coldiretti-specific logic.

Tasks:
1. Inspect the existing menu loading and mapping logic.
2. Confirm whether any code change is required for a new backend leaf id `import-catasto`.
3. If tests already exist for hierarchy/local menu mapping, add a focused test proving that a backend leaf `import-catasto` is rendered when a local `MenuItem` with id `import-catasto` exists.
4. If no test harness exists or adding one is disproportionate, do not create broad infrastructure; instead document the contract in the most appropriate existing project documentation or leave a concise technical note.
5. Do not modify unrelated menu behavior.
6. Do not add hardcoded feature ids except in a test fixture, if a test is added.

Acceptance criteria:
- The module either has no runtime code changes with a clear explanation, or only focused tests/docs.
- No Coldiretti-specific logic is introduced into `@abaco/menu-module`.
- The required contract is clear: backend menu id and frontend `MenuItem.id` must both be `import-catasto`.
```

**2. `@abaco/coldiretti-embedded-sections-module` Roadmap**
This is the feature implementation module.

Add Catasto Massivo here because it already owns Coldiretti-specific Back Office-style entries like `import-company`, `activation-form`, and `system-monitoring`.

Implementation guidance:

- Add a new menu item:
  - id: `import-catasto`
  - route name: `import-catasto`
  - path: `/import-catasto`
  - label key: likely `import-catasto`
- Add a page/tile container consistent with the module’s existing tile-container pattern.
- Add a real Vue tile component, not an iframe.
- Add API wrapper for:
  - `PUT /api/v1/aggiornacatasto/regione/{cadastral_dataset}/provincia/{province_code}/comune/{council_code}`
  - `GET /api/v1/aggiornacatasto/progress/import/{importId}`
- Add Comune autocomplete using the appezzamento pattern:
  - `abc-infinite-autocomplete`
  - endpoint based on `/sitiagri-rest-api/api_basic/v1/plots/dictionary_councils`
  - include `administrative_tree=true`
- Require selected Comune to provide:
  - `council_code`
  - `province_code`
  - `cadastral_dataset`
- Add polling with cleanup on destroy.
- Show separate progress for:
  - fogli
  - particelle
- Show discarded counts and `errorLog`.

Copy-ready prompt for the `coldiretti-embedded-sections-module` project:

```text
Implement a new Coldiretti Back Office feature called “Import Catasto” / “Catasto Massivo” inside `@abaco/coldiretti-embedded-sections-module`.

Context:
This module already owns Coldiretti-specific menu entries and routes such as `import-company`, `activation-form`, `system-monitoring`, and QdC pages. The new feature should follow the same module architecture: menu item, route, tile container, component, API wrapper, and models.

Menu/route requirements:
1. Add a local menu item with id `import-catasto`.
2. The menu item should use descrKey `import-catasto`.
3. The menu item should route to `{ name: "import-catasto" }`.
4. Add route:
   - name: `import-catasto`
   - path: `/import-catasto`
   - component: a new Catasto Massivo tile container/page
   - no farm/campaign/navbar filters unless existing conventions require explicitly empty `navbarItems: []`.
5. Do not create the Back Office parent group in frontend. Backend hierarchy owns that. The frontend only exposes the leaf id `import-catasto`.

Feature requirements:
1. The page lets the user select a Comune.
2. Use the same UX pattern as the appezzamento Comune selector in `@abaco/crop-plan-module`, preferably `abc-infinite-autocomplete`.
3. Comune lookup should call:
   `/sitiagri-rest-api/api_basic/v1/plots/dictionary_councils`
   with `administrative_tree=true`.
4. The selected Comune must provide:
   - `council_code`
   - `province_code`
   - `cadastral_dataset`
5. Disable the start button until all required Comune fields are available.

API requirements:
1. Add a dedicated API class, for example `CatastoMassivoApi`.
2. Add method to start import:
   `PUT /api/v1/aggiornacatasto/regione/{cadastral_dataset}/provincia/{province_code}/comune/{council_code}`
3. Expected start response:
   `{ importId: number }`
4. Add method to read progress:
   `GET /api/v1/aggiornacatasto/progress/import/{importId}`
5. Progress model fields:
   - importId
   - reqId optional
   - codComune
   - fogliTotali
   - fogliElaborati
   - fogliScartati
   - particelleTotali
   - particelleElaborate
   - particelleScartate
   - errorLog
6. Do not put the new API under `/sitiagri-rest-api/api_basic`; the `aggiornacatasto` API path is `/api/v1/...`.

Polling/UI requirements:
1. After a successful start request, store `importId`.
2. Fetch progress immediately.
3. Poll progress at a small fixed interval, for example 5 seconds, unless the project has a shared interval convention.
4. Avoid overlapping requests. Prefer a tokenized `setTimeout` loop rather than raw `setInterval`.
5. Stop polling on component destroy/navigation.
6. Stop polling when progress appears complete:
   - fogliElaborati + fogliScartati >= fogliTotali
   - particelleElaborate + particelleScartate >= particelleTotali
   If the backend exposes a terminal status, prefer that.
7. Show separate progress for fogli and particelle.
8. Show discarded counts.
9. Show `errorLog` inline when present.
10. Show request/API failures via the module’s existing toast/error pattern.

Implementation constraints:
- Follow existing code style in `coldiretti-embedded-sections-module`.
- Do not modify `@abaco/menu-module`.
- Do not modify unrelated Coldiretti embedded pages.
- Do not edit generated files or package metadata unless required by the project.
- Add translations for `import-catasto` if this package owns translations.
- Add focused tests if this module has an existing test setup; otherwise verify with build/typecheck.

Acceptance criteria:
- A local menu item with id `import-catasto` exists.
- The route `/import-catasto` exists.
- The page allows selecting a Comune and starting the Catasto import.
- The start API is called with `cadastral_dataset`, `province_code`, and `council_code`.
- The progress API is polled and displayed.
- Polling is cleaned up on navigation.
- No Back Office parent menu logic is added frontend-side.
```

The split is important: `menu-module` should stay generic; `coldiretti-embedded-sections-module` should own the actual feature.