Implemented the complete checklist-print flow in [SeedsMonitoring/table.vue](C:/ABC/widgets-container-module/src/modules/pizzoli-widgets/components/tiles/SeedsMonitoring/table.vue:122).

What now works:

- Main-row icon prints `CONFERIMENTO DA`.
- Expanded Semina-row icon prints `SEMINA PATATE`.
- Both use `PIZZOLI_CONF_SEM_PRINT`.
- `ID_DOCUMENTO` comes from the clicked row’s `document_id`.
- `USERID` comes from the authenticated SSO user.
- The POST response’s `id_stampa_log` starts polling.
- Polling waits for `fl_status === 2`.
- The PDF opens through `printDownload.do` using `print_log_key`.
- Status `9`, request failures, and missing response data show the existing generic print-error toast.
- A loader appears on the clicked row and all print buttons are disabled while printing.
- The polling timer is removed when the component is destroyed.

The main implementation starts at [queueChecklistPrint()](C:/ABC/widgets-container-module/src/modules/pizzoli-widgets/components/tiles/SeedsMonitoring/table.vue:773), with polling at [checkPrintStatus()](C:/ABC/widgets-container-module/src/modules/pizzoli-widgets/components/tiles/SeedsMonitoring/table.vue:828) and PDF opening at [openPrint()](C:/ABC/widgets-container-module/src/modules/pizzoli-widgets/components/tiles/SeedsMonitoring/table.vue:856).

Only this component was modified. The existing API wrappers were reused unchanged. Static diff validation passed; no build, lint, or automated test was run, following the project restriction.

## Manual test steps

### 1. Test “Conferimento da”

1. Open the Monitoraggio del seme widget.
2. Open browser DevTools → Network.
3. Click the download icon on a main table row.
4. Confirm the clicked icon shows a loader.
5. Confirm the other download buttons become disabled.
6. Find this request:

```text
POST /sitiagri-rest-api/api_basic/v1/services/print/scheduled_print/PIZZOLI_CONF_SEM_PRINT
```

7. Verify its body resembles:

```json
{
  "output_file": "PDF",
  "print_desc": "CONFERIMENTO DA",
  "download_name": "CONFERIMENTO DA",
  "params": [
    {
      "param_name": "ID_DOCUMENTO",
      "param_val": "<main row document_id>"
    },
    {
      "param_name": "USERID",
      "param_val": "<logged-in username>"
    }
  ]
}
```

8. Confirm the response contains `id_stampa_log`.

### 2. Test “Semina patate”

1. Expand a main row.
2. In Network, inspect the response from the `/seedings` request.
3. Choose a detail record and note its `document_id`.
4. Click its download icon.
5. Verify the POST body contains:

```text
print_desc: SEMINA PATATE
download_name: SEMINA PATATE
ID_DOCUMENTO: the selected detail record document_id
USERID: the logged-in username
```

### 3. Verify polling

After either print request:

1. Wait approximately 10 seconds.
2. Confirm this request is made:

```text
GET /sitiagri-rest-api/api_basic/v1/services/print/scheduled_print/queued/{id_stampa_log}
```

3. If the status is not complete, confirm it repeats approximately every 20 seconds.
4. Confirm polling stops when `fl_status` becomes `2`.

### 4. Verify PDF opening

When polling returns:

```json
{
  "fl_status": 2,
  "print_log_key": "..."
}
```

Verify:

1. A new browser tab opens.
2. Its URL contains:

```text
/servizi/printDownload.do
?SSO_TOKEN=...
&ID_STAMPA_LOG=<print_log_key>
```

3. The generated PDF opens or downloads.
4. The loader disappears and the print buttons become enabled again.
5. Verify the PDF content corresponds to the selected main or Semina document.

Allow pop-ups for the Portal domain if the browser blocks the new tab.

## How to diagnose test failures

- Main icon is disabled: the `/batch_tracking/seed` response probably has no valid `document_id`.
- Semina icon is disabled: the corresponding `/seedings` record has no `document_id`; ask BE to confirm the response contract.
- POST returns 404/configuration error: ask BE whether `PIZZOLI_CONF_SEM_PRINT` is deployed in the tested environment.
- Both clicks produce the same or wrong template: ask BE whether one print configuration really handles both document types or whether a second configuration ID is required.
- Polling never reaches status `2`: provide BE with `id_stampa_log` so they can inspect the print queue.
- Polling returns an unfamiliar terminal status: ask BE for the complete status-code mapping.
- `fl_status === 2` but no PDF opens: verify `print_log_key`, popup permissions, and the `printDownload.do` network request.
- PDF opens but contains the wrong record: compare the POST `ID_DOCUMENTO` with the clicked row’s API response.