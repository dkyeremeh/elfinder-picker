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
   * @param {Object} file - File object from elFinder
   * @param {string} file.url - File URL
   * @param {string} file.name - File name
   * @param {string} file.type - Type of file: 'file' | 'image' | 'media'
   */
  onSelect(file) {
    let url, reg, info;

    // URL normalization
    url = file.url;
    reg = /\/[^/]+?\/\.\.\//;
    while (url.match(reg)) {
      url = url.replace(reg, '/');
    }

    // Make file info
    info = file.name;

    // Get type from file object or fallback to stored meta or default to 'file'
    const type = file.type || (this.meta && this.meta.type) || 'file';

    // Provide file and text for the link dialog
    if (type === 'file') {
      this.callback(url, { text: info, title: info });
    }

    // Provide image and alt text for the image dialog
    if (type === 'image') {
      this.callback(url, { alt: info });
    }

    // Provide alternative source and posted for the media dialog
    if (type === 'media') {
      this.callback(url);
    }

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

// Also export a function to create a singleton instance (for backward compatibility)
let defaultInstance = null;

export function createPicker(config) {
  return new ElFinderPicker(config);
}

export function getDefaultInstance(config) {
  if (!defaultInstance) {
    defaultInstance = new ElFinderPicker(config);
  }
  return defaultInstance;
}
