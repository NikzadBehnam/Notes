# Codex Investigation Prompt — Ticket #228502

## Context

I am assigned as the Frontend developer for:

**#228502 — DEMETRA CATASTO BATCH - MODIFICHE FRONTEND**

This ticket belongs to the broader **#215071 — Catasto vs Appezzamenti Vettoriale (WFS)** work and evolves the existing **Import Catasto** functionality.

I will attach to this prompt:
- the PDF of ticket **#228502**;
- the PDF of parent ticket **#215071**;
- **Analisi_CatastoVsAppezzamenti_v1.0.pdf**;
- the screenshots attached to #228502, which illustrate the expected UI and behavior.

Read and cross-check all attached material carefully before drawing conclusions.

At the end of this prompt I will also provide a section named **MANDATORY WORKING RULES**. Those rules are mandatory and must govern the entire investigation, architectural reasoning, solution proposal, and later implementation steps.

---

## Ticket understanding to verify

Do not simply assume the summary below is correct. Validate it against the attachments and the existing codebase.

The expected FE evolution appears to be:

1. Extend the existing **Import Catasto** page/functionality.
2. The current implementation already supports the **Comune** level.
3. Add selectors for:
   - **Regione**
   - **Provincia**
   - existing **Comune**
4. Manage them hierarchically:
   - selecting a **Regione** populates its **Province**;
   - selecting a **Provincia** populates its **Comuni**.
5. Each level must have its own **Avvia import** action:
   - Regione import;
   - Provincia import;
   - Comune import.
6. Backend data is expected to expose, according to #228502, information conceptually identified as:
   - `NOME_ENTITA'`
   - `ID_LOAD`
   - `FLAG_PROGRESSO`
7. When an entity has an `ID_LOAD` and its progress is **in coda** or **in importazione**:
   - the entity must be shown with gray text in the selector;
   - it must remain selectable if that is what the ticket/current component behavior requires;
   - after selection, show the corresponding status message;
   - disable the import button for that selected level.
8. When the latest processing status is **terminato con successo** or **terminato con errore**:
   - render the entity normally;
   - allow another import;
   - show the processing summary, following/reusing the behavior that already exists for Comune.
9. The existing summary is expected to include information such as total, processed, and error entities. Verify the actual implementation and terminology in the repository rather than inventing fields.

The screenshots should be treated as functional evidence and compared with the actual existing UI.

---

# Primary objective

Perform a **deep technical investigation and implementation planning exercise only**.

## DO NOT WRITE OR MODIFY CODE.

Do not apply the feature, create files, edit files, refactor code, install packages, or make implementation changes.

Your output must give me enough verified information to implement the feature manually and incrementally afterward.

---

# 1. Study the ticket and attachments first

Read all provided ticket PDFs, analysis material, and screenshots.

Build a precise understanding of:

- the business requirement;
- what belongs specifically to FE ticket #228502;
- what functionality already existed before #228502;
- what is new;
- expected selector behavior;
- expected cascading behavior;
- expected import-button behavior;
- expected queued/importing/completed/error behavior;
- expected statistics/summary behavior;
- dependencies on backend APIs;
- anything that is ambiguous or not specified.

Clearly distinguish:

- **explicit ticket requirement**;
- **behavior confirmed by existing code**;
- **reasonable implementation inference**;
- **unknown / requires BE confirmation**.

Do not silently turn an assumption into a requirement.

---

# 2. Investigate the existing Import Catasto implementation

Search the relevant codebase deeply and identify the current implementation of **Import Catasto**, especially the work previously introduced for the Comune-level functionality.

Trace the feature end-to-end from the Portal integration down to the module/component/service responsible for the actual page.

Identify, with exact paths and relevant symbols where possible:

- route;
- menu configuration;
- permissions;
- page/container component;
- child/UI components;
- selector components;
- state/data models;
- TypeScript interfaces/types;
- services/API clients;
- endpoints;
- request/response mappings;
- Comune loading logic;
- administrative-tree usage;
- import-start logic;
- validation;
- loading states;
- status/progress handling;
- polling/live-refresh behavior, if any;
- processing summary/statistics;
- translations/i18n keys;
- error handling;
- notifications;
- tests, if present.

Do not assume Region and Province should be implemented in a particular way until you understand how Comune currently works.

Also investigate the history/current structure related to the earlier Import Catasto FE implementation where useful, but do not change Git state or perform destructive Git operations.

---

# 3. Search `C:\ABC\portal` for reusable geographic APIs

A specific part of this investigation is to inspect:

`C:\ABC\portal`

Search the Portal repository and installed/internal modules for existing APIs, services, composables/helpers, types, or components that already retrieve or manage:

- Regions / `Regioni`;
- Provinces / `Province`;
- Municipalities / `Comuni`;
- administrative tree data;
- cadastral administrative data.

We are currently waiting for Jerry to provide the **correct and updated APIs** intended for #228502.

Until that information arrives, investigate whether the existing Portal ecosystem already contains suitable Region/Province/Comune APIs that could be used to begin the implementation and later be reconfigured/adapted to the updated APIs.

### Important

Do **not** choose an API just because its name appears suitable.

For every candidate API, report:

- exact source file;
- module/package that owns it;
- endpoint;
- HTTP method;
- parameters;
- response shape/types;
- where it is currently used;
- whether it provides the identifiers needed by Import Catasto;
- whether it provides Region → Province → Comune relationships;
- whether it contains import-specific fields such as `ID_LOAD` / `FLAG_PROGRESSO`;
- whether using it temporarily would create coupling or rework;
- how easily it could later be replaced by Jerry's updated API.

If existing APIs provide only geographic hierarchy but **not import status**, state this explicitly.

Prefer existing project conventions and reusable abstractions over introducing duplicate API logic.

---

# 4. Investigate related Catasto APIs

Search the codebase for all existing Catasto/import endpoints and determine what is already available.

In particular, establish how the current Comune implementation:

1. obtains/selects a Comune;
2. builds the administrative identifiers required for import;
3. starts the import;
4. receives an import/load/request ID;
5. determines progress/status;
6. obtains processing statistics;
7. renders completed/error results.

Search for relevant concepts and variations such as:

- `import-catasto`
- `catasto`
- `cadastral`
- `administrative_tree`
- `cadastral_dataset`
- `province_code`
- `council_code`
- `req_id`
- `id_load`
- `flag_progresso`
- import progress/status/statistics

Do not rely only on these exact strings; follow references and actual data flow.

---

# 5. Determine the likely data model

Based on the ticket, APIs actually found, and existing implementation, explain what FE data/state will probably be needed for each territorial level.

For example, investigate whether the architecture needs concepts equivalent to:

- available regions;
- selected region;
- available provinces;
- selected province;
- available municipalities;
- selected municipality;
- per-entity import state;
- selected entity's current/previous load;
- statistics;
- loading/error state.

Do not invent final interfaces yet.

Instead, show:

- what can be reused;
- what likely needs extension;
- what depends on the new BE contract.

Pay particular attention to whether status should be stored globally, per territorial level, or per returned entity.

---

# 6. Analyze cascading state carefully

Explain how the FE should safely manage:

`Regione → Provincia → Comune`

Investigate the current component patterns and determine what should happen when:

- Region changes;
- Region is cleared;
- Province changes;
- Province is cleared;
- a child request is still pending while the parent changes;
- the selected Province/Comune becomes invalid;
- a busy entity is selected;
- an import is started;
- import state changes after a refresh/poll.

Identify possible stale-state or race-condition risks.

The proposed solution must follow existing project conventions and the **MANDATORY WORKING RULES**.

---

# 7. Analyze the status rules

Create a state/behavior matrix based on the ticket and verified implementation.

At minimum investigate:

- no previous/current import;
- in queue;
- importing/in progress;
- completed successfully;
- completed with error;
- unknown/unexpected backend status.

For each state describe the expected:

- selector text style;
- option selectability;
- import-button state;
- status message;
- statistics visibility;
- possibility of starting another import.

Use the **actual backend enum/value names** if they can be found.

If they cannot be verified, keep the ticket terminology and mark the exact API values as **TBD / BE confirmation required**.

Do not invent enum values.

---

# 8. Compare screenshots with current UI

Use the supplied screenshots as evidence.

Check how closely the existing Import Catasto component already matches them.

Explain what needs to change to reach the illustrated target UI, including:

- Region row;
- Province row;
- Comune row;
- independent import buttons;
- gray busy options;
- disabled button state;
- status label/message;
- summary area.

Do not introduce a redesign that is not requested.

Follow the existing design system/components and established UI conventions.

---

# 9. Identify impacted files/modules

After the investigation, provide a concrete impact map.

For each likely affected file/module provide:

- exact path;
- responsibility today;
- why #228502 affects it;
- expected type of change;
- whether the change is certain or conditional on the new APIs.

Separate:

### Definitely involved
Files directly confirmed by current data flow.

### Probably involved
Files likely to change based on architecture.

### API-dependent
Files/areas whose changes depend on Jerry's updated contract.

### Not expected to change
Relevant nearby modules that were investigated but should remain untouched.

---

# 10. Reuse vs refactor assessment

The ticket explicitly evolves functionality that already exists for Comune.

Determine whether the standard solution should:

- extend the existing implementation directly;
- extract/generalize reusable behavior for Region/Province/Comune;
- introduce a small reusable component/model;
- or retain separate logic because abstraction would add unnecessary complexity.

Do not refactor merely for cleanliness.

Any suggested refactoring must have a concrete benefit for #228502 and comply with the **MANDATORY WORKING RULES**.

---

# 11. Temporary API strategy while waiting for Jerry

We may want to begin development using APIs already available under `C:\ABC\portal`, then replace/reconfigure them when Jerry provides the official updated APIs.

Evaluate this strategy technically.

Provide:

### Option A — existing APIs are sufficiently compatible
Explain how to isolate them behind the existing service/API layer so the future switch has minimal impact.

### Option B — existing APIs provide hierarchy only
Explain how Region/Province/Comune selection could be developed/tested while keeping import-status integration clearly separated and pending.

### Option C — existing APIs are incompatible
Recommend that we do not create a temporary integration if it would result in significant throwaway code or incorrect assumptions.

Choose among these only after inspecting the repository.

The implementation plan should make the API boundary easy to update later.

---

# 12. Produce a step-by-step implementation plan

After completing the analysis, propose a sequence of **small, logical, testable implementation steps**.

We will implement these steps manually **one at a time** in later Codex prompts.

Each step must:

1. have one clear objective;
2. touch the smallest reasonable scope;
3. describe exactly what should change;
4. identify expected files/functions;
5. define how to test it;
6. define the expected observable result;
7. identify information that should be collected before proceeding;
8. avoid depending on an unverified assumption where possible.

Do not combine the whole ticket into one large implementation step.

A good sequence may resemble the following, but you must adjust it based on the actual repository investigation:

**Step 1 — Establish/verify API and model foundations**

**Step 2 — Add Region data/selection without changing import behavior**

**Step 3 — Add Province cascading behavior**

**Step 4 — Integrate/verify Comune cascading behavior**

**Step 5 — Add/extend independent import actions**

**Step 6 — Integrate entity import-state rendering**

**Step 7 — Handle active-import messages and button disabling**

**Step 8 — Extend completed/error statistics behavior**

**Step 9 — Integrate official updated APIs when available**

**Step 10 — Regression and edge-case verification**

This is only an example. The final plan must come from the codebase.

---

# 13. Testing strategy for incremental development

For every implementation step, tell me exactly how I can verify it before moving to the next one.

Use appropriate techniques such as:

- browser behavior;
- Network tab;
- endpoint response inspection;
- temporary console diagnostics where genuinely useful;
- Vue/component state inspection;
- existing automated tests;
- type checking;
- lint/build checks.

If an API response is required before the next architectural decision can be made, explicitly stop at that step and tell me:

1. which request to execute;
2. which response fields to inspect;
3. what result to send back to Codex;
4. how each possible result affects the next step.

This development must be evidence-driven rather than implementing all assumptions at once.

---

# 14. Regression scope

Identify existing behavior that must not be broken, especially:

- existing Comune import;
- current progress handling;
- current summary/statistics;
- permission behavior;
- existing navigation/menu;
- existing administrative data selection;
- translations;
- loading/error feedback.

Also identify any Region/Province changes that could unintentionally alter other modules using the same shared administrative APIs/components.

---

# 15. Required final report format

Return the investigation using this structure:

## A. Executive Summary

## B. Verified Requirements from #228502

## C. Existing Import Catasto Architecture

## D. Current Comune Flow — End-to-End

## E. Region/Province/Comune APIs Found in `C:\ABC\portal`

Include a table:

| Candidate | Endpoint | Current Usage | Data Provided | Import Status Available? | Reusability | Notes |
|---|---|---|---|---|---|---|

## F. Catasto Import/Progress APIs Found

## G. Ticket vs Existing Implementation — Gap Analysis

## H. Proposed FE Architecture

## I. State and UI Behavior Matrix

## J. Impacted Files and Symbols

## K. Unknowns / Questions for Jerry or BE

## L. Temporary API Strategy

## M. Step-by-Step Implementation Plan

For every step include:

- Objective
- Files/functions
- Change
- Test procedure
- Expected result
- Information to capture
- Preconditions for next step

## N. Regression/Test Checklist

## O. Risks and Edge Cases

## P. Recommended First Implementation Step

---

# Critical constraints

- **Do not start coding.**
- **Do not modify any file.**
- **Do not create implementation code.**
- **Do not perform refactoring.**
- **Do not install/update dependencies.**
- **Do not make destructive Git changes.**
- Investigate first.
- Cite exact repository paths and symbols whenever possible.
- Prefer evidence from the actual repository over assumptions.
- Treat the ticket PDFs, analysis document, and screenshots as authoritative requirements.
- Clearly mark contradictions or missing information.
- Do not invent backend behavior.
- Do not invent API payloads, endpoint paths, response fields, or enum values.
- Reuse established project patterns whenever feasible.
- Keep the future replacement/configuration of temporary APIs in mind.
- The implementation must later proceed **one tested step at a time**.
- After this analysis, **stop and wait for my instruction before implementing Step 1**.

---

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

# ---- 3 ----

I need you to make a very clear and standard codex prompt to describe the issue clearly to the codex.
what I need from codex is : - it should identify the issue, and report it clearly to me - it should suggest a proper and standard solution for the issue considering the MANDATORY WORKING RULES that I will add at end of prompt - if it needs more data and informations should ask me to provide, else it should implement the suggested solution - I will attach the PDF versions of the ticket (and screenshots if any) with prompt to the codex - and the end of the implementation I need a clear segment by segment report about the issues and the suggested solution implemented

# ---- 4 ----

generate a .md file containing a codex prompt.
this codex prompt should explain the ticket description, the issue and the expected solution clearly, fully, technically and deeply.

codex should not start coding and implementaions

the fix would be step by step, so after complete analyse codex should provide some steps to fix and implementaion, I will past steps one by one to codex to impelement.

every steps should be logical and testable steps, so after being sure on one step implementaion we can go for next step.

we can use the steps to provide information to another step, for example we can trigger an endpoint, check the response and in decide our next move base on that result, or we can add a console log and base on the resuld we will decide our next move

I have a list of rules name MANDATORY WORKING RULES, the entire analyze, investigation, solution suggestion and implementations should be considered with this rules, that I will provide that list at the end of the prompt.

I will attach the PDF ticket and the screenshot with prompt to the codex

# ---- 5 ----

isColdiretti
src\modules\farm-registry\components\tiles\registry\FarmRegistryHome.vue

what I did, in this tecket is made some UI refactoring by adding the conventional components and UI implementations in same branch, but still I can see some error on API calls.