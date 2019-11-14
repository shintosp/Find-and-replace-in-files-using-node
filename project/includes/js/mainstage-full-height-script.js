// Function to set Mainstages to full height, taking the header into account.
// Written on 10-10-17 on Aries.scorpionmodels.com
function fullHeightMainstage(panel, i) {
	
	// If the Header JS has set the buffer size, let's do this nonsense.
	if ( window.buffer ) {
		
		// Get the amount of space available, excluding the height of the header.
		var space = window.innerHeight - window.buffer,
			prop = space / window.innerWidth - .6;
		
		// If the height is less than 60% of the width, set it :)
		if ( prop !== Math.abs(prop) ) {
		
			// Set the min-height of the Mainstage equal to the percentage of space not taken up the by header 
			// using a vh value so it will be more responsive.
			panel.removeClass( 'tall-height' ).css({ 'min-height': ( space / window.innerHeight ) * 100 + 'vh' })
		
		} else {
		
			// Add the tall-height class so we can adjust to a good size :) 
			panel.addClass( 'tall-height' )
		
		}
		
	} else {
		
		// Set an index so we can make sure we don't get stuck in an infinite loop
		if ( !i ) {
			var i = 1;
		} else {
			i += 1;
		}
		
		// We'll try to wait for the Header JS 10 times and then we'll just leave things be. 
		if ( i !== 11 ) {
		
			// Wait a 100 milliseconds and recall our function
			setTimeout( function() {
				
				// Recall the function passing our panel and the index through. 
				fullHeightMainstage(panel, i);
				
			}, 100 )
	
		} else {
			
			// we don't have the buffer so let's assume we can't use it and add our backup class.
			panel.addClass( 'tall-height' );
			
		}
		
	}
	
}

if ( window.register ) {
	window.register( '/includes/js/mainstage-full-height-script.js' );
}

