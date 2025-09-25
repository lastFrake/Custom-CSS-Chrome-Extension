// content.js - inject saved CSS for current hostname and respond to updates from popup
(function() {
    const STYLE_ID_PREFIX = 'custom-css-inject-';

    function applyCssForHostname(css) {
        removeExistingStyle();
        if (!css) return;
        const style = document.createElement('style');
        style.id = STYLE_ID_PREFIX + window.location.hostname;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function removeExistingStyle() {
        const existing = document.getElementById(STYLE_ID_PREFIX + window.location.hostname);
        if (existing) existing.remove();
    }

    // Initial load
    chrome.storage.sync.get(null, function (result) {
        if (result && result[window.location.hostname]) {
            applyCssForHostname(result[window.location.hostname]);
        }
    });

    // Listen for messages from popup to update/remove CSS for this tab
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (!message || !message.action) return;
        if (message.action === 'get-hostname') {
            // reply with hostname so popup can show it
            sendResponse({ hostname: window.location.hostname });
            return; // keep synchronous response
        }
        if (message.action === 'update-css' && message.domain === window.location.hostname) {
            applyCssForHostname(message.css);
        } else if (message.action === 'remove-css' && message.domain === window.location.hostname) {
            removeExistingStyle();
        }
    });
})();
