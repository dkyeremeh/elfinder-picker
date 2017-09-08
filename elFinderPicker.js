"use strict";

(function( $ ){

	var settings = {
		url: "",
	}

	var callback, meta, value, popup;

	window.elFinderPicker = {
		open: function ( cb, v, m ) {
			callback = cb;
			value = v;
			meta = m;

			if( popup ){
				popup.show();
			}
			else{
				popup = $( "<div class='elFinder-picker'>\
					<div class='elFinder-picker-backdrop'></div>\
					<div class='elFinder-picker-content content'>\
						<h3>File Manager</h3>\
						<div class='elfinder-picker-close'>&times;</div>\
						<iframe class='elFinder-picker-iframe' src='" + settings.url + "'></iframe>\
					</div>\
				</div>" );
				$( document.body ).append( popup );
				popup.find(".elfinder-picker-close, .elfinder-picker-backdrop").click( function(){ popup.hide() } );
			}
			return popup;
		},
		config: function( config ){

			var fields = [ "url" ];

			fields.forEach( function( field ){
				if ( config[ field ] ){
					settings[ field ] = config[ field ]; 
				}
			});
			console.log(settings)
		},
		oninsert: function( file ){
			var url, reg, info;

			meta = meta || { filetype: "file" };

			// URL normalization
			url = file.url;
			reg = /\/[^/]+?\/\.\.\//;
			while(url.match(reg)) {
			url = url.replace(reg, '/');
			}

			// Make file info
			info = file.name;

			// Provide file and text for the link dialog
			if (meta.filetype == 'file') {
				callback(url, { text: info, title: info });
			}

			// Provide image and alt text for the image dialog
			if (meta.filetype == 'image') {
				callback(url, {alt: info});
			}

			// Provide alternative source and posted for the media dialog
			if (meta.filetype == 'media') {
				callback(url);
			}
			this.close();

		},
		close: function(){
			popup.hide();
		}

	}

})( jQuery )
	