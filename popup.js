// Create audio element programmatically
let audioElement = null;

// Function to play the alert sound
function playSound() {
  if (!audioElement) {
    audioElement = new Audio(chrome.runtime.getURL('alert.mp3'));
  }
  
  audioElement.play().catch(e => {
    console.error('Error playing sound:', e);
    // Try creating a new audio element if playback fails
    audioElement = new Audio(chrome.runtime.getURL('alert.mp3'));
    audioElement.play().catch(err => console.error('Second attempt failed:', err));
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'play_sound') {
    playSound();
    return true; // Keep the message channel open for async response
  }
});

// Set up event listener for the test sound button
document.addEventListener('DOMContentLoaded', () => {
  const testButton = document.getElementById('test-sound');
  if (testButton) {
    testButton.addEventListener('click', playSound);
  }
  
  // Create a status display
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = 'Extension active and monitoring for appointments';
  }
});