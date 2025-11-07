# elFinder Picker

Enable your website users to select files using elFinder File Browser. You can also use this tool as a file picker module for tinyMCE editor.

**Version 2.0** brings modern ESM support, removes jQuery dependency, eliminates global variables, and auto-injects CSS styles for a cleaner integration experience.

> **Looking for v1.x?** If you need the legacy version with jQuery and global variables, see the [v1.1.2 documentation on npm](https://www.npmjs.com/package/elfinder-picker/v/1.1.2).

## Demo

Coming soon

## Dependencies

- [elFinder](https://github.com/Studio-42/elFinder)

## Installation

### npm

```bash
npm i -s elfinder-picker
```

### Yarn

```bash
yarn add elfinder-picker
```

### Browser ESM (CDN)

```html
<script type="module">
  import ElFinderPicker from 'https://cdn.jsdelivr.net/npm/elfinder-picker@2/dist/index.mjs';
  // Use the picker
</script>
```

## Usage

### Basic Example

```javascript
import ElFinderPicker from 'elfinder-picker';

// Create a new instance (styles are auto-injected!)
const picker = new ElFinderPicker({
  url: '/path/to/elfinder.html'
});

// Open the picker with a callback that receives the file object
picker.open((file) => {
  console.log('Selected file:', file);
  // file = { url: '...', name: '...', mime: 'image/jpeg' }

  document.getElementById('myInput').value = file.url;
  document.getElementById('fileName').textContent = file.name;
});

// Or open with an initial value (navigates to that file in elFinder)
const currentFile = document.getElementById('myInput').value;
picker.open((file) => {
  document.getElementById('myInput').value = file.url;
}, currentFile);
```

## Configure elFinder

### Step 1: Setup Your Main Application

Create your picker instance and use it:

```javascript
import ElFinderPicker from 'elfinder-picker';

const picker = new ElFinderPicker({ url: '/path/to/elfinder.html' });

// Open the picker and handle file selection
document.getElementById('selectFileBtn').addEventListener('click', () => {
  picker.open((file) => {
    console.log('Selected file:', file.url, file.name, file.mime);
    document.getElementById('fileInput').value = file.url;
  });
});
```

### Step 2: Setup Your elFinder Page

Import and use the provided helper callback (minimal code required):

```javascript
import { filePickerCallback } from 'elfinder-picker';

// Configure elFinder with the helper
$('#elfinder').elfinder({
  url: '/path/to/elfinder/connector.php',
  getFileCallback: filePickerCallback  // That's it!
});
```

The helper automatically handles everything for you:
- ✅ Detects if running in picker mode
- ✅ Sends file data (URL, name, MIME type) back to the picker
- ✅ Zero configuration needed

### Production Security (Optional)

Restrict postMessage to your specific domain:

```javascript
import { createFilePickerCallback } from 'elfinder-picker';

const callback = createFilePickerCallback({
  origin: 'https://yourdomain.com'  // Only allow messages to your domain
});

$('#elfinder').elfinder({
  url: '/path/to/elfinder/connector.php',
  getFileCallback: callback
});
```

## TinyMCE Integration

TinyMCE needs different response formats depending on which dialog is open. Use the MIME type to determine how to format the response:

```javascript
import ElFinderPicker from 'elfinder-picker';

const picker = new ElFinderPicker({ url: '/path/to/elfinder.html' });

tinymce.init({
  selector: '.text-editor',
  height: 350,
  plugins: ['link', 'image', 'media'],
  file_picker_callback: (callback, value, meta) => {
    picker.open((file) => {
      // Format response based on TinyMCE dialog type
      if (meta.filetype === 'image') {
        callback(file.url, { alt: file.name });
      } else if (meta.filetype === 'media') {
        callback(file.url);
      } else {
        // For links/files
        callback(file.url, { text: file.name, title: file.name });
      }
    });
  },
});
```

You can also use the file's MIME type to make decisions:

```javascript
file_picker_callback: (callback, value, meta) => {
  picker.open((file) => {
    // Use MIME type to determine file category
    if (file.mime.startsWith('image/')) {
      callback(file.url, { alt: file.name });
    } else if (file.mime.startsWith('video/') || file.mime.startsWith('audio/')) {
      callback(file.url);
    } else {
      callback(file.url, { text: file.name, title: file.name });
    }
  });
}
```

## API Reference

### ElFinderPicker Class

#### Constructor
```javascript
new ElFinderPicker(config)
```
- `config.url` (string): URL to your elFinder instance

#### Methods

##### `open(callback, value, meta)`
Open the file picker modal

**Parameters:**
- `callback` (Function): Called when a file is selected. Receives a file object:
  ```javascript
  {
    url: string,   // Normalized file URL
    name: string,  // File name
    mime: string   // MIME type (e.g., 'image/jpeg', 'application/pdf')
  }
  ```
- `value` (string, optional): Initial file path to navigate to in elFinder
- `meta` (Object, optional): Metadata for TinyMCE compatibility

**Example:**
```javascript
// Basic usage
picker.open((file) => {
  console.log(file.url, file.name, file.mime);
});

// With initial value (navigate to specific file)
picker.open((file) => {
  document.getElementById('input').value = file.url;
}, '/uploads/images/current-file.jpg');

// Check file type
picker.open((file) => {
  if (file.mime.startsWith('image/')) {
    // Handle image
  }
});
```

##### `config(config)`
Update picker configuration
- `config.url` (string): URL to your elFinder instance

##### `close()`
Close the picker modal

##### `destroy()`
Remove the picker from DOM and clean up resources

### Helper Functions

#### `filePickerCallback(file, fm, options)`
Ready-to-use callback for elFinder's `getFileCallback`. Automatically sends file data (URL, name, MIME type) to the parent picker.

**Parameters:**
- `file` (Object): File object from elFinder
- `fm` (Object): elFinder instance
- `options` (Object): Optional configuration
  - `options.origin` (string): Target origin for postMessage (default: `'*'`)

**Example:**
```javascript
import { filePickerCallback } from 'elfinder-picker';

$('#elfinder').elfinder({
  url: '/connector.php',
  getFileCallback: filePickerCallback
});
```

#### `createFilePickerCallback(options)`
Creates a configured file picker callback with custom origin for production security

**Parameters:**
- `options` (Object): Configuration options
  - `options.origin` (string): Target origin for postMessage

**Returns:** Function compatible with elFinder's `getFileCallback`

**Example:**
```javascript
import { createFilePickerCallback } from 'elfinder-picker';

const callback = createFilePickerCallback({
  origin: 'https://yourdomain.com'
});

$('#elfinder').elfinder({
  url: '/connector.php',
  getFileCallback: callback
});
```

## License

MIT
