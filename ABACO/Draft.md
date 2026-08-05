# Technical Analysis Request — Ticket #222058

## Related tickets

* **FE ticket to implement:** `#222058 - Sviluppo FE - Blocco modifica/cancellazione ruolo lavoratore se adoperato in attività #45`
* **Parent/backend ticket:** `#221331 - Blocco modifica/cancellazione ruolo lavoratore se adoperato in attività #45`

I will attach the PDF versions of both tickets to this prompt.

The parent ticket contains the business requirements, backend analysis, validation rules, and validation endpoints. Ticket `#222058` is the front-end subtask that must integrate those backend validations into the relevant existing FE flows.

---

# Current phase: analysis only

We are currently in the **technical analysis and solution-design phase**.

## Strict restrictions

You must not:

* write implementation code;
* edit, create, delete, rename, or format any file;
* apply patches;
* update dependencies;
* modify lockfiles;
* create commits;
* start the implementation;
* refactor unrelated code;
* make speculative changes.

Keep the repository completely unchanged.

You may inspect the repository, search files, trace imports, inspect dependency implementations, and run only safe read-only commands.

Before finishing, verify that the Git working tree is still unchanged.

---

# MANDATORY WORKING RULES

The following rules are mandatory and must govern both your analysis and your suggested implementation.

Do not treat them as optional recommendations.

```text
[PASTE THE MANDATORY WORKING RULES HERE]
```

Your final solution proposal must explicitly explain how it complies with these rules.

If any possible solution conflicts with one of the mandatory rules, reject that approach and propose a compliant alternative.

---

# Business problem

A worker may have one or more roles, and each role has a validity period.

Activities may reference a worker on a specific planned or execution date.

The system must prevent operations that would leave an activity associated with a worker who does not have any valid role on that activity date.

The relevant operations are:

1. Modifying the date of a planned activity.
2. Modifying the date of an executed activity.
3. Modifying the validity dates of a worker role.
4. Deleting a worker role.

The frontend must not reproduce the backend validity calculation locally.

Instead, before executing the real update or deletion, the frontend must call the relevant backend validation endpoint.

---

# Backend validation contract

According to the parent ticket, the backend validation APIs follow this rule:

* An empty array means that the requested operation is valid and the frontend may continue.
* A non-empty array contains blocking anomalies, so the frontend must stop the operation.
* If the validation request fails technically, the frontend must not bypass validation and continue with the actual update or deletion.

In simplified form:

```text
Validation response: []
→ Continue with the existing update/delete request.

Validation response: [one or more anomalies]
→ Block the operation and show the appropriate error or anomaly information.

Validation request fails
→ Block the operation and use the standard API error-handling flow.
```

---

# Backend endpoints described in ticket #221331

## 1. Validate modification of an executed activity

```http
PUT /api/v1/plots/subjects/{subjectId}/{campaign}/actions/{executionId}/validate
```

The request body must be equivalent to the body used by the existing executed-activity update request.

The related real update endpoint described in the ticket is:

```http
POST /sitiagri-rest-api/api_sso/v1/plots/subjects/{subjectId}/{campaign}/actions/{executionId}
```

You must verify the actual endpoint, HTTP method, API wrapper, and payload currently used by this repository rather than assuming that the ticket examples exactly match the current FE implementation.

---

## 2. Validate modification of a planned activity

```http
PUT /api/v1/plots/subjects/{subjectId}/{campaign}/activities/{activityId}/validate
```

The request body must be equivalent to the body used by the existing planned-activity update request.

The related real update endpoint described in the ticket is:

```http
POST /sitiagri-rest-api/api_sso/v1/plots/subjects/{subjectId}/{campaign}/activities/{actionId}
```

Verify the real parameter naming, current HTTP method, payload structure, and existing service implementation.

---

## 3. Validate modification of worker-role validity dates

```http
PUT /api/v1/plots/subjects/{companySubjectId}/workers/{workerSubjectId}/role/{roleId}/validate
```

Example body from the ticket:

```json
{
  "start_date": 1772146802000,
  "end_date": 1784325599000
}
```

Verify:

* the real route prefix;
* how the company subject ID is obtained;
* how the worker subject ID is obtained;
* whether `roleId` corresponds to `pkIdRelazione`, a role ID, or another relation identifier;
* the date format used by the existing update flow;
* whether null or open-ended dates are supported;
* whether timestamps are milliseconds;
* the actual response type.

---

## 4. Validate deletion of a worker role

```http
GET /api/v1/plots/subjects/{companySubjectId}/workers/{workerSubjectId}/role/{roleId}/validate
```

This validation must happen before the real worker-role deletion request.

The parent ticket also references existing worker relation operations similar to:

```http
PUT /sitiagri-rest-api/api_sso/v1/workers/{subjectId}/involved/{pkIdRelazione}
```

```http
DELETE /sitiagri-rest-api/api_sso/v1/workers/{subjectId}/involved/{pkIdRelazione}
```

Do not assume that these are the exact endpoints currently used by the frontend. Trace and confirm the real implementation.

---

# Required repository analysis

Perform a deep analysis of the current repository.

The affected features may exist in different modules, shared libraries, or installed ABACO dependencies. Do not stop after finding the first matching component.

## 1. Planned-activity modification flow

Trace the complete current flow for editing a planned activity.

Identify:

* the route, page, tile, modal, drawer, or form where the operation starts;
* the form component;
* the save or submit handler;
* validation performed before submission;
* payload construction;
* API service or repository function;
* stores, actions, composables, mixins, decorators, or event-bus handlers involved;
* loading-state handling;
* success handling;
* API error handling;
* modal-closing behavior;
* data refresh after a successful update;
* whether the activity date change is detectable before saving;
* whether workers are present directly in the payload or resolved elsewhere.

Confirm the exact files, classes, methods, functions, and relevant line ranges.

---

## 2. Executed-activity modification flow

Trace the complete current flow for editing an executed activity.

Identify the same areas:

* UI entry point;
* form or dialog;
* submit handler;
* payload creation;
* current API call;
* API abstractions;
* state management;
* loading and error flows;
* post-update refresh;
* differences between planned and executed activities;
* any shared code between the two flows.

Determine whether planned and executed activity edits use:

* separate modules;
* shared components;
* shared standard-form definitions;
* configuration-driven forms;
* ABACO package implementations.

---

## 3. Worker-role modification flow

Trace the complete flow used to edit a worker role or its validity dates.

Identify:

* where workers and roles are displayed;
* the edit action;
* the form or modal;
* how the existing role/relation is represented;
* how `subjectId`, worker ID, relation ID, role ID, company ID, and dates are obtained;
* the submit handler;
* the current update API;
* API client or dependency responsible for the request;
* date conversion and serialization;
* success/error notifications;
* refresh behavior;
* whether multi-role workers are handled differently.

Confirm whether the frontend edits:

* the role itself;
* a worker-company relation;
* an `anag_relazioni` record;
* a role assigned through another model.

Do not infer this only from the ticket terminology. Confirm it from the code.

---

## 4. Worker-role deletion flow

Trace the complete worker-role deletion process.

Identify:

* the delete button or action menu;
* permission conditions;
* confirmation dialog;
* delete handler;
* current API call;
* ID values passed to the API;
* success/error behavior;
* list refresh;
* whether deleting a role and deleting a worker are different operations;
* whether the current UI can delete one role from a multi-role worker;
* whether deletion logic is implemented in this repository or an ABACO dependency.

The requested validation concerns deletion of a worker role. Confirm that the located frontend flow corresponds to that exact operation.

---

# Deep analysis of ABACO dependencies

The target implementation may not be fully contained in the application repository.

Inspect the relevant ABACO dependencies used by the discovered modules.

This includes, where relevant:

* `package.json`;
* lockfiles;
* workspace configuration;
* local packages;
* linked packages;
* `@abaco/*` dependencies;
* standard forms packages;
* worker registry packages;
* activities packages;
* API packages;
* shared UI or domain modules;
* TypeScript declarations;
* distributed JavaScript;
* source maps;
* exported services and types.

For each relevant dependency, determine:

1. The installed package name and version.
2. Which application file imports it.
3. Which exported component, service, type, or function is involved.
4. Whether the affected behavior is implemented:

   * directly in this repository;
   * inside an ABACO dependency;
   * partly in both.
5. Whether the proper fix should be:

   * an application-level integration;
   * a change in an ABACO package;
   * an extension point or callback supplied by the application;
   * a dependency upgrade after a package-level change.
6. Whether the dependency already exposes a validation hook, pre-submit callback, request interceptor, API service, or reusable utility that should be used.

Do not propose directly modifying compiled files inside `node_modules`.

If a required change belongs to an ABACO dependency, identify the source package that should own the change and explain how the current application would consume the corrected package version.

---

# Questions the analysis must answer

## Validation placement

For each of the four operations, determine the exact safest point at which the `/validate` call should be inserted.

The validation should normally occur:

```text
After local form validation and final payload creation
→ Before the real update/delete API call
→ Before closing the form or resetting its state
```

Confirm whether this sequence fits the current code architecture.

---

## Payload reuse

Determine how to guarantee that activity validation receives the same effective payload as the real update request.

Avoid constructing two independent payloads that may become inconsistent.

Prefer, where compatible with the mandatory rules:

1. Build the final request payload once.
2. Send it to the validation endpoint.
3. If the response is empty, send the same payload to the real endpoint.

Explain how this can be implemented using the current functions and abstractions.

---

## Validation response handling

Find whether the repository already has:

* a common anomaly model;
* validation-error utilities;
* standard business-error dialogs;
* APIs that return arrays of blocking conditions;
* reusable notification components;
* standard forms error handling;
* translations for similar blocking messages.

Determine whether anomalies should be:

* displayed individually;
* transformed into a generic blocking message;
* passed to an existing error component;
* handled by a standard backend error mapper.

Do not invent an anomaly response structure that is not documented or visible in existing code.

---

## Date handling

Inspect how dates are represented throughout all four flows.

Confirm:

* form date type;
* timezone handling;
* conversion utilities;
* Unix seconds versus milliseconds;
* start-of-day/end-of-day normalization;
* nullable dates;
* inclusive/exclusive validity boundaries;
* whether the validation payload can reuse the exact serialized values from the real request.

Highlight any potential timezone or date-normalization risk.

---

## Loading and duplicate submissions

Determine how the UI currently prevents repeated submissions.

The suggested solution must ensure that:

* the validation and actual operation behave as one user action;
* loading remains active across both requests;
* the user cannot submit again between validation and update;
* the form does not close after validation alone;
* success is shown only after the real operation succeeds;
* loading is reset correctly after validation anomalies or API failures.

---

## Error behavior

The implementation must be fail-safe.

Confirm how the existing code should behave when:

* validation returns an empty array;
* validation returns anomalies;
* validation returns null or an unexpected response;
* validation returns an HTTP business error;
* validation fails due to a network/server error;
* validation succeeds but the real update/delete fails.

The real operation must not execute when validation has not clearly succeeded.

---

## Scope of activity validation

The ticket mainly refers to activity-date changes.

Investigate whether the frontend can reliably determine that only the date changed.

Then recommend, with justification, whether validation should run:

* only when the relevant activity date changes; or
* before every update of an existing planned/executed activity.

Base this recommendation on:

* the backend contract;
* the current payload;
* code complexity;
* the risk of bypassing validation;
* the mandatory working rules.

Clearly label this as either a confirmed requirement or a recommended implementation decision.

---

# Required final output

Do not provide code or patches.

Provide a detailed technical analysis using the following structure.

## 1. Executive summary

Explain:

* the confirmed issue;
* why the FE change is required;
* the four affected operations;
* where the main implementation appears to belong.

---

## 2. Confirmed business rules

Describe the rules supported by the attached tickets.

Clearly distinguish between:

* ticket-confirmed requirements;
* conclusions confirmed from the repository;
* assumptions;
* open questions.

---

## 3. Current implementation map

Provide a table with columns similar to:

| Operation                | UI entry file | Submit function | API/service function | Dependency/package | Current endpoint |
| ------------------------ | ------------- | --------------- | -------------------- | ------------------ | ---------------- |
| Planned activity update  | ...           | ...             | ...                  | ...                | ...              |
| Executed activity update | ...           | ...             | ...                  | ...                | ...              |
| Worker-role update       | ...           | ...             | ...                  | ...                | ...              |
| Worker-role deletion     | ...           | ...             | ...                  | ...                | ...              |

Include exact file paths, symbols, and relevant line numbers.

---

## 4. Detailed current flow per operation

For each operation, explain the complete flow from user action to API response.

Reference:

* exact files;
* components/classes;
* methods/functions;
* stores/services;
* dependency code;
* payload builders;
* success and error handlers.

---

## 5. Exact technical gap

Explain precisely what is currently missing.

For example:

* which handler directly calls the real update/delete API;
* where no backend validation is currently performed;
* whether a suitable service method is missing;
* whether the API belongs in the application or an ABACO dependency;
* whether the same payload can already be reused;
* which existing error-handling mechanism can support anomalies.

Do not give only a generic description.

---

## 6. Ownership and affected-file assessment

Separate files into:

### Files confirmed to require modification

For every file, explain:

* why it must change;
* which function or section is involved;
* what responsibility should be added or adjusted.

### Files that may require modification

Explain what confirmation is still needed.

### ABACO dependency changes

For each dependency-level change, explain:

* package name and installed version;
* owning source package;
* required exported API or behavior;
* how this repository would consume the new version.

### Files inspected but not expected to change

Include important files that helped confirm the flow but should remain unchanged.

---

## 7. Recommended solution design

Provide a step-by-step implementation plan without writing the code.

For every operation, describe:

1. Where the validation service method should live.
2. What parameters it should receive.
3. How endpoint IDs should be resolved.
4. How the final payload should be created and reused.
5. Where validation should be called.
6. How an empty array should be handled.
7. How anomalies should be handled.
8. How validation failures should be handled.
9. When the existing update/delete request should execute.
10. How loading, modal state, notifications, and refresh should behave.

---

## 8. Suggested API/service signatures

Do not implement them, but describe the recommended responsibilities and inputs/outputs for the required service methods.

For example, describe conceptually whether methods similar to these are needed:

```text
validatePlannedActivityUpdate(...)
validateExecutedActivityUpdate(...)
validateWorkerRoleUpdate(...)
validateWorkerRoleDeletion(...)
```

Use names aligned with the repository’s existing naming conventions, not necessarily these examples.

Specify the expected return type based on confirmed backend or repository evidence.

---

## 9. Mandatory working-rules compliance

For each important part of the proposed solution, explain how it complies with the supplied `MANDATORY WORKING RULES`.

Call out any rejected alternatives and why they would violate those rules.

---

## 10. Test plan

Provide a detailed test matrix covering at least:

### Planned activity

* date remains valid for all workers;
* changed date leaves one worker without a valid role;
* multiple workers, with only one invalid;
* empty validation response;
* non-empty anomaly response;
* validation API failure;
* real update failure after successful validation.

### Executed activity

Cover the equivalent cases.

### Worker-role modification

* role dates change but all activities remain covered;
* one activity becomes uncovered;
* another role still covers the affected activity;
* multi-role worker;
* start date changed;
* end date changed;
* open-ended/null date where supported;
* validation API failure.

### Worker-role deletion

* role is unused;
* role is used but another valid role covers all activities;
* role is the only coverage for one or more activities;
* multi-role worker;
* validation API failure;
* real deletion failure after successful validation.

Also include regression checks for unchanged create flows and unrelated worker/activity operations.

---

## 11. Open questions and missing information

List only questions that cannot be answered from the PDFs or repository.

Prioritize questions for the backend developer, such as:

* exact anomaly response schema;
* whether null is ever returned instead of `[]`;
* expected user-facing anomaly details;
* exact endpoint prefix in each environment;
* whether activity validation is mandatory only when the date changes;
* role ID versus relation ID semantics;
* date boundary and timezone rules.

For each question, explain why the answer affects implementation.

---

# Analysis quality requirements

Your conclusions must be evidence-based.

For every major finding:

* include the exact repository file path;
* include the relevant class, method, function, or exported symbol;
* include line numbers where possible;
* identify the dependency package and version where relevant;
* distinguish confirmed facts from assumptions;
* explain why the located code is part of the requested ticket.

Search beyond obvious filenames and Italian/English terminology. Relevant code may use terms such as:

```text
worker
role
relation
involved
subject
activity
activities
action
execution
planned
validity
start_date
end_date
pkIdRelazione
anag_relazioni
standard forms
validate
```

Do not stop at the first apparent match. Trace every flow through to its real API request.

---

# Final reminder

This is an analysis-only task.

Do not implement anything.

Do not change any repository file.

The final response must give me a precise technical explanation of the current issue, the exact involved files and functions, dependency ownership, and a standard step-by-step solution proposal based on:

1. the attached tickets;
2. the current repository implementation;
3. the relevant ABACO dependencies;
4. the backend developer’s endpoint and validation details;
5. the supplied `MANDATORY WORKING RULES`.



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
