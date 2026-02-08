# 🚀 Quick Start - Push Your Code to GitHub

## From VS Code Terminal

Press `Ctrl+~` to open terminal, then run:

```bash
# 1. See what changed
git status

# 2. Add all your changes
git add .

# 3. Commit with a message
git commit -m "Add new features: describe what you added"

# 4. Push to GitHub
git push origin main
```

**Note:** Replace `main` with your branch name if different (check with `git branch`)

---

## From VS Code UI

1. Click **Source Control** icon (left sidebar) or press `Ctrl+Shift+G`
2. Click **+** next to "Changes" to stage all files
3. Type your commit message in the box
4. Click **✓ Commit**
5. Click **...** menu → **Push**

---

## Common Issues

**"Updates were rejected"?**
```bash
git pull origin main
git push origin main
```

**Want to undo your last commit?**
```bash
git reset --soft HEAD~1
```

---

## 📖 Need More Help?

Check the complete guide: **[docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md)**

This includes:
- Working with branches
- Resolving merge conflicts  
- Best practices
- Troubleshooting
- And much more!
