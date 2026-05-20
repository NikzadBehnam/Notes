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