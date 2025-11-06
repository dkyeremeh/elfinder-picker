'use strict';

/**
 * elFinder Picker v2.0.0
 * A modern ESM file picker for elFinder
 */

// Import CSS styles
import './elFinderPicker.css';

class ElFinderPicker {
  constructor(config = {}) {
    this.settings = {
      url: config.url || '',
    };
    this.callback = null;
    this.meta = null;
    this.popup = null;
    this.iframe = null;
    this._messageHandler = this._handleMessage.bind(this);
  }

  /**
   * Handle postMessage from iframe
   * @private
   */
  _handleMessage(event) {
    // Security check - verify message is from our iframe
    if (!this.iframe || event.source !== this.iframe.contentWindow) return;

    // Check if this is an elFinder file selection
    if (event.data && event.data.action === 'FILE_SELECTED' && event.data.file) {
      this.onSelect(event.data.file);
    }
  }

  /**
   * Open the file picker
   * @param {Function} cb - Callback function that receives (url, info)
   * @param {*} v - Value (for compatibility)
   * @param {Object} m - Meta information (type: 'file' | 'image' | 'media')
   * @returns {HTMLElement} The popup element
   */
  open(cb, v, m) {
    this.callback = cb;
    this.meta = m;

    if (this.popup) this.show();
    else {
      this.createPopup();
      window.addEventListener('message', this._messageHandler);
    }
  }

  /**
   * Create the popup DOM structure
   * @private
   */
  createPopup() {
    const popupHTML = `
      <div class='elfinder-picker'>
        <div class='elfinder-picker-backdrop'></div>
        <div class='elfinder-picker-content'>
          <h3 class='elfinder-picker-title'>File Manager</h3>
          <div class='elfinder-picker-close'>&times;</div>
          <iframe class='elfinder-picker-iframe' src='${this.settings.url}' allowfullscreen data-mode='select'></iframe>
        </div>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = popupHTML.trim();
    this.popup = tempDiv.firstChild;

    document.body.appendChild(this.popup);

    // Store reference to iframe for postMessage communication
    this.iframe = this.popup.querySelector('.elfinder-picker-iframe');

    // Add event listeners
    const closeBtn = this.popup.querySelector('.elfinder-picker-close');
    const backdrop = this.popup.querySelector('.elfinder-picker-backdrop');

    closeBtn.addEventListener('click', () => this.close());
    backdrop.addEventListener('click', () => this.close());
  }

  /**
   * Show the popup
   * @private
   */
  show() {
    if (this.popup) {
      this.popup.style.display = 'block';
    }
  }

  /**
   * Handle file selection from elFinder
   * @param {Object} file - Raw file object from elFinder
   * @param {string} file.url - File URL
   * @param {string} file.name - File name
   * @param {string} file.mime - MIME type (e.g., 'image/jpeg', 'application/pdf')
   */
  onSelect(file) {
    // URL normalization
    let url = file.url;
    const reg = /\/[^/]+?\/\.\.\//;
    while (url.match(reg)) {
      url = url.replace(reg, '/');
    }

    // Create normalized file object with clean data
    const normalizedFile = {
      url: url,
      name: file.name,
      mime: file.mime || 'application/octet-stream'
    };

    // Return raw file data - let the user decide how to handle it
    this.callback(normalizedFile);

    this.close();
  }

  /**
   * Close the popup
   */
  close() {
    if (this.popup) {
      this.popup.style.display = 'none';
    }
  }

  /**
   * Destroy the popup and clean up
   */
  destroy() {
    // Remove message listener
    window.removeEventListener('message', this._messageHandler);

    if (this.popup && this.popup.parentNode) {
      this.popup.parentNode.removeChild(this.popup);
      this.popup = null;
    }
    this.iframe = null;
    this.callback = null;
    this.meta = null;
  }
}

// Export the class as default
export default ElFinderPicker;

/**
 * Helper function for elFinder's getFileCallback
 * Use this directly in your elFinder configuration
 *
 * @param {Object} file - File object from elFinder
 * @param {Object} fm - elFinder instance
 * @param {Object} options - Optional configuration
 * @param {string} options.origin - Target origin for postMessage (default: '*')
 * @example
 * // In your elFinder page:
 * import { filePickerCallback } from 'elfinder-picker';
 *
 * $('#elfinder').elfinder({
 *   url: '/connector.php',
 *   getFileCallback: filePickerCallback
 * });
 */
export function filePickerCallback(file, fm, options = {}) {
  // Check if we're in an iframe (select mode)
  if (!window.parent || window.parent === window) {
    return; // Not in iframe, do nothing
  }

  const origin = options.origin || '*';

  // Send file data to parent window
  window.parent.postMessage({
    action: 'FILE_SELECTED',
    file: {
      url: file.url,
      name: file.name,
      mime: file.mime || 'application/octet-stream'
    }
  }, origin);
}

/**
 * Create a configured file picker callback with custom options
 *
 * @param {Object} options - Configuration options
 * @param {string} options.origin - Target origin for postMessage (for production security)
 * @returns {Function} Configured callback function
 * @example
 * import { createFilePickerCallback } from 'elfinder-picker';
 *
 * const callback = createFilePickerCallback({
 *   origin: 'https://yourdomain.com'
 * });
 *
 * $('#elfinder').elfinder({
 *   url: '/connector.php',
 *   getFileCallback: callback
 * });
 */
export function createFilePickerCallback(options = {}) {
  return function(file, fm) {
    filePickerCallback(file, fm, options);
  };
}
