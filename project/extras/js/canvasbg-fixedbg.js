rrequire( ["jquery", "static", "a/canvasbg"], function () {

	// Process the glitter animation.
	$.cms.canvasbg.animations.fixedBg = function () {
		this.init = function () { };
		this.resize = function () { };
		this.start = function () { };
		this.stop = function () { };
		this.cleanup = function () {
			if ( this.element && this.element.length ) {
				try {
					this.element[0].style.backgroundAttachment = this.originalStyle || "";
				} catch ( ex ) {; }
			}
		};
		if ( this.element.length ) {
			this.originalStyle = this.element[0].style.backgroundAttachment;
			this.element[0].style.backgroundAttachment = 'fixed';
		}
	}

	if ( window.register ) {
		window.register( "/includes/js/canvasbg-fixedbg.js" );
	}

} );