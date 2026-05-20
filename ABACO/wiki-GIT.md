# -------------------abord meging process----------------------
- git merge --abort

# -------------------Merge master into your branch-------------

- Step 1: Make sure you're on your branch
  git checkout your-branch-name

- Step 2: Fetch latest changes
  git fetch origin

- Step 3: Merge master into your branch
  git merge origin/master

# ----------------to delete a local branch----------------------

    git branch -d branch-to-delete

# ---To discard local changes to all files, permanently---------

    git reset --hard

# -----------------to clone a repo from a specific branch-------
    git clone --single-branch -b branch-name repourl
    ex: git clone --single-branch -b starte https://github.com/safak/next-blog.git

# ---------Add a local project to a new GitHub repo-------------
    1. **Create a repo** on GitHub (without README).
    2. Open terminal in your project folder.
    3. Run:

    ```bash
      git init
      git add .
      git commit -m "Initial commit"
      git branch -M master
      git remote add origin https://github.com/username/repo-name.git
      git push -u origin master
    ```
# ------------------to rename the local branch-------------------

  - if you are in the target branch 
    git branch -m new-branch-name
  
  - if you are not in the target branch
    git branch -m old-branch-name new-branch-name


# --------------TO MERGE TO MASTER OR ANY OTHER BRANCH-------------

### **1. Make sure you have the latest changes**

  ```bash
    git checkout master
    git pull origin master
  ```

### **2. Switch to the branch you want to merge**

  ```bash
    git checkout <your-branch-name>
    git pull origin <your-branch-name>
  ```

### **3. Switch back to `master`**

  ```bash
    git checkout master
  ```

### **4. Merge the branch into `master`**

  ```bash
    git merge <your-branch-name>
  ```

If there are no conflicts, it will merge immediately.

### **5. Resolve conflicts (if any)**

Open the file(s), resolve conflicts, then:

  ```bash
    git add .
    git commit
  ```

### **6. Push the updated master to the remote**

  git push origin master
  

### **Optional: Delete the merged branch**

  ```bash
    git branch -d <your-branch-name>
    git push origin --delete <your-branch-name>
  ```

### remove node_modules and package_lock
  rm -rf node_modules package-lock.json
 

# Clear the CI npm cache (most common fix)
    rm -rf .npm
    npm cache clean --force || true
    npm ci --cache .npm

# update all abaco dependencies
 ncu @abaco/* -u

# to check the depended packags on a specific version of a libray

  npm view @abaco/dashboard-module@7.12.1 peerDependencies
  npm view @abaco/dashboard-module@7.12.1 dependencies


# revert the last commit
  git revert HEAD
  git push origin master


# to ignore third-party .d.ts errors, add this in tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}

