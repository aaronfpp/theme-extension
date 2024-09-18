document.addEventListener('DOMContentLoaded', () => {
  // Initialize the popup based on stored setting
  chrome.storage.sync.get(['theme'], (result) => {
    const theme = result.theme || 'dark-theme';
    if (theme === 'no-theme') {
      document.getElementById('no-theme').checked = true;
      document.querySelectorAll('input[name="theme"]').forEach(radio => radio.checked = false);
    } else {
      document.getElementById(theme).checked = true;
      updateBackgroundColor(theme); // Update background color on load
    }
  });
});

document.querySelectorAll('input[name="theme"]').forEach((radio) => {
  radio.addEventListener('change', (event) => {
    const selectedTheme = event.target.value;
    if (selectedTheme) {
      chrome.storage.sync.set({ theme: selectedTheme });
      updateBackgroundColor(selectedTheme); // Update background color when theme changes
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
    updateBackgroundColor('no-theme'); // Set background for 'no-theme'
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updateTheme', theme: 'no-theme' });
    });
  } else {
    const selectedTheme = document.querySelector('input[name="theme"]:checked').value || 'dark-theme';
    chrome.storage.sync.set({ theme: selectedTheme });
    updateBackgroundColor(selectedTheme); // Update background color on fallback
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'updateTheme', theme: selectedTheme });
    });
  }
});

// Function to update background color based on theme
function updateBackgroundColor(theme) {
  const body = document.body;
  let secondaryColor = '';

  switch (theme) {
    case 'dark-theme':
      secondaryColor = '#b12124'; // Red for dark theme
      break;
    case 'osu-theme':
      secondaryColor = '#FF7300'; // Orange for osu-theme
      break;
    case 'midnight-theme':
      secondaryColor = '#000000'; // Black for midnight-theme
      break;
    case 'image-theme':
      // For image-theme, handle separately
      secondaryColor = '#ffffff'; // White for image-theme
      break;
    case 'no-theme':
      secondaryColor = '#ffffff'; // White for no-theme
      break;
    default:
      secondaryColor = '#ffffff'; // Default to white if none selected
  }

  // Set the secondary background color in the CSS
  if (theme !== 'image-theme') {
    body.style.setProperty('--c2', secondaryColor);
  }
}

document.getElementById('settingsButton').addEventListener('click', () => {
  chrome.tabs.create({ url: 'settings.html' });
});
