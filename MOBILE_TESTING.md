# Mobile And PWA Testing

This is the practical Plink test path when you are on a Windows PC and do not have a Mac standing by with Xcode and a tiny smug aura.

## What You Can Test On PC

- Phone-sized layout
- Touch target spacing
- Dashboard, Courses, Calendar, and Add menu flow
- Modals at iPhone widths
- Manifest loading
- Service worker registration over `http://127.0.0.1`
- Offline app-shell behavior after the first load
- Update-checker UI

## What Needs A Real iPhone

- Safari's exact Add to Home Screen behavior
- Standalone PWA launch from the Home Screen
- iOS safe-area/notch feel
- Real iOS scrolling quirks
- Native iOS app packaging through Xcode or a Mac build service
- Native notifications and haptics later

## Local PC Test

From PowerShell:

```powershell
cd "C:\Users\Tyler\OneDrive\Documents\New project\school-planner"
node .\server.mjs
```

Open:

```text
http://127.0.0.1:5177/
```

Then in Edge or Chrome:

1. Press `F12`.
2. Click the phone/tablet icon.
3. Pick an iPhone device, or use a custom size like `390 x 844`.
4. Refresh the page while device mode is active.

## PC Checklist

- Dashboard fits without sideways scrolling.
- Top navigation wraps cleanly.
- `+ Add` menu opens and stays inside the screen.
- Tutorial lightbulb opens the guided tour.
- Tutorial spotlight does not cover the buttons you need.
- Course modal fits and scrolls.
- Assignment modal fits and scrolls.
- Date and time fields stack nicely.
- Calendar month view stays usable.
- Empty calendar days do not show filler text.
- Add a fake course and assignment.
- Refresh and confirm the fake data stays.

## Offline Shell Test

After loading Plink once from `http://127.0.0.1:5177/`:

1. Open DevTools.
2. Go to the Application tab.
3. Check Service Workers and confirm `service-worker.js` is registered.
4. In the Network tab, choose Offline.
5. Refresh.

Expected result: Plink should still load the app shell. Data storage still belongs to the browser, so this is testing the app files, not cloud sync.

## iPhone PWA Test

After GitHub Pages is enabled, open this in Safari on iPhone:

```text
https://poesaidun.github.io/Plink/
```

Then:

1. Tap Share.
2. Tap Add to Home Screen.
3. Tap Add.
4. Open Plink from the new Home Screen icon.

## iPhone Checklist

- App opens without Safari browser chrome.
- Plink icon appears correctly.
- Dashboard feels comfortable one-handed.
- Add menu is easy to tap.
- Modals are scrollable.
- Calendar is readable enough to use.
- Add a fake item, close the app, reopen it, and confirm it stays.

## Native App Reality Check

The PWA can be tested from Windows and iPhone Safari. A true App Store/TestFlight iOS app still needs Xcode, which means a Mac or cloud Mac build service. PC testing gets the mobile web app into shape before that step, which saves future pain and probably several dramatic sighs.
