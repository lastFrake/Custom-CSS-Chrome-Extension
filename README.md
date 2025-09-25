<h1>
  <img src="src/assets/icon.png" alt="icon" width="48" height="48" style="vertical-align:middle;margin-right:8px">
  Custom CSS Chrome Extension
</h1>

A Chrome extension that allows you to inject custom CSS on specific websites.

## Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" in the top right.
4. Click "Load unpacked" and select the folder containing this extension.

## Usage

1. Click the extension icon in the toolbar.
2. The popup shows the current page's domain — it is filled automatically.
3. Enter or edit your custom CSS in the editor.
4. Click "Save". The CSS is applied to the active tab immediately (no reload required).
5. To remove the custom CSS for this site, clear the editor and click "Save".

## Features

- Inject custom CSS on any specified domain.
- Settings are saved and persist across browser sessions.

## Permissions

- `storage`: To save your domain and CSS settings.

## Example Usage

### Trovo.live Chat Svistelki-Perdelki Cleaner

This example shows how to customize the Trovo.live streaming platform interface to create a cleaner chat experience:

**Domain:** `trovo.live`

**What this CSS does:**
- Hides unnecessary UI elements (carousels, headers, gift messages, decorative overlays)
- Improves chat readability by removing visual clutter
- Widens the chat panel for better message visibility
- Adds proper spacing between messages

```css
.carousel-wrap.T2B,
.slide-right-panel .chat-header,
.slide-right-panel .gift-rank-header,
.slide-right-panel .welcome-text.history,
.slide-right-panel .pin-top,
.slide-right-panel .medal-list .medal-info:not([data-resource-name="moderator"]),
.slide-right-panel *[data-type="5007"],
.slide-right-panel .message.gift-message,
.slide-right-panel .message .content-wrap>span:nth-of-type(1),
.popout-container .chat-header,
.popout-container .gift-rank-header,
.popout-container .welcome-text.history,
.popout-container .pin-top,
.popout-container .medal-list .medal-info:not([data-resource-name="moderator"]),
.popout-container *[data-type="5007"],
.popout-container .message.gift-message,
.popout-container .message .content-wrap>span:nth-of-type(1),
.pendant-overlay {
  display: none !important;
}

.slide-right-panel .chat-list,
.popout-container .chat-list {
  padding-top: 10px !important;
}

.slide-right-panel {
  width: 450px !important;
}

.message .content-wrap .content {
  display: block;
  width: 100%;
  clear: both;
  padding-bottom: 6px;
}
```

**How to apply:**
1. Go to any Trovo.live stream page
2. Click the extension icon
3. Paste the CSS code above into the editor
4. Click "Save" to apply the changes instantly