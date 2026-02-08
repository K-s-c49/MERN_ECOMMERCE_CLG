# Git Workflow Guide - Push Code from VS Code

This guide will help you push your code changes to GitHub from VS Code after creating new features.

## 🚀 Quick Start - Push Your Code

### Method 1: Using VS Code Terminal (Recommended)

Open the terminal in VS Code (`Ctrl+~` or `View > Terminal`) and run these commands:

```bash
# 1. Check which files have changed
git status

# 2. Add all your changes to staging
git add .

# 3. Commit your changes with a descriptive message
git commit -m "Add new features: [describe your features here]"

# 4. Push to GitHub
git push origin main
```

**Note:** Replace `main` with your branch name if you're working on a different branch (e.g., `master`, `develop`, `feature/new-feature`)

### Method 2: Using VS Code Source Control UI

1. Click on the **Source Control** icon in the left sidebar (or press `Ctrl+Shift+G`)
2. Review your changed files
3. Click the **+** icon next to each file to stage them (or click **+** next to "Changes" to stage all)
4. Enter a commit message in the text box at the top
5. Click the **✓ Commit** button
6. Click the **...** (more actions) menu and select **Push**

---

## 📋 Detailed Git Workflow

### Step 1: Check Your Current Status

Before pushing, always check what changes you have:

```bash
git status
```

This shows:
- Modified files (red = unstaged, green = staged)
- Untracked files (new files)
- Current branch name

### Step 2: Stage Your Changes

**Stage all changes:**
```bash
git add .
```

**Stage specific files:**
```bash
git add path/to/file.js
git add backend/controller/productcontroller.js
```

**Stage multiple files:**
```bash
git add file1.js file2.js file3.css
```

### Step 3: Commit Your Changes

Write a clear, descriptive commit message:

```bash
git commit -m "Add user authentication feature"
```

**Good commit message examples:**
- `"Add shopping cart functionality"`
- `"Fix product search bug"`
- `"Update product API endpoints"`
- `"Improve error handling in user controller"`

**Multi-line commit messages:**
```bash
git commit -m "Add payment integration" -m "- Integrated Stripe payment gateway
- Added payment success/failure pages
- Updated order model with payment status"
```

### Step 4: Push to GitHub

**Push to your current branch:**
```bash
git push
```

**Push to a specific branch:**
```bash
git push origin main
git push origin feature/new-feature
```

**First time pushing a new branch:**
```bash
git push -u origin feature/new-feature
```

The `-u` flag sets up tracking, so future pushes only need `git push`.

---

## 🌿 Working with Branches

### Create a New Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/add-payment

# Make your changes, then commit
git add .
git commit -m "Add payment feature"

# Push the new branch to GitHub
git push -u origin feature/add-payment
```

### Switch Between Branches

```bash
# View all branches
git branch -a

# Switch to an existing branch
git checkout main
git checkout feature/add-payment
```

### Merge a Feature Branch

```bash
# Switch to main branch
git checkout main

# Merge your feature branch
git merge feature/add-payment

# Push the merged changes
git push origin main
```

---

## 🔄 Common Workflows

### Scenario 1: Daily Development

```bash
# Morning: Get latest changes
git pull origin main

# Work on your features...

# End of day: Push your changes
git add .
git commit -m "Complete user profile page"
git push origin main
```

### Scenario 2: Adding Multiple Features

```bash
# Feature 1
git add backend/controller/userController.js
git commit -m "Add user registration endpoint"

# Feature 2
git add backend/controller/authController.js
git commit -m "Add login authentication"

# Feature 3
git add frontend/src/components/Login.jsx
git commit -m "Create login component"

# Push all commits at once
git push origin main
```

### Scenario 3: Working on a Feature Branch

```bash
# Create feature branch
git checkout -b feature/shopping-cart

# Make changes and commit
git add .
git commit -m "Add shopping cart functionality"

# Push to feature branch
git push -u origin feature/shopping-cart

# Create Pull Request on GitHub, review, then merge
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Updates were rejected"

**Error:**
```
! [rejected]        main -> main (fetch first)
```

**Solution:**
```bash
# Pull the latest changes first
git pull origin main

# Resolve any conflicts if needed
# Then push again
git push origin main
```

### Issue 2: Merge Conflicts

When you pull and get conflicts:

```bash
# 1. Git will mark conflict files
# 2. Open the files and look for conflict markers:
#    <<<<<<< HEAD
#    Your changes
#    =======
#    Incoming changes
#    >>>>>>> branch-name

# 3. Edit the file to resolve conflicts
# 4. Remove the conflict markers
# 5. Stage the resolved files
git add path/to/resolved-file.js

# 6. Complete the merge
git commit -m "Resolve merge conflicts"

# 7. Push
git push origin main
```

### Issue 3: Accidentally Committed Wrong Files

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Undo last commit (discard changes):**
```bash
git reset --hard HEAD~1
```

### Issue 4: Need to Undo Changes Before Commit

**Discard changes in a specific file:**
```bash
git checkout -- path/to/file.js
```

**Discard all changes:**
```bash
git reset --hard HEAD
```

---

## 📝 Best Practices

### 1. Commit Often, Push Daily
- Make small, focused commits
- Push at least once a day
- Each commit should represent one logical change

### 2. Write Good Commit Messages
```bash
# ❌ Bad
git commit -m "fixed stuff"
git commit -m "update"

# ✅ Good
git commit -m "Fix product search pagination bug"
git commit -m "Add email validation to user registration"
```

### 3. Pull Before Push
```bash
# Always pull latest changes before pushing
git pull origin main
git push origin main
```

### 4. Use .gitignore
Make sure you don't commit unnecessary files:
```bash
# Check if .gitignore exists
cat .gitignore

# Common ignored files for MERN projects:
# node_modules/
# .env
# build/
# dist/
```

### 5. Review Changes Before Commit
```bash
# See what changed in files
git diff

# See staged changes
git diff --cached
```

---

## 🛠️ Useful Git Commands

### View History
```bash
# View commit history
git log

# Compact view
git log --oneline

# Last 5 commits
git log -5
```

### View Changes
```bash
# Show changes in working directory
git diff

# Show changes in a specific file
git diff path/to/file.js

# Show changes between commits
git diff HEAD~1 HEAD
```

### Stash Changes
```bash
# Save changes temporarily without committing
git stash

# List stashed changes
git stash list

# Apply stashed changes
git stash pop
```

---

## 🎯 Quick Reference Card

| Task | Command |
|------|---------|
| Check status | `git status` |
| Stage all files | `git add .` |
| Stage one file | `git add filename` |
| Commit changes | `git commit -m "message"` |
| Push to current branch | `git push` |
| Push to main branch | `git push origin main` |
| Pull latest changes | `git pull origin main` |
| Create new branch | `git checkout -b branch-name` |
| Switch branch | `git checkout branch-name` |
| View branches | `git branch -a` |
| View commit history | `git log --oneline` |
| Undo last commit (keep changes) | `git reset --soft HEAD~1` |
| Discard all changes | `git reset --hard HEAD` |

---

## 🎓 Learning Resources

- [Official Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [VS Code Git Integration](https://code.visualstudio.com/docs/editor/versioncontrol)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)

---

## 📞 Need Help?

If you encounter issues:
1. Read the error message carefully
2. Check this guide for common solutions
3. Search the error on Stack Overflow
4. Ask your team members or create an issue on GitHub

---

**Last Updated:** February 2026
