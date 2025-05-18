# Berlin Termin Checker

A Chrome extension that automatically checks for available appointments on Berlin's service portal and alerts you when they become available.

## What it does

- Checks the Berlin service portal every 30 seconds for available appointments
- Plays a sound alert when appointments are found
- Shows a browser notification
- Opens the appointment page automatically
- Works in the background - no need to keep the website open

## Installation

1. Download or clone this repository to your computer
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension is now installed and will start checking for appointments automatically

## Configuration

- The extension is pre-configured to check for appointments every 30 seconds
- It will alert you when more than one "Termin buchen" option is found
- The alert includes a sound, notification, and automatically opening the page

## Files

- `manifest.json`: Extension configuration
- `background.js`: Main script that checks for appointments
- `play-sound.html`: Helper page for playing alert sounds
- `alert.mp3`: Sound file played when appointments are found
- `icon.png`: Extension icon

## Troubleshooting

- Make sure notifications are enabled for Chrome
- If you don't hear sound alerts, check your system's sound settings
- The extension will avoid sending duplicate alerts within 5 minutes

## License

This project is open source and available for personal use.