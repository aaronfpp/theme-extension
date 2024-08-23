document.addEventListener('DOMContentLoaded', () => {
  // Initialize the popup based on stored setting
  chrome.storage.sync.get(['theme'], (result) => {
    const theme = result.theme || 'dark-theme';
    if (theme === 'no-theme') {
      document.getElementById('no-theme').checked = true;
      document.querySelectorAll('input[name="theme"]').forEach(radio => radio.checked = false);
    } else {
      document.getElementById(theme).checked = true;
    }
  });
});

document.querySelectorAll('input[name="theme"]').forEach((radio) => {
  radio.addEventListener('change', (event) => {
    const selectedTheme = event.target.value;
    if (selectedTheme) {
      chrome.storage.sync.set({ theme: selectedTheme });
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateTheme', theme: selectedTheme });
      });
    }
  });
});

document.getElementById('no-theme').addEventListener('change', (event) => {
  const noThemeEnabled = event.target.checked;
  if (noThemeEnabled) {
    chrome.storage.sync.set({ theme: 'no-theme' });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updateTheme', theme: 'no-theme' });
    });
  } else {
    // Ensure at least one theme is selected if 'no-theme' is unchecked
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value || 'dark-theme';
    chrome.storage.sync.set({ theme: selectedTheme });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updateTheme', theme: selectedTheme });
    });
  }
});
