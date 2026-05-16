# Plink

Plink is a small, local-first school planner for students who would like their deadlines to stop lurking in ten different places.

It helps you track courses, assignments, exams, reminders, goals, readings, videos, and planned study sessions. The general idea is simple: put school things in one place, then let Plink tell you what deserves your attention next.

## What Plink Does

- Shows a Dashboard with Today, Next Work, study sessions, workload, and quick notes.
- Keeps each course organized without making grades the emotional centerpiece of your week.
- Lets you add assignments, exams, reminders, goals, courses, and study sessions from one `+ Add` button.
- Gives you a calendar month view for planning when work actually happens.
- Lets you mark work as submitted, read, completed, or done so finished items politely leave the stage.
- Includes a guided tutorial, because mystery buttons are only fun in escape rooms.
- Behaves like an installable mobile web app when hosted online and added to an iPhone Home Screen.

## Running Plink

For the simple Windows app version, run:

```text
dist\Plink.exe
```

That opens Plink and copies the app files to:

```text
%LOCALAPPDATA%\SchoolPlanner
```

This keeps the app's local browser storage stable, which is where your planner data lives.

For the installer version, run:

```text
dist\PlinkInstaller.exe
```

The installer places Plink in your local app data folder and creates a Desktop shortcut.

## iPhone And PWA Mode

Plink is now PWA-ready. When hosted from a public HTTPS URL, iPhone users can open Plink in Safari, tap Share, choose Add to Home Screen, and launch it like a tiny app-shaped academic conscience.

The mobile shell uses:

- `manifest.json` for app name, icon, theme color, and standalone display.
- iOS web app meta tags for Home Screen behavior.
- `service-worker.js` for offline app-shell loading when Plink is hosted over HTTPS or localhost.
- Safe-area spacing for iPhone notches and home indicators.
- Touch-friendly buttons, mobile modals, and compact calendar cells.

The Windows `.exe` still works the same way. The iPhone version is for a hosted copy of Plink, not the Windows installer. Phones are powerful, but they remain deeply unimpressed by `.exe` files.

## Publishing Updates

Plink has a Phase 1 update checker. That means it can look online, see that a newer version exists, and send the user to your new installer. It will not silently replace files while anyone is mid-homework spiral.

To publish an update:

1. Build a fresh `dist\PlinkInstaller.exe`.
2. Upload it somewhere public, such as GitHub Releases or your own download page.
3. Publish a public `latest.json` file.
4. Put that `latest.json` URL in `plink-update.js`.
5. Rebuild and ship that version of Plink.

The manifest should look like this:

```json
{
  "version": "0.2.1",
  "downloadUrl": "https://example.com/PlinkInstaller.exe",
  "notes": [
    "iPhone-ready PWA shell.",
    "Offline app loading for hosted installs.",
    "Mobile layout polish."
  ],
  "releasedAt": "2026-05-15"
}
```

The app compares that online `version` to the installed version in `plink-update.js`. If the online version is newer, users see an update notice and a download button.

Planner data should stay safe during updates as long as the storage key and install location stay the same. In other words: update the app, do not punt the user's planner into the sun.

## Running From The Source Folder

You can also open:

```text
index.html
```

directly in a browser. No server is required for normal planning.

If you want the local preview URL instead, run:

```powershell
node .\server.mjs
```

Then open:

```text
http://127.0.0.1:5177
```

## Your Data

Plink stores planner data locally in your browser's local storage. It does not require an account, cloud sync, or a password you will forget at the worst possible moment.

New installs start empty. Your courses and assignments are yours to add manually.

## Planning Notes

Calendar planning works by clicking a day, choosing an assignment, and setting a time. Plink turns that into a study session so your week becomes a plan instead of a vague concern.

Dashboard due counts focus on actual due-work items like assignments, quizzes, discussions, exams, essays, and projects. Reading and video items still show where useful, but they do not inflate the main due count.

## Tiny Philosophy

Plink is not here to judge your GPA, optimize your entire personality, or ask you to become a productivity influencer.

It is here to answer one question:

```text
What should I do next?
```

Tiny signal. Tiny impact. Find your flow.
