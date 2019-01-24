'use strict';

let isPanelCreated = false;

// Check if Mezzurite has loaded every second
const intervalMs = 1000;
const mezzuriteLoadCheckInterval = setInterval(
  createPanelIfMezzuriteLoaded,
  intervalMs);

/// /////////////////////////////

/**
 * Creates the Mezzurite panel in the Chrome Developer Tools page.
 */
function createPanel () {
  const title = 'Mezzurite';
  const iconPath = null;
  const pagePath = 'devpanel.html'; // Relative path is apparently determined from the manifest.json's position
  chrome.devtools.panels.create(title, iconPath, pagePath, function (panel) {
    console.log('The Mezzurite panel in DevTools was created!');
  });
}

/**
 * This is a callback function signature for handling the response that
 * is asynchronously returned by `chrome.devtools.inspectedWindow.eval()`.
 * @callback evalCallback
 * @param {Object} result - The result of the evaluated statement.
 * @param {Object} exceptionInfo - The exception details, if present.
 */

/**
 * Attempts to verify if the object: `window.mezzurite` exists in the inspected window.
 * @param {evalCallback} callback - The callback that handles the response.
 */
function checkMezzurite (callback) {
  const expression = `window.mezzurite != null`;
  chrome.devtools.inspectedWindow.eval(expression, callback);
}

/**
 * Creates the `Mezzurite` panel in the DevTools page if Mezzurite
 * is present on the inspected page.
 */
function createPanelIfMezzuriteLoaded () {
  if (isPanelCreated) {
    return;
  }

  checkMezzurite((found, exceptionInfo) => {
    if (!found) {
      return;
    }

    console.log('Mezzurite was found!');

    // Stop checking for Mezzurite every second, as we have found it.
    clearInterval(mezzuriteLoadCheckInterval);
    isPanelCreated = true;

    createPanel();
  });
}