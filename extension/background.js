// Listen for when the extension's icon is clicked
chrome.action.onClicked.addListener((tab) => {
  // Ensure the tab and its URL are defined before proceeding
  if (tab && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.storage.local.get('theme', (data) => {
      let currentTheme = data.theme || 'dark-theme';

      // Determine the next theme
      let nextTheme;
      if (currentTheme === 'dark-theme') {
        nextTheme = 'osu-theme';
      } else if (currentTheme === 'osu-theme') {
        nextTheme = 'midnight-theme';
      } else {
        nextTheme = 'dark-theme'; // If it's midnight-theme or none, switch to dark-theme
      }

      // Store the new theme preference in local storage
      chrome.storage.local.set({ theme: nextTheme }, () => {
        // Execute the content script to update the theme
        if (tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (theme) => {
              chrome.runtime.sendMessage({ action: 'updateTheme', theme: theme });
            },
            args: [nextTheme]
          });
        } else {
          console.error('No valid tab found for executing the script.');
        }
      });
    });
  } else {
    console.error('Cannot execute script on a chrome:// URL or invalid tab.');
  }
});

// Restore theme preference when the extension is loaded
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('theme', (data) => {
    let theme = data.theme || 'dark-theme'; // Default to dark-theme if no preference is set

    // Query the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id && tabs[0].url && !tabs[0].url.startsWith('chrome://')) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: (theme) => {
            chrome.runtime.sendMessage({ action: 'updateTheme', theme: theme });
          },
          args: [theme]
        });
      } else {
        console.error('Cannot execute script on a chrome:// URL or no valid tab found.');
      }
    });
  });
});
