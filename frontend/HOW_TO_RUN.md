# How to Run AllerLens on Windows (VS Code + Expo Go)

## Prerequisites

Install the following before you begin:

1. **Node.js** (v18 or later) — https://nodejs.org
   - Choose the LTS version
   - Verify install: open Command Prompt and run `node -v`

2. **Git** — https://git-scm.com/download/win
   - Required to clone the project

3. **Visual Studio Code** — https://code.visualstudio.com
   - Recommended extensions:
     - **ESLint** — code linting
     - **Prettier** — code formatting
     - **React Native Tools** — IntelliSense for React Native

4. **Expo Go** on your phone — install from the App Store (iOS) or Google Play (Android)
   - Make sure it is updated to the latest version

---

## Step 1 — Open the Project in VS Code

1. Copy the `allerlens` project folder to your Windows machine (USB, Google Drive, etc.)
2. Open VS Code
3. Go to **File → Open Folder** and select the `allerlens` folder
4. Open the integrated terminal: **Terminal → New Terminal** (or press `` Ctrl+` ``)

---

## Step 2 — Install Dependencies

In the VS Code terminal, run:

```bash
npm install
```

Wait for it to finish. You should see `added X packages` at the end. Warnings about deprecated packages are normal and can be ignored.

---

## Step 3 — Start the Development Server

In the same terminal, run:

```bash
npx expo start --clear
```

The `--clear` flag wipes the Metro bundler cache, which avoids stale build errors.

After a moment you will see a **QR code** in the terminal and a line like:

```
› Metro: exp://192.168.X.X:8081
```

---

## Step 4 — Open the App in Expo Go

### Option A — Same WiFi Network (Recommended)

1. Make sure your **phone and Windows PC are on the same WiFi network**
2. Open **Expo Go** on your phone
3. Tap **Scan QR Code** and point it at the QR code in the terminal
4. The app will bundle and open on your phone

> **Note:** First load takes 1–2 minutes because Metro is compiling everything fresh. Subsequent loads are instant.

### Option B — Tunnel Mode (If Same-WiFi Doesn't Work)

Use this if you are on a school/office network that blocks device-to-device connections, or if your phone is on mobile data.

```bash
npm install -g @expo/ngrok@^4.1.0
npx expo start --tunnel
```

A new URL starting with `exp://u.expo.dev/...` will appear. Scan that QR code in Expo Go.

> Tunnel mode is slightly slower to load (~30 seconds) but works on any network.

---

## Useful Terminal Commands

| Command | What it does |
|---|---|
| `npx expo start --clear` | Start the dev server (clears cache) |
| `npx expo start --tunnel` | Start with tunnel (bypasses network issues) |
| Press `r` in terminal | Reload the app on the phone |
| Press `m` in terminal | Toggle the in-app developer menu |
| `Ctrl + C` | Stop the server |

---

## Troubleshooting

### "The request timed out" in Expo Go
- Your phone cannot reach the PC's IP address.
- Fix: use `--tunnel` mode (see Option B above), or connect both devices to the same WiFi.

### "Cannot find module 'babel-preset-expo'"
- A dependency is missing. Run `npm install` again, then `npx expo start --clear`.

### "npm audit" shows vulnerabilities
- The remaining vulnerabilities are inside Expo's iOS build tools and do not affect the running app. They are safe to ignore for development.

### App shows a blank screen or red error overlay
- Press `m` in the terminal to open the developer menu on the phone, then tap **Reload**.
- Check the terminal for a red error message — it will say exactly which file and line caused the problem.

### Node.js not recognized / `npm` not found
- Restart VS Code after installing Node.js so the terminal picks up the new PATH.
- Or open a fresh Command Prompt, run `node -v` to confirm it installed, then reopen VS Code.

### Port 8081 already in use
```bash
npx expo start --port 8082
```

---

## Project Structure (Quick Reference)

```
allerlens/
├── App.tsx                        ← App entry point
├── app.json                       ← Expo configuration
├── babel.config.js                ← Babel/transpiler config
├── package.json                   ← Dependencies
└── src/
    ├── theme/colors.ts            ← Color palette
    ├── types/index.ts             ← Shared TypeScript types
    ├── components/
    │   ├── AllergenBadge.tsx      ← Allergen chip component
    │   └── BottomTabBar.tsx       ← Bottom navigation bar
    ├── navigation/
    │   └── AppNavigator.tsx       ← Screen routing
    └── screens/
        ├── SplashScreen.tsx
        ├── CreateProfileScreen.tsx
        ├── EnterNameScreen.tsx
        ├── HomeScreen.tsx
        ├── CameraScreen.tsx
        ├── ProcessingScreen.tsx
        ├── ProfileScreen.tsx
        ├── SafeResultScreen.tsx
        └── WarningResultScreen.tsx
```
