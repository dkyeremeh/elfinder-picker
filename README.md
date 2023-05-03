# elFinder Picker

Enable your website users to select files using elFinder File Browser. You can also use this tool as a file picker module for tinyMCE editor

## Demo

Coming soon

## Dependencies

- jQuery
- [elFinder](https://github.com/Studio-42/elFinder)

## Installation

### Bower

Run `bower install elfinder-picker`

### NPM

Run `npm i -s elfinder-picker`

### Yarn

Run `yarn add elfinder-picker`

### Manual Install

Downoad [elFinder Picker](https://github.com/dkyeremeh/elfinder-picker/archive/master.zip)

### Add to Project

#### Add elFinder Picker to your project

```html
<script src="/path/to/elFinderPicker.js"></script>
<link type="text/css" rel="stylesheet" href="/path/to/elFinderPicker.css" />
```

#### Configure elFinder Picker as shown

```html
<script>
  elFinderPicker.config({ url: 'path/to/elfinder.html' });
</script>
```

### Configure elFinder

```javascript

// We use this to configure whether double-clicking should open or select file
var isSelectMode =
	window.frameElement &&
	window.frameElement.getAttribute("data-mode") === "select";

var selectFile = function(file, fm) {
	parent.elFinderPicker.oninsert(file, fm);
}

// Configuration for elFinder
{
	url : '/path/to/elfinder/connector.php',
	getFileCallback : isSelectMode ? selectFile : undefined
}
```

## Usage

### Using elFinder Picker Directly

`elFinderPicker.open( callback )`
The callback function takes two arguments:

#### Example

```html
<button onclick="elFinderPicker.open( function( url, info ){  $("#input").val( url ) } )">Pick File</button>
```

### TinyMCE Integration

```javascript
tinymce.init({
  selector: '.text-editor',
  height: 350,
  plugins: [],
  file_picker_callback: elFinderPicker.open,
});
```
