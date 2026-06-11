# Generatl Deployment Checklist
-[] release v150.0.4 from master
-[] release the i18n v150.0.1
-[] release the chart 

# RELEASE A PATCH FOR A FIX ON AN OLDER VERSION OF A MODULE
    1- [] Do the fix on the latest/master of the module
    2- [] Do the fix on the older version of the module. Create a branch from that version
       [] git checkout -b branch/0.1.2-a v0.1.2
       [] npm ci
    3- [] Manually update the "version" in package.json/package-lock.json with the new version of module (add a "-a" to the end of the version).
    4- [] Apply the fix.
    5- [] Add/commit/push the branch.
    6- Create a new tag from the GitLab interface based on the created branch:
        Open the module in GitLab --> Tags --> New Tag
        Name --> v0.1.2-a


1. Branching
 git checkout -b branch/149.5.2 master

- [] Determine the correct branch:v150.0.0
  - [] Latest Version: Working on `master`.
  - [] Older Version: Create a new branch from the specific tag (e.g., `git checkout -b branch/0.1.2+1 v0.1.2`).

1. Synchronize Environment

- [] Fetch latest changes from the remote: `git fetch`
- [] Pull the latest code: `git pull`
- [] Install dependencies from lock file: `npm ci` (for coldiretti it is ready)

3. Update Dependencies

- [+] Choose update method:
  - [] Latest Version (`master`):
    - [+] Run `ncu @abaco/* -u` to update all `@abaco` dependencies.
    - [+] Manually verify and adjust versions for `web-common`, `web-components`, and `Vue 3` if necessary.
    - [+] Run `npm i` to install updated packages.
  - [] Older Version:
    - [] Manually update specific module versions as detailed in the tickets.
    - [] point the local server to proper one, in portal vue.config.js
    - [] Run `npm i` to install updated packages.

1. Commit, Push, and Tag
- [+] IMPORTANT NOTE: IF YOU MADE THE BRANCH FROM MASTER, AFTER PUSHING THE NEW BRANCH, MERGE IT WITH MASTER TO MAKE THE NEW TAG FROM MASTER
- [+] Commit all changes, "Update packages"
- [+] Push the changes to the remote repository.

- [+] If on `master`: Pause the CI/CD pipeline for the initial push containing only package updates.
- [] Create a new release tag (e.g., `v1.2.3`).
  - "`npm version patch`" for bugfixes, "`npm version minor`" for features, "`npm version major`"
  - push the tag of the version "`git push --follow-tag`"
  - *⚠️ remember when you do a MAJOR to always release a new i18n*

    - NOTE: if pipeline didn't trigger any build, the reason might be that the tag is not created automaticaly on `git push --follow-tag`, normally it should get create on `git push --follow-tag`, but if it did not, do it from UI

    

1. Monitor Pipelines

- [] Follow the CI/CD pipelines.
- [] Wait for all stages to complete successfully.

7. Internationalization (i18n) Release (if needed)


New script for generating the backup.zip by Massimiliano Casadei
   - run `npm i` (only for the initial installation of the dependency) and
   - then execute `npm run release`.
   The script asks some questions, but it's simple: 


.\update_backup_script.bat v144.1.2

- [] Clone or navigate to the `i18n-repository`.
- [] Fetch and pull the latest changes.
- [] Run the update script with the new portal tag: `.\update_backup_script.bat v146.0.0`. (on powershell terminal)
- [] Add and commit the changes with the message "Updated backup".
- [] Push the commit to the remote repository.
- [] Create a corresponding tag for the i18n repository in GitLab.

<!-- 8. Update Deployment `Chart.yaml`

- [] Navigate to the `deployment` repository (link provided by Simone).
- [] Open `Chart.yaml`.
  - https://gitlab.fe.abacogroup.eu/codiretti_s4f/deployment/-/blob/master/Chart.yaml?ref_type=heads
- [] Update the portal version to the new tag.
- [] Update the i18n version if it was also updated.
- [] Commit and push the changes to `Chart.yaml`. -->

1. Link Related Tickets

- [] Link all relevant development/feature tickets to the main release ticket.

10. Handoff to Systems Team

- [] Update the release ticket, stating that the `Chart.yaml` is updated.
- [] Assign the ticket to the "Sistemisti" team.
- [] For Coldiretti Release ONLY:
  - [] Post an alert in the designated chat channel about the new release.

11. Notify Testers

- [] For each linked ticket, update its status to "Released".
- [] Add a comment notifying the tester, e.g., "Rilasciato nella XXX.X.X" (Released in XXX.X.X).

 
# -------------------------------------------------

#  Update Deployment  `Chart.yaml`  
- [] checkout to the latest version branch
- [] create the new branch from the latest branch
  - git checkout -b s141.3.3 s141.3.2

- [] Edit the Chart.yaml, 
    - [] add new version of the portals
    - [] the appVersion of the chart (eg 141.3.3)
    - [] update APIs if anything from backend on the tickets

- [] Edit the appVersion in Chart.yaml to the latest version (eg 141.3.3)    
- [] add/commit/push the branch with message (Edit Chart.yaml)

- []** S4F AND NIAB** On database-scripts create a new tag manually, exacly the same tag number as new chart version (eg 141.3.3)
  - https://gitlab.fe.abacogroup.eu/niab/database-scripts

- [] Create the new tag on niab-chart repo (eg 141.3.3)
  - https://gitlab.fe.abacogroup.eu/niab/deployment
    NOTE: by adding this tag the puplines will get trigered
    NOTE: *ONLY MALTA* if the branch is not master, the dev pipline will tigger once you push the branch, then the other piplines will trigger on tag creation

- [] the new piplines will trigger
  - [] let the dev pipline goes on and stop the two others
  - [] once the dev pipline passed successfully start the test and then finaly the live

----------- 

La pipeline per il i18n v150.0.2 è partita



La pipeline per il portal v150.0.11 partita
https://gitlab.fe.abacogroup.eu/abaco4farmer/portal/-/pipelines/176340

Tickets:
https://abacogroup.easyredmine.com/issues/217610