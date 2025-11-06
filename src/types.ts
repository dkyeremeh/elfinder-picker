'use strict';

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
export interface FileSelectedMessage {
  action: 'FILE_SELECTED';
  file: ElFinderFile;
}

export interface NavigateToFileMessage {
  action: 'NAVIGATE_TO_FILE';
  path: string;
}

export type PickerMessage = FileSelectedMessage | NavigateToFileMessage;

/**
 * elFinder instance type (minimal interface for what we use)
 */
export interface ElFinderInstance {
  exec?: (command: string, target: string) => void;
}

/**
 * Options for filePickerCallback
 */
export interface FilePickerCallbackOptions {
  /** Target origin for postMessage (default: '*') */
  origin?: string;
}
