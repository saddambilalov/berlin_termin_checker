// Background script to check for appointments even when not on the website
const TARGET_URL = 'https://service.berlin.de/dienstleistung/351180/';
const CHECK_INTERVAL = 0.5; // 30 seconds in minutes for alarms API

// Keep track of the last time we found appointments to avoid duplicate alerts
let lastAlertTime = 0;

async function ensureOffscreenDocument() {
  const exists = await chrome.offscreen.hasDocument();
  if (!exists) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
      justification: 'Play audio alert when appointment is found',
    });
  }
}

// Function to check for appointments
async function checkForAppointments() {
  try {
    const response = await fetch(TARGET_URL);
    const text = await response.text();

    // Count occurrences of "Termin buchen"
    const matches = text.match(/<a[^>]*>Termin buchen<\/a>/g);    
    const count = matches ? matches.length : 0;
    console.log(`[${new Date().toISOString()}] Found ${count} occurrences of 'Termin buchen'.`);    
    // If more than one appointment is available
    if (count > 2) {
      try {
        // Avoid duplicate alerts within 5 minutes
        const now = Date.now();
        if (now - lastAlertTime > 5 * 60 * 1000) {
          lastAlertTime = now;
          
          // Play sound
          await ensureOffscreenDocument();
          chrome.runtime.sendMessage({ type: 'play-alert' });
          
          // Create notification
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Berlin Termin Available!',
            message: `${count-2} appointments found! Click to open.`,
            priority: 2
          });
          
          // Open the page in a new tab
          chrome.tabs.create({ url: TARGET_URL });
        }
      } catch (e) {
        console.error('Error creating notification:', e);
      }
    }
  } catch (error) {
    console.error('Error checking for appointments:', error);
  }
}

// Listen for notification clicks
chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({ url: TARGET_URL });
});

// Function to set up the alarm
function setupAlarm() {
  chrome.alarms.create('checkAppointments', {
    periodInMinutes: CHECK_INTERVAL
  });
}

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkAppointments') {
    checkForAppointments();
  }
});

// Check immediately when extension is loaded
checkForAppointments();

// Set up the alarm for periodic checking
setupAlarm();

// Re-register the alarm when the service worker wakes up
chrome.runtime.onStartup.addListener(() => {
  setupAlarm();
});

// Also re-register on installation
chrome.runtime.onInstalled.addListener(() => {
  setupAlarm();
});
