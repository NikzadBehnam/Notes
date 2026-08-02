I need you to analyze the current branch deeply and accurately for this requirement in the Filiere/Supply Chain module.

Requirement:
On the plot/parcel selection page, when the user clicks the “Conferma” button, the system must check that at least one plot/parcel has been selected.

If no plot/parcel has been selected, the user must see a clear validation message and the confirm action must not continue.

Business rule:

- The user cannot confirm the plot/parcel selection with an empty selection.
- At least one plot/parcel must be selected before proceeding.
- If the selected plots list is empty, show a clear message to the user.
- The confirmation/save/navigation flow must be blocked until at least one plot/parcel is selected.

Your task:

- Analyze the code clearly and segment by segment.
- Check the plot/parcel selection page used in the contract/Filiere flow.
- Identify the “Conferma” button and its click handler.
- Check where selected plots/parcels are stored.
- Check whether the selected plots are managed by local state, props, Vuex/store, route params, or API response.
- Check whether the page already has validation logic before confirming.
- Check whether the same selection page is used in different modes, for example:
  - create mode
  - edit mode
  - read-only mode
  - view-only mode

- Check whether this validation should apply only when the user is actively adding/selecting plots, and not in read-only mode.
- Check whether selected plots can come from:
  - table selection
  - map selection
  - preloaded existing contract plots

- Confirm whether the requirement is currently missing or partially implemented in the branch.

Expected validation behavior:

- When the user clicks “Conferma”:
  - if at least one plot/parcel is selected, continue with the current confirm flow.
  - if no plot/parcel is selected, stop the confirm flow.
  - show a clear error/warning message.

- The message should be handled through the existing project notification/toast/i18n system if available.
- Avoid hardcoded text if the project uses translations.

Important:
Do not start coding.
Do not modify any files.
Do not create commits.
Do not run npm, pnpm, yarn, build, lint, or test commands, because the project is very heavy.
You can only inspect/search/read the code and report your findings.
If validation commands are needed, only suggest them for the developer to run manually later.

After checking, ask me for any missing information you need, for example:

- screenshot of the plot/parcel selection page
- expected validation message text
- whether the message should be toast, inline alert, modal, or field-level message
- exact route/page where the issue happens
- whether this validation should apply in all selection flows or only contract plot selection
- API payload sent when confirming selected plots
- current behavior when clicking “Conferma” with no selected plots

Expected output:

- Confirm whether the issue exists or not.
- Explain the current plot/parcel selection and confirmation flow clearly.
- Explain the technical root cause.
- Mention the exact files, components, functions, click handlers, selected state variables, store actions, emits, API methods, validation utilities, and translation/toast keys involved.
- Explain the recommended solution step by step, but without implementing it.
- Explain where the validation should be added to avoid duplicated logic and to avoid breaking other flows.
- Explain how to manually test the fix after implementation.
- Follow the MANDATORY WORKING RULES that I added below this prompt.

# MANDATORY WORKING RULES:

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

so from what you got give me a clear, understandable and accurate prompt to codex to:

- analyse the code briefly and accuratly
- to not start code yet
- on its analyse and solution suggestion, it should consider some points I am attaching with prompt (MANDATORY WORKING RULES)
- to give me a clear and technical detail about the issue, and the solution(Mentioning the files and functions Involved)
- I am adding also the 3 screenshot I have already attached here, for more clear detail

---
