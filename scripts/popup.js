document.addEventListener('DOMContentLoaded', function () {
    const cssEditor = CodeMirror(document.getElementById('css-editor'), {
        mode: 'css',
        lineNumbers: true
    });

    const domainLabel = document.getElementById('current-domain');
    let currentDomain = null;

    // Ask active tab for its hostname (content script will reply).
    // If content script doesn't respond, fallback to extracting hostname from tab URL.
    function requestHostname() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs || !tabs[0]) return;
            const tab = tabs[0];

            // Try message to content script first
            chrome.tabs.sendMessage(tab.id, { action: 'get-hostname' }, function (response) {
                if (!chrome.runtime.lastError && response && response.hostname) {
                    currentDomain = response.hostname;
                    domainLabel.textContent = currentDomain || '(unknown)';
                    if (currentDomain) loadCssForDomain(currentDomain);
                    return;
                }

                // Fallback: parse hostname from tab.url
                try {
                    const url = new URL(tab.url);
                    currentDomain = url.hostname;
                } catch (e) {
                    currentDomain = null;
                }
                domainLabel.textContent = currentDomain || '(unknown)';
                if (currentDomain) loadCssForDomain(currentDomain);
            });
        });
    }

    function loadCssForDomain(domain) {
        chrome.storage.sync.get([domain], function (result) {
            cssEditor.setValue(result[domain] || '');
        });
    }

    function notifyTabUpdate(domain, css) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs[0]) {
                const action = (css && css.length) ? 'update-css' : 'remove-css';
                chrome.tabs.sendMessage(tabs[0].id, { action: action, domain: domain, css: css });
            }
        });
    }

    const statusEl = document.getElementById('status');
    let statusTimer = null;
    function showStatus(text, ms = 1500) {
        if (statusTimer) clearTimeout(statusTimer);
        statusEl.textContent = text;
        statusTimer = setTimeout(() => { statusEl.textContent = ''; statusTimer = null; }, ms);
    }

    document.getElementById('save').addEventListener('click', function () {
        if (!currentDomain) return;
        const css = cssEditor.getValue();
        if (css && css.length) {
            chrome.storage.sync.set({ [currentDomain]: css }, function () {
                showStatus('Saved');
                notifyTabUpdate(currentDomain, css);
            });
        } else {
            // empty -> remove
            chrome.storage.sync.remove([currentDomain], function () {
                showStatus('Removed');
                notifyTabUpdate(currentDomain, '');
            });
        }
    });

    // Initial request
    requestHostname();
});
