'use strict';

import type {
  ElFinderFile,
  ElFinderInstance,
  FilePickerCallbackOptions,
  FileSelectedMessage,
  NavigateToFileMessage
} from './types';

/**
 * Helper function for elFinder's getFileCallback
 * Use this directly in your elFinder configuration
 * Also sets up listener for navigation messages from parent
 *
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
