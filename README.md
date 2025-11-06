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
  import ElFinderPicker from 'https://cdn.jsdelivr.net/npm/elfinder-picker@2/elFinderPicker.mjs';
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

// Open the picker with a callback
picker.open((url, info) => {
  console.log('Selected file:', url, info);
  document.getElementById('myInput').value = url;
});
```

## Configure elFinder

Configure elFinder to work with the picker using `postMessage` for secure iframe communication. **No global variables needed!**

### In Your Main Application

Simply create your picker instance:

```javascript
import ElFinderPicker from 'elfinder-picker';

const picker = new ElFinderPicker({ url: '/path/to/elfinder.html' });

// That's it! No need to expose anything globally.
```

### In Your elFinder HTML Page

Configure elFinder to use `postMessage` to send selected files back to the parent:

```javascript
// Detect if we're in select mode (inside the picker iframe)
const isSelectMode =
  window.frameElement &&
  window.frameElement.getAttribute("data-mode") === "select";

const selectFile = function(file, fm) {
  // Send file data to parent window using postMessage
  if (window.parent) {
    window.parent.postMessage({
      action: 'FILE_SELECTED',
      file: {
        url: file.url,
        name: file.name,
        type: file.mime && file.mime.startsWith('image/') ? 'image' : 'file'
      }
    }, '*');
  }
}

// Configuration for elFinder
$('#elfinder').elfinder({
  url: '/path/to/elfinder/connector.php',
  getFileCallback: isSelectMode ? selectFile : undefined
});
```

### Message Format

The postMessage data should have this structure:

```javascript
{
  action: 'FILE_SELECTED',           // Action type (required, PascalCase)
  file: {                           // File object (required)
    url: string,                    // File URL (required)
    name: string,                   // File name (required)
    type: 'file' | 'image' | 'media'  // File type (optional, defaults to 'file')
  }
}
```

### Security Note

For production, replace `'*'` with your specific origin:

```javascript
window.parent.postMessage({
  action: 'FILE_SELECTED',
  file: {
    url: file.url,
    name: file.name,
    type: 'file'// 'file' | 'image' | 'media'
  }
}, 'https://yourdomain.com');
```

## TinyMCE Integration

```javascript
import ElFinderPicker from 'elfinder-picker';

const picker = new ElFinderPicker({ url: '/path/to/elfinder.html' });

tinymce.init({
  selector: '.text-editor',
  height: 350,
  plugins: ['link', 'image', 'media'],
  file_picker_callback: (cb, value, meta) => {
    picker.open(cb, value, meta);
  },
});
```

## API Reference

#### Constructor
```javascript
new ElFinderPicker(config)
```
- `config.url` (string): URL to your elFinder instance

#### Methods

- **`open(callback, value, meta)`**: Open the file picker
  - `callback` (Function): Function called with selected file `(url, info)`
  - `value` (any): Current value (optional)
  - `meta` (Object): Metadata object with `type` property (`'file'`, `'image'`, or `'media'`)

- **`config(config)`**: Update configuration
  - `config.url` (string): URL to your elFinder instance

- **`close()`**: Close the picker modal

- **`destroy()`**: Remove the picker from DOM and clean up

- **`onSelect(file)`**: Called by elFinder when a file is selected (internal use)
  - `file.url` (string): File URL
  - `file.name` (string): File name

## License

MIT
