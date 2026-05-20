# MERGE and VERSIONING

VERSIONING A REQUEST

- merge the request
- checkout the master with the merged request and fetch latest changes
- create new version "npm version patch" for bugfixes, "npm version minor" for features, "npm version major" for breaking changes
- push the tag of the version "git push --follow-tag"
- check after 5/10 if the pipeline went trough, if not, check the errors (90% of the time it's type errors or console.log)
- the type errors can be checked on the terminal if the npm run serve is in the terminal, or with an "npm run lint"
- update the ticket, by put it at resolved/100, add it to edoardo lebrun, telling the name and the tag of the module published, and adding a note to tell that he can update the "portal" project

---

TO MERGE A BRANCH

- go to gitlab - https://gitlab.fe.abacogroup.eu/abaco4farmer, search for module, open branches page
- click "new" button to open a merge request, put yourself as the Assignee, and check "squash commits" checkbox
- in the merge page, if needed rewrite the commit message, click "confirm"
  A: no conflicts betweeen branch and master, nothing additional to do
  B: conflicts not auto-resolvable by git (same file modifided by the master while you worked on the branch), need to resolve manually the conflicts
  resolvable by alwasy checking, before doing the merge request, if the master went forward, and you merge the master to your branch (to do that: git merge origin/master)
- merge done!

# Release Note

    Rilasciato widgets-container-module v1.21.0
    necessario aggiornamento i18n
    Da compilare portal


