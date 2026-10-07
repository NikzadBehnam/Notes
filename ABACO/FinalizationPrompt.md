# Codex Prompt — Final Branch Audit, Refactoring & Implementation Cleanup

## Objective

Perform a **deep, accurate, finalization-level audit of the entire current branch** before it is considered ready for review/merge.

This branch may contain many changes accumulated during development, debugging, backend adjustments, temporary experiments, API investigations, fixes, and logic revisions.

At this stage, the implementation is expected to be functionally correct.

Your responsibility is to:

- inspect the entire branch carefully;
- identify unnecessary complexity, leftovers, duplication, temporary logic, obsolete code, and accidental implementation artifacts;
- refactor the implementation where appropriate;
- preserve the **current working behavior and business logic**;
- verify that API integrations are production-safe and not still using temporary testing shortcuts;
- improve maintainability, readability, consistency, and robustness;
- avoid introducing new behavior unless correcting an obvious implementation defect that contradicts the already-established intended behavior.

---

# CRITICAL RULE — DO NOT CHANGE WORKING BEHAVIOR

The most important requirement is:

> **Do not change the observable behavior of the implementation unless an existing piece of code is clearly an accidental temporary/testing implementation or an obvious defect.**

The current branch may already be functionally correct.

This task is primarily a **final audit + cleanup + refactoring pass**, not a redesign.

Before modifying anything:

1. Understand the current behavior.
2. Understand why the code exists.
3. Determine whether the code is still necessary.
4. Confirm that the proposed cleanup preserves behavior.
5. Only then apply the change.

Do not refactor merely because a different implementation looks cleaner.

Do not replace stable logic with speculative abstractions.

Do not introduce unnecessary architectural changes.

---

# CONTEXT

During development, the branch may have gone through multiple iterations such as:

- initial implementation;
- debugging;
- temporary logging;
- workaround logic;
- backend contract changes;
- API response changes;
- changes in request parameters;
- pagination experiments;
- temporary limits;
- temporary hardcoded values;
- duplicated conditions;
- old implementation paths left behind after a new solution was introduced;
- newly created properties that later became unnecessary;
- additional state variables that duplicate already-existing state;
- methods that are no longer used;
- computed properties that duplicate existing data;
- duplicated transformations;
- defensive conditions that are no longer needed;
- temporary feature flags;
- commented-out code;
- debug-only code;
- redundant imports;
- unused types/interfaces;
- stale comments;
- obsolete TODOs;
- duplicated API calls;
- repeated data mapping;
- unnecessary watchers;
- unnecessary event emissions;
- unnecessary request parameters;
- incorrect pagination assumptions introduced only for testing.

Your task is to find these cases systematically.

---

# SCOPE

Inspect the **entire branch diff**, not only the last modified file.

Compare the current branch against its base branch and identify every file affected by this implementation.

Review:

- Vue components;
- composables;
- stores;
- services;
- API clients;
- TypeScript types/interfaces;
- utility functions;
- constants;
- watchers;
- computed properties;
- props;
- emits;
- local component state;
- lifecycle hooks;
- route logic;
- request builders;
- response transformations;
- pagination logic;
- filtering logic;
- sorting logic;
- mapping logic;
- loading/error handling;
- templates;
- styles if they are related to removed or obsolete markup;
- tests if present;
- configuration touched by this branch.

Also inspect indirect interactions with existing modules where the branch relies on pre-existing behavior.

---

# PHASE 1 — UNDERSTAND THE BRANCH BEFORE TOUCHING CODE

First, perform a complete analysis.

## 1.1 Determine the branch purpose

Identify:

- what feature/fix this branch implements;
- which functional areas are affected;
- which user-visible behavior was added or changed;
- which APIs are involved;
- which existing modules the implementation depends on.

## 1.2 Inspect the complete diff

Review all changes relative to the branch base.

Do not limit the analysis to files that appear obviously related.

Look for files modified earlier in the branch that may no longer be necessary after later implementation changes.

## 1.3 Reconstruct the implementation flow

Trace the complete flow:

```text
User interaction
    ↓
Component / UI event
    ↓
Local state / store
    ↓
Business logic
    ↓
API/service call
    ↓
Request parameters
    ↓
Backend response
    ↓
Transformation
    ↓
State update
    ↓
UI rendering
```

Understand this flow before refactoring.

---

# PHASE 2 — SEARCH FOR DEVELOPMENT LEFTOVERS

Perform a targeted audit for temporary or obsolete development artifacts.

Search for:

- `console.log`
- `console.warn`
- `console.error` added only for debugging
- `debugger`
- temporary variables
- commented-out implementation
- commented-out API calls
- commented conditions
- temporary TODO/FIXME notes
- hardcoded IDs
- hardcoded pagination limits
- hardcoded environment-specific values
- hardcoded dates
- temporary booleans
- temporary flags
- forced fallback values
- temporary request parameters
- mock data
- testing-only branches
- duplicate implementation blocks
- unused imports
- unused variables
- unused methods
- unused computed values
- unused props
- unused emits
- unused interfaces/types
- unused CSS selectors
- dead conditional branches
- obsolete code paths.

For every candidate, determine whether it is truly unnecessary before removing it.

---

# PHASE 3 — DUPLICATED LOGIC AUDIT

Carefully identify duplicated or near-duplicated logic.

Examples:

```ts
const companyId = selectedCompany.value?.id;
```

being generated in multiple places when an existing computed/state value already provides the same information.

Look for duplication in:

- request construction;
- validation;
- filtering;
- mapping;
- formatting;
- ID extraction;
- date conversion;
- pagination;
- sorting;
- state synchronization;
- error handling;
- permission checks;
- selection handling;
- API response normalization.

If two pieces of code perform the same responsibility, determine whether they should reuse an existing implementation.

Prefer existing project abstractions and conventions where appropriate.

However:

> Do not create a new abstraction just to remove a few repeated lines if the abstraction makes the code harder to understand.

Refactoring must reduce complexity, not relocate it.

---

# PHASE 4 — UNNECESSARY STATE / PROPERTIES AUDIT

One of the most important checks is identifying properties that were introduced during development but are no longer needed.

Inspect:

- component data;
- `ref`;
- `reactive`;
- computed properties;
- store properties;
- temporary caches;
- request-state objects;
- duplicated IDs;
- duplicated selected entities;
- duplicated booleans;
- derived values stored as state.

For each property ask:

1. Is this value truly independent state?
2. Can it already be obtained from existing state?
3. Is it just a duplicate representation of another property?
4. Is it synchronized manually with another property?
5. Could it be derived safely instead?
6. Was it introduced for debugging and later forgotten?

Example of something to question:

```ts
const selectedCompanyId = ref<number | null>(null);
```

when the code already has:

```ts
const selectedCompany = ref<Company | null>(null);
```

and only needs:

```ts
selectedCompany.value?.id
```

Do not remove state if doing so would change behavior, lifecycle timing, reactivity, or performance in a meaningful way.

---

# PHASE 5 — API IMPLEMENTATION AUDIT

This phase is **critical**.

During debugging/testing, API calls may have been intentionally simplified.

These temporary changes must not survive into production.

For every API call touched or introduced by the branch, verify all of the following.

## 5.1 Endpoint correctness

Confirm:

- correct endpoint;
- correct HTTP method;
- correct path parameters;
- correct query parameters;
- correct request body;
- correct headers if relevant.

## 5.2 No temporary request restrictions

Search for suspicious values such as:

```ts
count=10
count=20
count=50
pageSize=10
limit=10
offset=0
```

or code that only loads:

```ts
page 1
first page
first N records
```

These may have been introduced temporarily for testing.

Do not assume a low count is intentional.

Trace the normal expected application behavior.

---

# PHASE 6 — PAGINATION AUDIT

This is one of the highest-priority checks.

For every paginated API, determine the actual expected behavior.

Ask:

- Should the UI display only one page?
- Should it load all records?
- Does an existing shared component manage pagination?
- Is infinite scrolling used?
- Is server-side pagination expected?
- Is the API response using `offset`, `count`, `totalcount`, or another contract?
- Did development temporarily fetch only the first page?

A temporary implementation like:

```ts
count: 100
```

is **not automatically equivalent to loading all records**.

If the expected behavior requires the full dataset, ensure the implementation correctly handles pagination according to existing project conventions.

Example conceptually:

```text
request first page
↓
read totalcount
↓
request remaining pages when required
↓
combine records safely
```

But do **not** invent this logic if the project's established architecture expects server-side pagination.

Use the existing application pattern.

The goal is to prevent future missing-data bugs caused by test-only pagination assumptions.

---

# PHASE 7 — API CALL DUPLICATION

Check whether the same endpoint is triggered unnecessarily multiple times.

Look for duplicated calls caused by:

- multiple watchers;
- watcher + lifecycle hook;
- computed side effects;
- repeated event handlers;
- parent and child both fetching the same resource;
- filter updates causing duplicate requests;
- initialization logic running twice;
- request functions called from multiple overlapping flows.

Determine whether duplicate calls are intentional.

If not, simplify them without changing behavior.

---

# PHASE 8 — REQUEST PARAMETER AUDIT

For each request, inspect every parameter.

Identify:

- parameters no longer required;
- parameters added temporarily for testing;
- parameters duplicated in multiple layers;
- values passed even when undefined;
- obsolete flags;
- redundant defaults;
- parameters constructed from duplicate state;
- incorrect type conversions.

Confirm optional parameters are handled according to existing project conventions.

Avoid sending meaningless values such as:

```ts
param: undefined
param: null
param: ''
```

unless the API contract explicitly expects them.

---

# PHASE 9 — RESPONSE HANDLING AUDIT

Review API response processing.

Look for:

- duplicated mapping;
- repeated filtering;
- unnecessary deep cloning;
- repeated sorting;
- unsafe optional access;
- obsolete compatibility handling;
- temporary response transformations;
- properties extracted but never used;
- mapping layers that simply reproduce the same structure.

Ensure response handling remains compatible with the current backend contract.

Do not remove defensive handling unless you can verify it is obsolete.

---

# PHASE 10 — CONDITIONAL LOGIC AUDIT

Inspect all newly introduced or modified conditions.

Look for:

- duplicated conditions;
- contradictory conditions;
- deeply nested `if` statements;
- multiple checks for the same state;
- branches that can never execute;
- conditions introduced during debugging;
- fallback branches that are no longer reachable.

Example:

```ts
if (selectedCompany) {
    if (selectedCompany.id) {
        ...
    }
}
```

may possibly be simplified, but only if the semantics remain identical.

Avoid clever refactoring.

Prefer clarity.

---

# PHASE 11 — WATCHERS / REACTIVITY AUDIT

In Vue code, inspect every new or modified watcher.

Check:

- whether it is still necessary;
- whether another watcher already covers the same dependency;
- whether it creates duplicate API calls;
- whether `immediate` is required;
- whether `deep` is necessary;
- whether it causes unnecessary state synchronization;
- whether computed state could replace manual synchronization;
- whether the watcher can create loops.

Do not remove watchers without tracing their full side effects.

---

# PHASE 12 — COMPONENT CONTRACT AUDIT

Inspect:

- props;
- emits;
- exposed methods;
- slots;
- parent-child communication.

Look for props/events introduced during intermediate implementations that are no longer needed.

Check whether:

- a prop is passed but never used;
- an emitted event has no listener;
- the same information is passed through multiple layers unnecessarily;
- a new prop duplicates information already available through the store/context.

Do not redesign component boundaries unless necessary.

---

# PHASE 13 — TYPE SAFETY AUDIT

Review TypeScript changes.

Search for:

```ts
any
unknown as
as any
!
```

and overly broad type assertions.

Determine whether they were added temporarily.

Prefer accurate existing project types.

Check whether newly created interfaces duplicate existing shared types.

Reuse existing types where correct.

Do not over-engineer generic types.

---

# PHASE 14 — ERROR HANDLING AUDIT

Inspect all error handling added by the branch.

Check:

- errors are not silently swallowed;
- debug-only error logs are removed;
- user-facing errors still behave correctly;
- loading states reset correctly;
- failed requests do not leave inconsistent state;
- stale data is not mistakenly retained;
- retries are not accidentally duplicated.

Preserve existing project error-handling conventions.

---

# PHASE 15 — LOADING STATE AUDIT

Check loading states for:

- duplicated loading flags;
- loading state not reset in error paths;
- multiple APIs sharing one flag incorrectly;
- temporary loading flags that became obsolete;
- race conditions.

Prefer existing loading mechanisms where available.

---

# PHASE 16 — PERFORMANCE AUDIT

Without changing architecture, identify obvious unnecessary work:

- repeated `.filter()`;
- repeated `.map()`;
- repeated sorting;
- repeated expensive computed logic;
- duplicate API calls;
- unnecessary deep watchers;
- repeated conversion of the same data;
- rendering large hidden lists;
- creating new arrays/objects unnecessarily inside frequently executed paths.

Only optimize when the improvement is clear and low-risk.

Do not perform speculative micro-optimizations.

---

# PHASE 17 — PROJECT CONVENTION AUDIT

Compare the implementation with nearby existing code.

Check:

- service patterns;
- naming conventions;
- API client patterns;
- component structure;
- store patterns;
- error handling;
- pagination;
- loading behavior;
- type definitions;
- utility usage;
- translation/i18n;
- permissions;
- formatting.

Prefer established project patterns over introducing branch-specific patterns.

---

# PHASE 18 — COMMENTS AUDIT

Review comments added in the branch.

Remove comments that:

- explain temporary debugging;
- describe code that no longer exists;
- are obvious from the code;
- refer to obsolete backend behavior;
- contain implementation history that belongs in Git history.

Keep comments that explain non-obvious business rules or important constraints.

---

# PHASE 19 — DEAD CODE AUDIT

Perform a deliberate dead-code review.

Identify anything that is no longer reachable or referenced:

- functions;
- methods;
- constants;
- variables;
- imports;
- props;
- events;
- types;
- template sections;
- CSS;
- helper functions;
- service wrappers.

Verify before deletion.

---

# PHASE 20 — SIMPLICITY CHECK

After understanding the implementation, ask:

> Can this implementation be made simpler without changing behavior?

Possible improvements:

- reuse an existing property instead of introducing another;
- use an existing helper instead of duplicating logic;
- remove unnecessary intermediate variables;
- flatten unnecessary branching;
- remove redundant transformations;
- consolidate duplicate request construction;
- remove temporary defensive code that is provably obsolete.

But do not sacrifice readability for fewer lines.

---

# PHASE 21 — REGRESSION PROTECTION

For every refactor, consider:

- selected values;
- empty results;
- loading;
- failed requests;
- large datasets;
- pagination;
- filters;
- sorting;
- route changes;
- component remount;
- user switching selection quickly;
- API returning zero records;
- API returning many records;
- optional/null fields;
- stale requests;
- repeated user actions.

Ensure cleanup does not introduce regressions.

---

# PHASE 22 — VALIDATION

After refactoring:

1. Run linting if available.
2. Run type checking if available.
3. Run relevant tests if available.
4. Run build if appropriate.
5. Inspect the final diff.
6. Ensure no accidental unrelated files changed.
7. Ensure debug code is gone.
8. Ensure no temporary API limitation remains.
9. Ensure pagination behavior is correct.
10. Ensure no working business logic was altered.

If a test/build failure is unrelated to the branch, clearly report it rather than making unrelated changes.

---

# MANDATORY FINAL DIFF REVIEW

After all modifications, perform one final full branch review.

Compare the cleaned branch against the base branch again.

Specifically ask:

- Is every changed line still necessary?
- Is there any temporary development code left?
- Is there duplicated logic?
- Is there redundant state?
- Are there unnecessary properties?
- Are API calls production-ready?
- Is pagination correct?
- Are request limits accidental?
- Are API parameters correct?
- Are duplicate requests possible?
- Are there stale comments?
- Are there unused imports?
- Are there unused types?
- Are there unnecessary conditions?
- Did any refactor accidentally change behavior?

Do not consider the task complete until this second diff review is done.

---

# IMPORTANT — BE CONSERVATIVE WITH REFACTORING

This is not an opportunity for a large redesign.

Avoid:

- architectural rewrites;
- introducing new design patterns without need;
- replacing working project conventions;
- moving many files for aesthetics;
- creating excessive abstractions;
- changing public component APIs without reason;
- changing backend contracts;
- changing business behavior;
- large unrelated formatting changes;
- unrelated cleanup outside the branch scope.

Prefer:

```text
small
safe
understandable
testable
behavior-preserving
```

changes.

---

# REQUIRED WORKFLOW

Use this workflow:

## Step 1 — Analyze

Inspect the complete branch and identify potential cleanup/refactoring candidates.

## Step 2 — Create an audit report BEFORE editing

Provide a structured report containing:

### A. Branch implementation summary

Briefly describe what the branch currently does.

### B. Files reviewed

List all relevant changed files.

### C. Findings

Categorize findings as:

- Dead code
- Duplicate logic
- Unnecessary state/properties
- Temporary/debug code
- API implementation concerns
- Pagination concerns
- Request parameter concerns
- Duplicate API calls
- Reactivity/watchers
- Type issues
- Error/loading handling
- Performance
- Naming/readability
- Project-convention inconsistencies
- Comments/TODOs
- Other cleanup opportunities

For each finding include:

```text
File:
Location:
Issue:
Why it is unnecessary/risky:
Proposed safe change:
Behavior impact:
```

`Behavior impact` should normally be:

```text
No intended behavior change.
```

If you cannot guarantee that, do not modify it automatically.

## Step 3 — Refactor

Apply only safe, justified changes.

## Step 4 — Validate

Run available validation commands.

## Step 5 — Final diff audit

Review the entire branch again.

## Step 6 — Final report

Provide the final report described below.

---

# REQUIRED FINAL REPORT

At the end provide:

## 1. Summary

What was reviewed and cleaned.

## 2. Removed development leftovers

List removed temporary/debug/test code.

## 3. Removed dead code

List unused properties, functions, imports, types, etc.

## 4. Simplified logic

Describe duplicated or unnecessarily complex logic that was simplified.

## 5. Reused existing implementation

Mention cases where newly introduced state/properties/helpers were replaced by already-existing project logic.

## 6. API audit

For each affected API, report:

```text
Endpoint:
Method:
Pagination behavior:
Request parameters:
Temporary limits found:
Duplicate-call risk:
Result:
```

## 7. Pagination verification

Explicitly state whether every paginated endpoint is safe for the expected dataset size.

Do not simply write "pagination is fine."

Explain why.

## 8. Behavior preservation

State whether any user-visible/business behavior changed.

Expected result:

```text
No intended business behavior changed.
```

If something had to change, explain exactly what and why.

## 9. Validation results

Report:

- lint;
- type-check;
- tests;
- build;
- any unavailable checks;
- unrelated failures.

## 10. Remaining concerns

List anything that should not be changed automatically because it requires:

- backend confirmation;
- product clarification;
- QA confirmation;
- broader architectural work.

## 11. Final readiness assessment

Do **not** give a vague answer.

State whether, from a code-quality/finalization perspective, the branch still contains any known:

- debug leftovers;
- dead code;
- duplicate logic;
- temporary API restrictions;
- pagination shortcuts;
- unnecessary state;
- unnecessary parameters;
- obvious cleanup debt introduced by this branch.

---

# SPECIAL API/PAGINATION WARNING

Treat this scenario as especially dangerous:

During development someone temporarily changes:

```ts
count: 20
```

or:

```ts
pageSize: 50
```

or fetches only:

```ts
offset: 0
```

because only a small amount of test data exists.

The implementation appears correct during development but later fails when real data exceeds that limit.

You must actively search for this class of issue.

Do not assume that because the UI currently works, the API implementation is production-safe.

---

# SPECIAL DUPLICATED STATE WARNING

Also actively search for this pattern:

A new property is added only because it was convenient during development, even though the information already exists elsewhere.

Example:

```ts
const selectedContractId = ref(null);
```

while:

```ts
const selectedContract = ref(null);
```

already exists.

If the ID can safely be obtained from:

```ts
selectedContract.value?.id
```

then the additional synchronized state may be unnecessary.

However, verify lifecycle/reactivity behavior before removing it.

---

# SPECIAL DEBUGGING-LOGIC WARNING

Some code may exist only because it helped investigate a bug.

Examples:

```ts
if (records.length > 100) {
    return records.slice(0, 100);
}
```

```ts
const requestCount = 20;
```

```ts
const useTemporaryFallback = true;
```

```ts
// temporary until BE fixes endpoint
```

```ts
if (!response.foo) {
    return oldResponse;
}
```

Do not automatically delete these without understanding them.

Determine whether the original reason still exists.

If backend behavior has changed and the workaround is now obsolete, remove it.

If uncertainty remains, report it instead of guessing.

---

# MINDSET

Act as a senior engineer performing a **pre-merge production-readiness code audit**.

Your priorities are:

1. Preserve correct behavior.
2. Remove development leftovers.
3. Eliminate accidental complexity.
4. Prevent hidden data-loss bugs.
5. Verify API correctness.
6. Verify pagination.
7. Reuse existing project logic.
8. Reduce redundant state.
9. Improve maintainability.
10. Keep the final implementation simple and conventional.

The final code should look as though it was implemented cleanly in one deliberate pass, rather than accumulated through multiple debugging iterations.

---

# ADDITIONAL PROJECT RULES

I may provide a section named:

## MANDATORY WORKING RULES

Treat those rules as authoritative.

All analysis, refactoring, validation, and finalization must comply with them.

If a proposed cleanup conflicts with those rules, follow the **MANDATORY WORKING RULES**.

---

# FINAL INSTRUCTION

Begin by analyzing the entire branch and producing the audit report.

Then perform the safe refactoring.

Do not skip directly into code changes without first understanding and documenting the findings.

Be especially strict about:

- temporary API limits;
- incomplete pagination;
- duplicate requests;
- unnecessary new properties;
- duplicate state;
- stale debug logic;
- redundant conditions;
- obsolete implementation paths;
- unused code.

The objective is a **clean, production-ready, behavior-preserving branch** with minimal accidental complexity.
