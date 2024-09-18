document.addEventListener('DOMContentLoaded', () => {
  // Initialize the current URL
  chrome.storage.sync.get(['backgroundURL'], (result) => {
    const backgroundURL = result.backgroundURL || 'None';
    document.getElementById('background-input').value = backgroundURL;
    document.getElementById('currentURL').textContent = backgroundURL;
  });

  // Add example URLs to the list
  const exampleURLs = [
    'https://auth.ifsta.org/images/background_e8.jpg',
    'https://helpdesk.osufpp.org/images/flags.png',
    'https://helpdesk.osufpp.org/images/captcha/snakeskin.png'
  ];

  const exampleURLList = document.getElementById('exampleURLList');
  exampleURLs.forEach(url => {
    const listItem = document.createElement('li');
    listItem.style.display = 'flex'; // Ensure that the button and URL align properly
    listItem.style.alignItems = 'center';
    listItem.style.marginBottom = '10px';

    const urlText = document.createElement('span');
    urlText.textContent = url;
    urlText.style.flex = '1'; // Allow text to take available space
    urlText.style.wordBreak = 'break-all'; // Handle long URLs

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '<i class="fas fa-clipboard"></i>'; // Add Font Awesome icon
    copyButton.dataset.url = url; // Store the URL in a data attribute for easy access
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(url).then(() => {
        showAlert('Copied to clipboard!');
      }).catch(err => {
        showAlert('Failed to copy!');
        console.error('Failed to copy URL: ', err);
      });
    });

    listItem.appendChild(urlText);
    listItem.appendChild(copyButton);
    exampleURLList.appendChild(listItem);
  });

  // Handle the Apply button click
  document.getElementById('applybutton').addEventListener('click', () => {
    const newURL = document.getElementById('background-input').value;
    chrome.storage.sync.set({ backgroundURL: newURL }, () => {
      document.getElementById('currentURL').textContent = newURL;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateTheme' });
      });
    });
  });

  // Handle the Paste button click
  document.getElementById('pastebutton').addEventListener('click', () => {
    navigator.clipboard.readText().then(text => {
      document.getElementById('background-input').value = text;
    }).catch(err => {
      showAlert('Failed to paste!');
      console.error('Failed to read clipboard contents: ', err);
    });
  });
});

// Function to show alert box
function showAlert(message) {
  const alertBox = document.getElementById('alert-box');
  const alertMessage = document.getElementById('alert-message');
  
  alertMessage.textContent = message;
  alertBox.style.display = 'block';
  
  // Automatically hide the alert after 2 seconds
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 2000);
}

// Event listener for alert close button
document.getElementById('alert-close').addEventListener('click', () => {
  document.getElementById('alert-box').style.display = 'none';
});

window.addEventListener('load', () => {
  const boxes = document.querySelectorAll('.title-box, .theme-selector-box, .example-urls-box');
  let maxWidth = 0;

  // Determine the maximum width
  boxes.forEach(box => {
    const width = box.offsetWidth;
    if (width > maxWidth) {
      maxWidth = width;
    }
  });

  // Apply the maximum width to all boxes
  boxes.forEach(box => {
    box.style.width = `${maxWidth}px`;
  });
});
