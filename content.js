chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateTheme') {
    const theme = message.theme;

    // Remove existing themes
    document.body.classList.remove('dark-theme', 'osu-theme', 'midnight-theme', 'image-theme');

    // Remove the previously linked CSS file if it exists
    const existingLink = document.getElementById('themeStylesheet');
    if (existingLink) {
      existingLink.remove();
    }

    // Clear the background image
    document.body.style.backgroundImage = 'none';

    if (theme !== 'no-theme') {
      // Add the new theme class
      document.body.classList.add(theme);

      // Create a new <link> element to load the external CSS file
      const link = document.createElement('link');
      link.id = 'themeStylesheet';
      link.rel = 'stylesheet';
      link.type = 'text/css';

      // Set the href dynamically to load the corresponding CSS file from the css directory
      link.href = chrome.runtime.getURL(`css/${theme}.css`);

      // Append the link element to the document head
      document.head.appendChild(link);

      // For image-theme, also set the background image dynamically
      if (theme === 'image-theme') {
        chrome.storage.sync.get(['backgroundURL'], (result) => {
          const backgroundURL = result.backgroundURL || '';
          if (backgroundURL) {
            // Set the background image
            document.body.style.backgroundImage = `url(${backgroundURL})`;

            // Create and apply the image-theme CSS file
            const imageThemeLink = document.createElement('link');
            imageThemeLink.id = 'imageThemeStylesheet';
            imageThemeLink.rel = 'stylesheet';
            imageThemeLink.type = 'text/css';
            imageThemeLink.href = chrome.runtime.getURL('css/image-theme.css');
            document.head.appendChild(imageThemeLink);
          } else {
            // Fallback in case no background URL is set
            document.body.style.backgroundImage = 'none';
          }
        });
      }
    }
  }
});

// Apply the theme based on stored setting when the page loads
chrome.storage.sync.get(['theme', 'backgroundURL'], (result) => {
  const theme = result.theme || 'no-theme';
  
  if (theme !== 'no-theme') {
    document.body.classList.add(theme);
    
    // Create and apply the external CSS file
    const link = document.createElement('link');
    link.id = 'themeStylesheet';
    link.rel = 'stylesheet';
    link.type = 'text/css';

    // Set the href dynamically to load the corresponding CSS file from the css directory
    link.href = chrome.runtime.getURL(`css/${theme}.css`);

    document.head.appendChild(link);

    // For image-theme, also set the background image dynamically
    if (theme === 'image-theme') {
      const backgroundURL = result.backgroundURL || '';
      if (backgroundURL) {
        document.body.style.backgroundImage = `url(${backgroundURL})`;
        document.body.style.backgroundSize = 'auto'; // Adjust background size as needed

        // Create and apply the image-theme CSS file
        const imageThemeLink = document.createElement('link');
        imageThemeLink.id = 'imageThemeStylesheet';
        imageThemeLink.rel = 'stylesheet';
        imageThemeLink.type = 'text/css';
        imageThemeLink.href = chrome.runtime.getURL('css/image-theme.css');
        document.head.appendChild(imageThemeLink);
      } else {
        // Fallback in case no background URL is set
        document.body.style.backgroundImage = 'none';
      }
    }
  }
});
