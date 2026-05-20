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

in this step we were supposed to implement the mock data
but as we now have the real API, lets render the returned data from API in the table
lets breakdown this step in two steps, part1 first rund the AP, part2-I will share the response then you can create the modal data and render in the table

so lets go for the second part of the step 5 
API:
/sitiagri-rest-api/api_sso/v1/filiere?count=50&offset=0&filter=pk_cuaa%20eq%20418466&

Response: 

---

### Step 6 — Add search/filter panel

Use the same search button/panel style shown in the screenshots of step 4 (check if filters are API side).

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

  lets make this step into two parts
  1- the UI
  2- the APIs implementations

  for the UI as you aleardy know, consider our conventional UI foramt and structure (have a look at screenshots on step 4)
  for the APIS implementation also you already know the conventional structure of our workflow working with APIs

  you can find out the propper API related to eny action in the file attached (APIs.json)

    So lets first finisha and finalize the 1st part of step 7

    No we can continue with part 2nd of step7 (find out the APIS in APIs.json )
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

  for your more infomation the mockup is attached, get only the segments from UI(headers and details)
  but use the conventional format for form style
        - FS001 mockup (filiere dashboard)
        - FS002 mockup (create/edit filiera form)
        
  check the assets-module of the conventional abc-form

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
