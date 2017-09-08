# elFinder Picker

## Dependencies
- jQuery

## Installation

### Bower
Run bower `install elfinder-picker`

### Manual
Downoad elFinder Picker

## Usage
1. Add elFinder Picker to your project
```html
<script src="/path/to/elFinderPicker.js"></script>
<link type="text/css" rel="stylesheet" href="/path/to/elFinderPicker.css">
```
1. Configure elFinder Picker as shown
```html
<script>elFinderPicker.config( { url: "path/to/elfinder.html" })</script>
```
1. elFinder Configuration
```javascript
{
	url : '/path/to/elfinder/connector.php', 
	
	getFileCallback : function(file, fm) {
		parent.elFinderPicker.oninsert(file, fm);
	}
}
```

### Direct file picking

### TinyMCE Integration

```javascript
tinymce.init({
	selector: '.text-editor',
	height: 350,
	plugins: [ ],
	file_picker_callback : elFinderPicker.open,
});
```
