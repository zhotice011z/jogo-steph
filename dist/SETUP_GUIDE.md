# 🎮 Complete Setup Guide - Packaging Your HTML5 Game

## 📋 What You're Getting

This package contains everything you need to distribute your HTML5 game as a downloadable executable. No more CORS errors!

### Files Included:
- **server.js** - Local web server that runs your game
- **package.json** - Configuration file
- **README.md** - Detailed documentation for developers
- **PLAYER_GUIDE.md** - Instructions for your players
- **build.sh** / **build.bat** - Automated build scripts
- **start-game.sh** / **start-game.bat** - Simple launcher scripts
- Sample game files (index.html, style.css, game.js) - Replace with yours!

---

## 🚀 Quick Start (3 Steps!)

### Step 1: Replace Sample Files with Your Game
1. Delete the sample files: `index.html`, `style.css`, `game.js`
2. Copy ALL your game files into this folder
3. Make sure your main HTML file is named `index.html`

### Step 2: Build Your Executables
**Windows:**
```bash
build.bat
```

**Mac/Linux:**
```bash
chmod +x build.sh
./build.sh
```

Choose option 1 (all platforms) or pick specific platforms.

### Step 3: Distribute!
Find your executables in the `dist/` folder and share them with players!

---

## 📁 Folder Structure

Your final folder should look like:
```
your-game/
├── server.js              ← Keep this
├── package.json           ← Keep this
├── build.sh / build.bat   ← Keep this
├── README.md              ← Keep this
├── PLAYER_GUIDE.md        ← Share with players
├── index.html             ← YOUR main game file
├── style.css              ← YOUR CSS files
├── game.js                ← YOUR JavaScript files
├── other-script.js        ← Any other JS files
├── assets/                ← YOUR asset folders
│   ├── images/
│   ├── sounds/
│   └── fonts/
└── dist/                  ← Created after building
    ├── my-html-game-win.exe
    ├── my-html-game-macos
    └── my-html-game-linux
```

---

## 💡 Two Distribution Options

### Option A: Single Executable (Easiest for Players)
**File size:** ~40-50 MB per platform
**What to share:** Just the executable from `dist/` folder

✅ Pros:
- Players just double-click and play
- No installation needed
- Works offline

❌ Cons:
- Larger download size
- One executable per platform

**Best for:** Games under 100MB total, casual distribution

### Option B: Lightweight Launcher + Game Files
**File size:** Launcher is tiny (~5-10 KB), plus your game files
**What to share:** 
- Game folder with all files
- `start-game.bat` (Windows) or `start-game.sh` (Mac/Linux)
- Simple instructions

✅ Pros:
- Much smaller download
- Easy to update (just replace game files)
- Players can see/modify files if needed

❌ Cons:
- Requires Node.js installed
- Slightly more complex for players

**Best for:** Larger games, frequent updates, developer-friendly distribution

---

## 🛠️ Testing Before Distribution

Always test before building:

```bash
# Windows
npm start

# Mac/Linux
npm start
```

This opens your game at http://localhost:8080

Check for:
- ✓ All assets load correctly
- ✓ No CORS errors in console
- ✓ All features work
- ✓ Game plays smoothly

---

## 🎨 Customization

### Change Game Name
Edit `package.json`:
```json
"name": "your-awesome-game"
```
This changes the executable name to `your-awesome-game-win.exe`, etc.

### Change Port
Edit `server.js`, line 7:
```javascript
const PORT = 8080; // Change to any available port
```

### Add More File Types
If you use unusual file types, add them to `package.json` under `"assets"`:
```json
"assets": [
  "**/*.html",
  "**/*.myCustomExtension"
]
```

### Customize Server
The `server.js` file is fully customizable. You can:
- Add custom routes
- Implement basic authentication
- Add logging
- Modify MIME types

---

## 📤 Distribution Checklist

Before sharing your game:

- [ ] Tested locally with `npm start`
- [ ] Replaced sample files with your actual game
- [ ] Built executables for target platforms
- [ ] Tested each executable
- [ ] Included PLAYER_GUIDE.md or wrote custom instructions
- [ ] Checked file sizes are reasonable
- [ ] Tested on a clean machine (if possible)

---

## 🐛 Common Issues & Solutions

### "Port 8080 already in use"
**Solution:** Change the port in `server.js` to 8081, 3000, or any unused port.

### "Cannot find module"
**Solution:** Make sure you ran `npm install` before building.

### Executable is 50+ MB
**This is normal!** It includes Node.js runtime. Consider Option B for smaller size.

### Game files don't load
**Solution:** 
- Check all file paths are relative (no `C:/` or `/Users/` absolute paths)
- Make sure files are in same folder as executable
- Check file names match exactly (case-sensitive on Mac/Linux)

### Mac says "unidentified developer"
**Solution:** Users need to right-click > Open (first time only)

### Assets load locally but not in executable
**Solution:** Add the file extension to `package.json` in the `"assets"` array

---

## 🎯 Best Practices

1. **Keep file paths relative** - Use `./assets/image.png` not `C:/game/assets/image.png`
2. **Test thoroughly** - Run the executable on a different computer if possible
3. **Include README** - Players will have questions, answer them upfront
4. **Version your builds** - Name files like `mygame-v1.0-win.exe`
5. **Provide both options** - Some players prefer executables, others prefer lightweight
6. **Compress for distribution** - Zip the executable before sharing
7. **Check file sizes** - If game is huge, consider hosting assets online

---

## 🌐 Advanced: Online Assets

For very large games, you can host assets online:

1. Upload large files (images, sounds) to a CDN or server
2. Update your game code to load from URLs
3. Distribute a much smaller executable

This way, the executable stays small and assets download on-demand.

---

## 📚 Additional Resources

- **Node.js Documentation:** https://nodejs.org/docs
- **pkg Documentation:** https://github.com/vercel/pkg
- **HTML5 Game Dev:** https://developer.mozilla.org/en-US/docs/Games

---

## ❓ Need Help?

If you run into issues:

1. Check the README.md for detailed docs
2. Verify you're running Node.js v18 or higher: `node --version`
3. Make sure all game files are in the correct location
4. Test with the sample game first to verify setup works
5. Check the console for error messages

---

## 🎉 You're Ready!

That's it! You now have everything you need to package and distribute your HTML5 game. Good luck with your game launch! 🚀

---

*Created with ❤️ for game developers who want easy distribution*
*Gerado com Claude.ai*
