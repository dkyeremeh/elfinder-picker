'use strict';

/**
 * elFinder Picker v2.0.0
 * A modern ESM file picker for elFinder
 */

// Import CSS styles
import './styles.css';

/**
 * Configuration for ElFinderPicker
 */
export interface ElFinderPickerConfig {
  /** URL to the elFinder instance */
  url?: string;
  /** Title displayed in the picker popup (default: 'File Manager') */
  title?: string;
}

/**
 * File object returned by elFinder
 */
export interface ElFinderFile {
  /** File URL */
  url: string;
  /** File name */
  name: string;
  /** MIME type (e.g., 'image/jpeg', 'application/pdf') */
  mime: string;
}

/**
 * Callback function that receives the selected file
 */
export type FilePickerCallback = (file: ElFinderFile) => void;

/**
 * Message data for postMessage communication
 */
interface FileSelectedMessage {
  action: 'FILE_SELECTED';
  file: ElFinderFile;
}

interface NavigateToFileMessage {
  action: 'NAVIGATE_TO_FILE';
  path: string;
}

type PickerMessage = FileSelectedMessage | NavigateToFileMessage;

class ElFinderPicker {
  private settings: { url: string; title: string };
  private callback: FilePickerCallback | null;
  private popup: HTMLElement | null;
  private iframe: HTMLIFrameElement | null;
  private _messageHandler: (event: MessageEvent<PickerMessage>) => void;

  constructor(config: ElFinderPickerConfig = {}) {
    this.settings = {
      url: config.url || '',
      title: config.title || 'File Manager',
    };
    this.callback = null;
    this.popup = null;
    this.iframe = null;
    this._messageHandler = this._handleMessage.bind(this);
  }

  /**
   * Handle postMessage from iframe
   * @private
   */
  private _handleMessage(event: MessageEvent<PickerMessage>): void {
    // Security check - verify message is from our iframe
    if (!this.iframe || event.source !== this.iframe.contentWindow) return;

    // Check if this is an elFinder file selection
    if (event.data && event.data.action === 'FILE_SELECTED' && 'file' in event.data) {
      this.onSelect(event.data.file);
    }
  }

  /**
   * Open the file picker
   * @param cb - Callback function that receives file object
   * @param v - Optional initial file path to navigate to
   * @returns The popup element
   */
  open(cb: FilePickerCallback, v?: string): HTMLElement | null {
    this.callback = cb;

    if (this.popup) {
      this.show();
      // Send navigation message if value provided
      if (v && this.iframe) {
        this._sendNavigationMessage(v);
      }
    } else {
      this.createPopup();
      window.addEventListener('message', this._messageHandler);

      // Send navigation message after iframe loads
      if (v && this.iframe) {
        this.iframe.addEventListener('load', () => {
          // Small delay to ensure elFinder is initialized
          setTimeout(() => this._sendNavigationMessage(v), 500);
        }, { once: true });
      }
    }

    return this.popup;
  }

  /**
   * Send navigation message to iframe
   * @private
   */
  private _sendNavigationMessage(path: string): void {
    if (this.iframe && this.iframe.contentWindow) {
      const message: NavigateToFileMessage = {
        action: 'NAVIGATE_TO_FILE',
        path: path
      };
      this.iframe.contentWindow.postMessage(message, '*');
    }
  }

  /**
   * Create the popup DOM structure
   * @private
   */
  private createPopup(): void {
    const popupHTML = `
      <div class='elfinder-picker'>
        <div class='elfinder-picker-backdrop'></div>
        <div class='elfinder-picker-content'>
          <h3 class='elfinder-picker-title'>${this.settings.title}</h3>
          <div class='elfinder-picker-close'>&times;</div>
          <iframe class='elfinder-picker-iframe' src='${this.settings.url}' allowfullscreen data-mode='select'></iframe>
        </div>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = popupHTML.trim();
    this.popup = tempDiv.firstChild as HTMLElement;

    document.body.appendChild(this.popup);

    // Store reference to iframe for postMessage communication
    this.iframe = this.popup.querySelector('.elfinder-picker-iframe');

    // Add event listeners
    const closeBtn = this.popup.querySelector('.elfinder-picker-close');
    const backdrop = this.popup.querySelector('.elfinder-picker-backdrop');

    closeBtn?.addEventListener('click', () => this.close());
    backdrop?.addEventListener('click', () => this.close());
  }

  /**
   * Show the popup
   * @private
   */
  private show(): void {
    if (this.popup) {
      this.popup.style.display = 'block';
    }
  }

  /**
   * Handle file selection from elFinder
   * @param file - Raw file object from elFinder
   */
  private onSelect(file: ElFinderFile): void {
    // URL normalization
    let url = file.url;
    const reg = /\/[^/]+?\/\.\.\//;
    while (url.match(reg)) {
      url = url.replace(reg, '/');
    }

    // Create normalized file object with clean data
    const normalizedFile: ElFinderFile = {
      url: url,
      name: file.name,
      mime: file.mime || 'application/octet-stream'
    };

    // Return raw file data - let the user decide how to handle it
    if (this.callback) {
      this.callback(normalizedFile);
    }

    this.close();
  }

  /**
   * Close the popup
   */
  close(): void {
    if (this.popup) {
      this.popup.style.display = 'none';
    }
  }

  /**
   * Destroy the popup and clean up
   */
  destroy(): void {
    // Remove message listener
    window.removeEventListener('message', this._messageHandler);

    if (this.popup && this.popup.parentNode) {
      this.popup.parentNode.removeChild(this.popup);
      this.popup = null;
    }
    this.iframe = null;
    this.callback = null;
  }
}

// Export the class as default
export default ElFinderPicker;

/**
 * elFinder instance type (minimal interface for what we use)
 */
interface ElFinderInstance {
  exec?: (command: string, target: string) => void;
}

/**
 * Options for filePickerCallback
 */
export interface FilePickerCallbackOptions {
  /** Target origin for postMessage (default: '*') */
  origin?: string;
}

/**
 * Helper function for elFinder's getFileCallback
 * Use this directly in your elFinder configuration
 * Also sets up listener for navigation messages from parent
 *
 * @param file - File object from elFinder
 * @param fm - elFinder instance
 * @param options - Optional configuration
 * @example
 * // In your elFinder page:
 * import { filePickerCallback } from 'elfinder-picker';
 *
 * $('#elfinder').elfinder({
 *   url: '/connector.php',
 *   getFileCallback: filePickerCallback
 * });
 */
export function filePickerCallback(
  file: ElFinderFile,
  fm?: ElFinderInstance,
  options: FilePickerCallbackOptions = {}
): void {
  // Check if we're in an iframe (select mode)
  if (!window.parent || window.parent === window) {
    return; // Not in iframe, do nothing
  }

  const origin = options.origin || '*';

  // Set up listener for navigation messages from parent (only once)
  if (!(window as any)._elfinderNavigationListenerSet) {
    (window as any)._elfinderNavigationListenerSet = true;
    window.addEventListener('message', (event: MessageEvent<NavigateToFileMessage>) => {
      // Handle NAVIGATE_TO_FILE message
      if (event.data && event.data.action === 'NAVIGATE_TO_FILE' && event.data.path) {
        if (fm && typeof fm.exec === 'function') {
          // Use elFinder's exec method to open the file
          fm.exec('open', event.data.path);
        }
      }
    });
  }

  // Send file data to parent window
  const message: FileSelectedMessage = {
    action: 'FILE_SELECTED',
    file: {
      url: file.url,
      name: file.name,
      mime: file.mime || 'application/octet-stream'
    }
  };
  window.parent.postMessage(message, origin);
}

/**
 * Create a configured file picker callback with custom options
 *
 * @param options - Configuration options
 * @returns Configured callback function
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
export function createFilePickerCallback(
  options: FilePickerCallbackOptions = {}
): (file: ElFinderFile, fm?: ElFinderInstance) => void {
  return function(file: ElFinderFile, fm?: ElFinderInstance) {
    filePickerCallback(file, fm, options);
  };
}
