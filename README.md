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

Configure elFinder to work with the picker by detecting select mode and calling the appropriate callback.

### In Your Main Application

Expose your picker instance on the window for iframe communication:

```javascript
import ElFinderPicker from 'elfinder-picker';

const picker = new ElFinderPicker({ url: '/path/to/elfinder.html' });
window.elFinderPickerInstance = picker; // Make it accessible to iframe
```

### In Your elFinder HTML Page

```javascript
// Detect if we're in select mode (inside the picker iframe)
const isSelectMode =
  window.frameElement &&
  window.frameElement.getAttribute("data-mode") === "select";

const selectFile = function(file, fm) {
  // Access the picker instance through the parent window
  if (window.parent && window.parent.elFinderPickerInstance) {
    window.parent.elFinderPickerInstance.oninsert(file);
  }
}

// Configuration for elFinder
$('#elfinder').elfinder({
  url: '/path/to/elfinder/connector.php',
  getFileCallback: isSelectMode ? selectFile : undefined
});
```

## TinyMCE Integration

```javascript
import ElFinderPicker from 'elfinder-picker';

const picker = new ElFinderPicker({ url: '/path/to/elfinder.html' });
window.elFinderPickerInstance = picker;

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
  - `meta` (Object): Metadata object with `filetype` property (`'file'`, `'image'`, or `'media'`)

- **`config(config)`**: Update configuration
  - `config.url` (string): URL to your elFinder instance

- **`close()`**: Close the picker modal

- **`destroy()`**: Remove the picker from DOM and clean up

- **`oninsert(file)`**: Called by elFinder when a file is selected (internal use)
  - `file.url` (string): File URL
  - `file.name` (string): File name

## License

MIT
