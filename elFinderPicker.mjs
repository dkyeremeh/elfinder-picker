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
  }

  /**
   * Open the file picker
   * @param {Function} cb - Callback function that receives (url, info)
   * @param {*} v - Value (for compatibility)
   * @param {Object} m - Meta information (filetype: 'file' | 'image' | 'media')
   * @returns {HTMLElement} The popup element
   */
  open(cb, v, m) {
    this.callback = cb;
    this.meta = m;

    if (this.popup) {
      this.show();
    } else {
      this.createPopup();
    }
    return this.popup;
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
   * Handle file insertion from elFinder
   * @param {Object} file - File object from elFinder
   * @param {string} file.url - File URL
   * @param {string} file.name - File name
   */
  oninsert(file) {
    let url, reg, info;

    this.meta = this.meta || { filetype: 'file' };

    // URL normalization
    url = file.url;
    reg = /\/[^/]+?\/\.\.\//;
    while (url.match(reg)) {
      url = url.replace(reg, '/');
    }

    // Make file info
    info = file.name;

    // Provide file and text for the link dialog
    if (this.meta.filetype === 'file') {
      this.callback(url, { text: info, title: info });
    }

    // Provide image and alt text for the image dialog
    if (this.meta.filetype === 'image') {
      this.callback(url, { alt: info });
    }

    // Provide alternative source and posted for the media dialog
    if (this.meta.filetype === 'media') {
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
    if (this.popup && this.popup.parentNode) {
      this.popup.parentNode.removeChild(this.popup);
      this.popup = null;
    }
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
