# Catasto Massivo / Import Catasto — Frontend Technical Analysis

## Objective

I need you to perform a **deep technical analysis of the current repository and all relevant installed/interdependent modules** in order to determine exactly **where this new frontend feature belongs and which modules/files are involved**.

**Do not implement or modify any code yet.**

This is an **analysis and implementation-planning phase only**.

I will review your findings, involved modules/files, and proposed implementation approach before we start coding.

---

# Important Project Context

This application is divided into multiple frontend/modules/packages.

Some modules are installed as dependencies inside other modules and functionality is often distributed across them.

Therefore, the **most important part of this analysis is NOT to assume that the current repository is the correct place for the whole implementation**.

You must inspect:

* the current module/repository;
* its installed ABACO/internal modules;
* relevant package dependencies;
* route ownership;
* menu/navigation integration;
* shared components;
* API/service layers;
* existing Back Office features;
* existing municipality-selection logic;
* authentication/competency handling;
* polling implementations;
* any other dependent module involved in this workflow.

The goal is to determine **exactly which module owns each responsibility** before proposing changes.

---

# Additional Update from Simone

Simone has informed me that he has already created the new menu entry in **Coldiretti DEV**.

The menu entry is currently named:

```text
import-catasto
```

Consider this an important piece of information during the analysis.

Do **not** automatically create another menu entry in code.

Instead, investigate what the existing Coldiretti DEV menu configuration means technically.

Determine whether:

* the menu entry is externally/configuration-driven;
* it already points to a route expected from one of our frontend modules;
* the current repository must only provide the corresponding route/page;
* additional local route registration is required;
* some installed module owns the navigation/router configuration;
* or any other integration is necessary.

Clearly explain your conclusion.

---

# Functional Requirement

I will attach the latest analysis/specification note for this ticket.

Treat that document as the primary functional reference.

The frontend functionality currently required is approximately:

```text
BACK OFFICE
    ↓
import-catasto
    ↓
Open dedicated page
    ↓
Search/select Comune
    ↓
Start cadastral bulk import
    ↓
Receive importId
    ↓
Poll import progress
    ↓
Display import progress/results
```

The final `requestId` / WFS/intersection-processing phase is **NOT currently part of the implementation scope** because Simone is still defining that part.

Do not design or implement speculative `requestId` behaviour.

---

# Current Frontend Scope

Based on the attached analysis note, the current frontend needs to support the following.

## 1. Page integration

A dedicated Back Office page for the cadastral bulk-import feature.

No additional filters are required in the standard yellow toolbar.

Determine:

* which module should contain this page;
* how comparable Back Office pages are registered;
* which router/module owns the route;
* how the externally created `import-catasto` menu entry should resolve to this page.

---

## 2. Competency / authorization

The feature is associated with the competency/module:

```text
CATASTO_BATCH
```

Investigate the existing competency/authorization conventions.

Determine whether frontend changes are actually required for this competency or whether menu visibility is already fully handled externally.

Reference existing similar Back Office features and their exact implementation patterns.

---

## 3. Comune selection

We must reuse the same searchable Comune-selection behaviour already used when inserting/creating an **appezzamento**.

Do not propose a new custom selector unless the architecture absolutely requires it.

Find the exact existing implementation:

* module;
* component;
* service/API layer;
* model/type;
* autocomplete component;
* relevant functions/computed properties/watchers;
* any shared `abc-*` components involved.

The Comune API request for this feature must include:

```text
administrative_tree=true
```

because this makes the API return the additional fields:

```text
cadastral_dataset
province_code
```

Together with:

```text
council_code
```

these values are required to start the import.

Determine the cleanest standard way to reuse or extend the existing Comune-selection implementation without duplicating logic.

---

## 4. Start bulk cadastral import

After selecting a Comune, the frontend calls:

```http
PUT /api/v1/aggiornacatasto/regione/{regione}/provincia/{provincia}/comune/{comune}
```

The mapping must be:

```text
{regione}   -> selectedComune.cadastral_dataset
{provincia} -> selectedComune.province_code
{comune}    -> selectedComune.council_code
```

Example:

```text
cadastral_dataset = VENETO
province_code      = PD
council_code       = A001
```

becomes:

```http
PUT /api/v1/aggiornacatasto/regione/VENETO/provincia/PD/comune/A001
```

Expected success response:

```json
{
  "importId": 15
}
```

Investigate where this API call should live according to the current application architecture.

Do not simply add HTTP calls directly inside the page if existing project conventions use:

* API clients;
* repositories;
* services;
* composables;
* stores;
* shared HTTP wrappers;
* module-specific API classes;
* or another established pattern.

Find and reference the correct existing convention.

---

## 5. Import progress polling

After receiving the `importId`, the frontend must periodically call:

```http
GET /api/v1/aggiornacatasto/progress/import/{importId}
```

Example response:

```json
{
  "importId": 15,
  "reqId": 5,
  "codComune": "L087",
  "fogliTotali": 10,
  "fogliElaborati": 10,
  "fogliScartati": 0,
  "particelleTotali": 2487,
  "particelleElaborate": 2487,
  "particelleScartate": 0,
  "errorLog": null
}
```

The polling interval is still to be decided.

Search the codebase and installed modules for existing polling implementations.

Pay particular attention to established conventions for:

* timers;
* API polling;
* stopping polling;
* component cleanup/unmount/destroy;
* navigation away from the page;
* request errors;
* retry behaviour;
* avoiding duplicate timers;
* avoiding concurrent duplicate polling requests.

Recommend the implementation that best follows existing project conventions.

---

## 6. Progress presentation

The frontend must display the useful progress information returned by the API.

At minimum, consider:

```text
fogliTotali
fogliElaborati
fogliScartati

particelleTotali
particelleElaborate
particelleScartate

errorLog
```

The specification intentionally leaves the presentation approach to the frontend.

Before suggesting a new UI, inspect the project for existing conventional/shared UI components.

In particular, investigate whether we already have appropriate:

```text
abc-*
```

components for things such as:

* cards;
* progress indicators;
* alerts;
* loading states;
* error messages;
* buttons;
* autocomplete;
* information rows;
* status indicators;
* empty states;
* notifications.

Prefer existing standard components and visual patterns over introducing custom implementations.

If progress bars are appropriate, explain whether the existing API provides enough information to calculate them safely.

Do **not** invent an unsupported single overall progress percentage if no business rule exists for combining cadastral sheets and parcels.

---

# Backend Validation Behaviour

The PUT API will eventually perform backend checks such as:

* preventing another import for the same Comune while one is already running;
* limiting the maximum number of simultaneous imports.

These validations belong to the backend.

For the frontend, analyze only:

* how API errors are conventionally handled;
* where they should be surfaced;
* whether the API's returned error message can be displayed directly;
* whether an existing notification/error component should be used.

Do not move backend validation logic into the frontend.

---

# Explicitly Out of Scope for Now

The following part must **NOT be implemented or fully designed yet**:

```text
reqId
    ↓
intersection calculation
    ↓
WFS polling
    ↓
intersection result
```

The progress API currently returns `reqId`, but Simone has explicitly said that he still needs to define how that final phase should work.

Therefore:

* acknowledge `reqId` in the response model if technically necessary;
* do not invent an endpoint;
* do not invent polling behaviour;
* do not implement intersection processing;
* do not create speculative UI for it.

Leave this part for a later phase.

---

# MOST IMPORTANT ANALYSIS — MODULE OWNERSHIP

Because this project is split across installed modules, I need a very thorough module-level analysis.

Do not assume the current module owns everything.

Trace the feature across the actual dependency architecture.

For every major responsibility, determine the owner:

| Responsibility                               | Module / package to determine |
| -------------------------------------------- | ----------------------------- |
| `import-catasto` menu/navigation integration | ?                             |
| Route registration                           | ?                             |
| Back Office page                             | ?                             |
| Competency handling                          | ?                             |
| Comune autocomplete                          | ?                             |
| Comune API service                           | ?                             |
| Shared `abc-*` UI components                 | ?                             |
| HTTP client/API layer                        | ?                             |
| Bulk import API                              | ?                             |
| Progress polling                             | ?                             |
| Notifications/errors                         | ?                             |

Inspect relevant:

```text
package.json
lock files
workspace configuration
module aliases
internal package imports
installed ABACO dependencies
router definitions
menu/navigation integrations
shared libraries
API/service folders
```

If an installed dependency contains the actual implementation source relevant to this feature, inspect it as well.

I specifically want to avoid implementing something in the current module that properly belongs to another ABACO module.

---

# Existing Conventions Are Mandatory

This project already contains established architecture and reusable components.

Before proposing any new abstraction, identify whether an existing solution already exists.

Search specifically for similar implementations involving:

* Back Office pages;
* external/configuration-driven menu entries;
* competency-controlled pages;
* Comune autocomplete;
* `dictionary_councils`;
* `administrative_tree`;
* `abc-*` components;
* async actions;
* long-running operations;
* polling;
* progress displays;
* API error handling;
* page lifecycle cleanup.

Reuse established conventions whenever possible.

Do not suggest introducing a new generic component, helper, service, composable, store, or abstraction unless there is a concrete architectural reason and no suitable existing solution.

---

# MANDATORY: No Code Changes

At this stage:

**DO NOT implement anything.**

Do not:

* create files;
* edit files;
* delete files;
* refactor code;
* change configuration;
* install/update dependencies;
* change package versions;
* automatically format files;
* create routes;
* create components;
* add services;
* create tests.

Only inspect and analyze.

---

# Expected Output

Provide the analysis in the following structure.

## 1. Executive Technical Summary

Explain:

* how this feature fits into the current architecture;
* which module should own the page;
* which other modules are involved;
* whether Simone's existing `import-catasto` menu entry requires any additional frontend menu configuration.

---

## 2. Module Dependency / Ownership Map

Provide a clear map such as:

```text
Module A
  └─ responsibility...

Module B
  └─ responsibility...

Shared Module C
  └─ reusable components...

Current repository
  └─ exact responsibility...
```

Explain why each responsibility belongs there.

---

## 3. Existing Implementations to Reuse

List the relevant existing implementations you found.

For each one provide:

```text
Module/package
File path
Component/class/function
What it currently does
Why it is relevant
How it should be reused
```

Pay special attention to the existing appezzamento Comune selector.

---

## 4. Exact Files Potentially Involved

Separate them by module.

Example:

```text
Current module
- path/to/file.vue
  - reason

Installed module X
- path/to/service.ts
  - reason

Shared module Y
- path/to/component.vue
  - reason
```

Clearly distinguish between:

* files that definitely require modification;
* files that probably require modification;
* files that only need to be referenced/reused;
* files inspected but which should remain unchanged.

---

## 5. Proposed Frontend Architecture

Describe the recommended technical flow.

For example:

```text
External menu `import-catasto`
        ↓
route
        ↓
Catasto Massivo page
        ↓
existing Comune autocomplete
        ↓
dictionary_councils
+ administrative_tree=true
        ↓
selected Comune
        ↓
PUT import API
        ↓
importId
        ↓
poll progress API
        ↓
update conventional progress UI
```

Explain the exact responsibilities at each level.

---

## 6. Page State / Lifecycle

Describe the recommended states, for example:

```text
initial
↓
Comune selected
↓
starting import
↓
import running
↓
progress updates
↓
completed / error
```

Explain:

* button state;
* loading state;
* polling start;
* polling stop;
* error handling;
* component destruction/navigation cleanup.

Do not write implementation code.

---

## 7. API Integration Plan

For each API involved, specify:

* method;
* URL;
* parameters;
* response model;
* existing service/client that should handle it;
* any types/models that may need to be extended.

Explicitly verify the mapping:

```text
cadastral_dataset -> regione
province_code      -> provincia
council_code       -> comune
```

---

## 8. UI / Reusable Component Recommendation

Identify exactly which existing `abc-*` or project-standard components should be reused.

Recommend the simplest conventional UI for:

* Comune selection;
* start action;
* loading;
* fogli progress;
* particelle progress;
* discarded counts;
* `errorLog`;
* success/error status.

Do not redesign established project patterns unnecessarily.

---

## 9. Risks / Open Questions

List only genuine unresolved items.

For example:

* polling interval still undefined;
* final menu display label may still need confirmation;
* exact error response contract may need confirmation;
* `reqId` workflow intentionally postponed.

Clearly distinguish blockers from non-blocking open decisions.

---

## 10. Recommended Implementation Sequence

Give me an ordered implementation plan, but **do not execute it**.

For example:

```text
Step 1 — ...
Step 2 — ...
Step 3 — ...
```

The sequence must respect module ownership and minimize unnecessary changes.

---

# Important Analysis Standard

Do not give me generic Vue/frontend advice.

I need conclusions grounded in the **actual repository and installed module architecture**.

Every important conclusion should reference concrete:

* modules;
* package names;
* file paths;
* components;
* functions;
* routes;
* API services;
* existing patterns.

If something cannot be confirmed from the codebase, explicitly mark it as:

```text
Not confirmed
```

rather than guessing.

---

# Attached Material

I will attach:

1. the latest Catasto Massivo analysis/specification note;
2. the relevant Simone communication/context if needed.

Use the latest analysis note as the functional source of truth and reconcile it with the actual codebase.

---

# MANDATORY WORKING RULES

The following rules are mandatory and must govern **all analysis and all implementation recommendations**.

I will append the complete **MANDATORY WORKING RULES** below this section.


# MANDATORY WORKING RULES

- Do NOT make extra changes.
- Do NOT do unrelated refactors.
- Do NOT rename, move, or restructure files unless strictly necessary.
- Do NOT introduce new abstractions unless clearly needed for this exact ticket.
- Do NOT modify existing working logic unless required by this ticket.
- Keep the implementation very minimal.
- Keep the implementation descriptive and maintainable.
- Keep the implementation fully aligned with the existing logic and patterns already used in this module.
- Reuse existing company global/shared components and existing project conventions.
- Avoid speculative improvements.
- Avoid cleanup changes unrelated to this ticket.
- This codebase is huge, so safe integration is more important than clever refactoring.
- If you touch a file, only change what is needed for this ticket.
- Before coding, first inspect the existing logic and follow the same implementation style already used in nearby files.
- If multiple implementation options are possible, choose the one with:
- the smallest safe diff
- the best consistency with existing code
- the lowest risk in a large legacy codebase
- Because the project is very heavy, Codex must not run any npm/pnpm/yarn/build/lint/test commands. It can only suggest the validation commands for the developer to run manually later.

# REQUST FOR PROPMP
# ---- 1 ----
so from what you got give me a clear, understandable and accurate prompt to codex to:
- analyse the code briefly and accuratly
- to not start code yet
- on its analyse and solution suggestion, it should consider some points I am attaching with prompt (MANDATORY WORKING RULES)
- to give me a clear and technical detail about the issue, and the solution(Mentioning the files and functions Involved)
- I am adding also the screenshots I have already attached here, for more clear detail

# ---- 2 ----
to make a prompt for codex to:
 - find out and confirm the issue technically, refrencing the involved files and functions 
 - then considering the MANDATORY WORKING RULES that I will provide with prompt to codex, suggest a standard proper fix guied
 - do not start code yet
 - I will attach the screenshots mentioned in the ticket and also the PDF version of the ticket also to codex attached with prompt
 - the prompt should be in MD (markdown) format
 - mention that current branch is clean and made from master, so we may not have some changes we did on previews tickets/threads