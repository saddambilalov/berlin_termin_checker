chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'play-alert') {
      const audio = new Audio(chrome.runtime.getURL('alert.mp3'));
      audio.play();
    }
  });
  