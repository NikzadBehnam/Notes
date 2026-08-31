
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