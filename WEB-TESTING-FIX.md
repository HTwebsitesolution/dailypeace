# Fix: Web App Not Opening at localhost:8081

## The Issue
When you run `npm start`, the web version should be available at `http://localhost:8081`, but it might not be opening automatically or showing the right content.

## Solutions

### Solution 1: Press 'w' Key in Terminal ⭐ RECOMMENDED
1. Make sure the Expo dev server is running
2. In the terminal where Expo is running, press the `w` key
3. This should open your browser automatically to the web version

### Solution 2: Manual Browser Navigation
1. Make sure Expo dev server is running
2. Open your browser manually
3. Navigate to: `http://localhost:8081`
4. Wait for the page to load (might take a few seconds for first bundle)

### Solution 3: Use the Web Command Directly
Instead of `npm start`, use:
```bash
cd dailypeace
npm run web
```
This specifically starts Expo with web support and should open the browser automatically.

### Solution 4: Check What's Running
If you see the API documentation page instead of the app, you might be accessing the wrong server:
- **Wrong:** `http://localhost:8081` showing API docs (static HTML)
- **Right:** `http://localhost:8081` showing the React Native Web app

Make sure you're running from the `dailypeace` folder, not the root folder.

---

## Step-by-Step: Proper Web Testing

1. **Stop any running servers** (Ctrl+C in terminal)

2. **Navigate to correct directory:**
   ```bash
   cd C:\dailypeace-starter\dailypeace
   ```

3. **Start Expo with web:**
   ```bash
   npm run web
   ```

4. **Wait for bundle to complete:**
   - You should see: "Web Bundled" in the terminal
   - Browser should open automatically
   - If not, manually go to the URL shown

5. **If it still doesn't work:**
   - Check browser console (F12) for errors
   - Make sure no other process is using port 8081
   - Try a different browser
   - Check if JavaScript is enabled

---

## Troubleshooting

### "Port 8081 already in use"
Kill the process using that port:
```powershell
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### "Cannot GET /"
- Make sure you're accessing `http://localhost:8081` (not `/index.html`)
- Wait for the bundle to complete
- Check terminal for any error messages

### "Blank page or errors"
- Open browser DevTools (F12)
- Check Console tab for JavaScript errors
- Check Network tab to see if files are loading
- Make sure all dependencies are installed: `npm install`

### "Wrong page showing"
- You might have multiple servers running
- Make sure you're running from `dailypeace` folder
- Check the terminal output to see which directory Expo started from

---

## Expected Behavior

When working correctly:
1. Terminal shows: "Web Bundled" message
2. Browser opens automatically (or you can press 'w')
3. You see the Daily Peace app (dark background, logo, etc.)
4. App should load without crashing (testing our crash fixes!)

---

## Quick Test Command

```bash
# From dailypeace directory
npm run web
```

This is the most reliable way to test the web version!







