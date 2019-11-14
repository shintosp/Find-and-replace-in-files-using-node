rrequire( 'jquery', function() {

function phoneFormat() {
			
	//Phone Number Formatting for the forms
	(function( factory ) {
		if ( typeof rrequire === "function") {
			rrequire( ["j/jquery"], factory);
		} else {
			factory( jQuery, window );
		}
	} (function( $, scope ) { 
		var phoneInput = $( '.phone-mask' );
		phoneInput.on( 'input', function() {
			if ( this.value && this.value.match(/\d+/g) ) {
				this.value = this.value
					.match(/\d*/g).join('')
					.replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3')
					.replace(/-*$/g, '')
					.substring(0, 14);
				
				if ( this.value.length <= 6 ) {
					var cursorIndex = this.value.indexOf( ')');
					this.setSelectionRange( cursorIndex, cursorIndex );
				}
			} else {
				this.value = "";
			}
		});
			
		phoneInput.trigger( 'input' );
	}));
	
}

phoneFormat();

if ( window.register ) {
	window.register( '/includes/js/phone-format.js' );
}

});
