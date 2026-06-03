Below are **3 separate markdown notes**, one for each frontend ticket.

---

# Ticket 1 — #216641 — Gestione pagina filiere - FE

```md
# Ticket #216641 — Gestione pagina filiere - FE

## Codex Prompt

We need to implement the frontend ticket **#216641 - Gestione pagina filiere - FE**.

The request is to create the new frontend page for managing "Filiere" related to supply-chain contracts.

The page must support:
- list of filiere
- create new filiera
- edit filiera
- delete filiera

Important rules:
- Do NOT start coding yet.
- First inspect the existing codebase and explain the current structure.
- Follow existing project patterns.
- Do NOT refactor unrelated code.
- Keep changes minimal and safe.
- Reuse existing shared/global components.
- Do not rename, move, or restructure files unless strictly necessary.

There is already a similar page/module structure that can be used as reference.
Start the analysis from:

src\modules\new-agreements\menu.ts

Look for:

descrKey: "new-agreements-menu"

Use this existing module/page structure as reference for the new "Gestione pagina filiere" implementation.

Please inspect:
- how the module is registered in the menu
- how routes are defined
- how the list page is structured
- how table/search/filter components are used
- how create/edit pages are opened
- how mock/demo data or service calls are handled
- existing styling and layout conventions

For now, only analyse and report:
1. which files are relevant
2. which existing components can be reused
3. where the new filiere page should be added
4. the smallest safe implementation plan
5. any risks or dependencies

Do not write code yet.
```

## Step-by-step implementation after Codex analysis

### Step 1 — Inspect existing module structure

Check:

```txt
src/modules/new-agreements/menu.ts
```

Then follow imports/routes/components used by that module.

Goal: understand how to add a new module/page without changing global architecture.

---

### Step 2 — Add menu entry for filiere page

Add a new menu item following the same pattern as `new-agreements-menu`.

Suggested label:

```txt
Gestione filiere
```

or

```txt
Nuova sezione filiere
```

Keep naming consistent with existing translations.

---

### Step 3 — Add route for filiere list page

Create only the minimum route needed for the list page.

Example route idea:

```txt
/filiere
```

or follow existing module route naming convention.

---

### Step 4 — Create filiere list page

Build a page similar to the screenshot/table style.

Required table columns:

```txt
ID
Codice
Descrizione
Coltura
Varietà
Data Inizio
Data Fine
CUAA Capo Filiera
Capo Filiera
N. Contratti attivi
```

---

### Step 5 — Add mock data service

Since backend APIs are not ready, create a minimal mock function.

Example responsibility:

```ts
getFiliereMock()
```

Return a list of fake filiere.

Do not over-engineer it.

---

### Step 6 — Add search/filter panel

Use the same search button/panel style shown in the screenshots.

Minimum useful filters:

```txt
ID
Codice
Coltura
Capo Filiera
```

Add more only if easy and consistent.

---

### Step 7 — Add row selection/actions

When user selects a row, provide actions:

```txt
Edit
Delete
View contracts
```

For now, these can navigate or be placeholders if backend/details are not ready.

---

### Step 8 — Add create/edit form

Create form with:

```txt
Codice filiera
Descrizione
Coltura
Varietà
Data inizio
Data fine
CUAA Capo Filiera
Capo Filiera
```

Buttons:

```txt
Annulla
Salva filiera
Salva e inserisci contratti
```

---

### Step 9 — Apply frontend validation

Required fields:

```txt
Codice filiera
Descrizione
Coltura
Data inizio
CUAA Capo Filiera
Capo Filiera
```

Disable save until valid.

---

### Step 10 — Apply delete/edit rule

If `numeroContrattiAttivi > 0`:

```txt
Delete disabled
Coltura disabled in edit
Varietà disabled in edit
Capo filiera disabled if required
```

Show a clear message.

---

# Ticket 2 — #216643 — Gestione pagina contratti di filiera - FE

```md
# Ticket #216643 — Gestione pagina contratti di filiera - FE

## Codex Prompt

We need to implement frontend ticket **#216643 - Gestione pagina contratti di filiera - FE**.

The request is to create/manage the contracts page for a specific filiera.

Ticket description:
- "Gestione nuova pagina dei contratti per una specifica filiera"
- "lista contratti di una filiera"

Important rules:
- Do NOT start coding yet.
- First inspect existing code and explain the current structure.
- Follow existing table/list/search patterns.
- Do NOT refactor unrelated code.
- Do NOT modify existing working logic unless required.
- Keep the implementation minimal.
- Reuse existing shared/global components.
- APIs are not ready, so use mock data/service functions.

Please inspect the existing contracts page shown in screenshots:
- there is already a "Contratti" table
- menu contains "Contratti" and "Nuova sezione contratti"
- existing table has columns like ID, Codice, Tipo, Stato, Data Inizio, Data Fine, Ultimo aggiornamento
- existing search panel has filters like Tipo, ID, Stato

Analyse:
1. where this existing contracts page is implemented
2. how the menu entry is configured
3. how the table data is loaded
4. how search/filter panel works
5. how to create the new filiera-specific contracts page with the smallest safe diff
6. what can be reused

Do not write code yet.
```

## Step-by-step implementation after Codex analysis

### Step 1 — Find existing contracts page

Search for labels/routes/components related to:

```txt
Contratti
Nuova sezione contratti
```

Use the current screenshot as UI reference.

---

### Step 2 — Add or reuse route

This page should show contracts for one selected filiera.

Possible route:

```txt
/filiere/:filieraId/contracts
```

But follow the existing routing convention.

---

### Step 3 — Create contracts list page

Use existing table style.

Columns should include at least:

```txt
ID
Codice Contratto
Codice Filiera
Descrizione Filiera
Coltura
Varietà
Tipologia Attori
Attori Contraenti
Stato
Data Inizio
Data Fine
Ultimo Aggiornamento
```

If too many columns are risky, start with the currently visible table columns and extend carefully.

---

### Step 4 — Add mock service

Create a minimal mock function:

```ts
getContractsByFilieraMock(filieraId)
```

Return fake contracts connected to the selected filiera.

---

### Step 5 — Add search/filter panel

Follow the current right-side search panel.

Suggested filters:

```txt
ID
Codice
Tipo
Stato
Data Inizio
Data Fine
```

Keep behavior consistent with existing table filtering.

---

### Step 6 — Add table sorting

Use existing sortable table behavior if already available.

Do not create new sorting logic if shared component already supports it.

---

### Step 7 — Add page actions

Needed actions:

```txt
Create new contract
Edit contract
Delete contract
```

For delete, keep disabled or mocked if backend rule is unknown.

---

### Step 8 — Add navigation from filiere page

From Ticket #216641 filiere list, the action:

```txt
View contracts
```

should open this page with selected filiera id.

---

# Ticket 3 — #216645 — Pagina creazione nuovo contratto per una filiera - FE

```md
# Ticket #216645 — Pagina creazione nuovo contratto per una filiera - FE

## Codex Prompt

We need to implement frontend ticket **#216645 - Pagina creazione nuovo contratto per una filiera - FE**.

The request is to create the frontend page for creating a new contract for a filiera.

Ticket description:
- "Creazione di un nuovo contratto per una filiera"

Important rules:
- Do NOT start coding yet.
- First inspect the existing codebase.
- Follow existing project patterns.
- Do NOT refactor unrelated logic.
- Keep the implementation minimal and safe.
- Reuse existing shared/global components.
- Backend APIs are not ready, so use mock services/data.
- This should be implemented step by step.

The contract creation page should be aligned with the mockup:
- selected filiera
- filiera information box
- contract data
- contractor type
- contractor company CUAA
- associated contractors table
- buttons: Annulla, Salva contratto, Salva contratto e aggiungi contraente

Please inspect:
1. existing form pages in the same module area
2. existing select/autocomplete components
3. existing date components
4. existing validation patterns
5. existing table component used for associated items
6. existing page layout used by contracts/filiere pages
7. where the new route should be added
8. how this page should be opened from the contracts page or from "Salva e inserisci contratti"

Do not write code yet.
First return an implementation plan with the smallest safe diff.
```

## Step-by-step implementation after Codex analysis

### Step 1 — Create route/page shell

Add a route for new contract creation.

Possible route:

```txt
/filiere/:filieraId/contracts/new
```

or follow existing convention.

---

### Step 2 — Add mock data services

Minimal mock functions:

```ts
getFiliereMock()
getFilieraByIdMock(id)
getActorTypesMock()
getCompaniesMock()
saveContractMock(payload)
```

Do not overbuild.

---

### Step 3 — Build initial page layout

Page title:

```txt
Nuovo contratto
```

Breadcrumb:

```txt
Contratti > Nuovo contratto
```

---

### Step 4 — Add filiera selector

If opened from selected filiera, prefill and disable filiera select.

If opened from generic create button, allow selection.

After selection, show info box:

```txt
Coltura
Varietà
Capo filiera
```

---

### Step 5 — Add contract data section

Fields:

```txt
Codice contratto
Data inizio contratto
Data fine contratto
Descrizione contratto
```

Validation:

```txt
Codice required
Data inizio required
Data fine required
Descrizione required
```

---

### Step 6 — Add contractor type and company selection

Fields:

```txt
Tipologia azienda contraente
Azienda contraente CUAA
```

Actor types example:

```txt
Capo Filiera
Produttore
Stoccatore
Trasformatore
Distributore
Intermediario
```

For now, use mocked dropdown values.

---

### Step 7 — Add associated contractors table

Table columns:

```txt
Tipologia azienda
Azienda contraente CUAA
Ragione sociale
Azioni
```

Initial empty state:

```txt
Nessun contraente associato
Aggiungi almeno un contraente per procedere.
```

---

### Step 8 — Add “Nuovo contraente” action

When user selects type + company, allow adding it to the table.

Rules:

```txt
Do not allow duplicate company in same contract
Do not allow empty type
Do not allow empty company
Allow removing added contractors
```

---

### Step 9 — Add save buttons

Buttons:

```txt
Annulla
Salva contratto
Salva contratto e aggiungi contraente
```

Disable save if:

```txt
contract form invalid
no contractor added
```

---

### Step 10 — Prepare for future plot-selection ticket

Do not implement ticket #216647 now.

But structure the payload so producer contractors can later be connected to selected appezzamenti.

For now only leave a clear TODO/comment if needed:

```ts
// TODO #216647: connect producer contractor to appezzamenti selection page
```

