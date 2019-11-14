// Handle the Mobile Menu Height
function mobileHeighter() {
	$( '.header-area .desktop-nav' ).css( { height: document.documentElement.clientHeight - $( '.header-area .mobile-nav' ).height() + 'px' } );
}

// Handler for the Mobile / Tablet Menu
function mobileNav() {	
	
	var menuBtn = $( '.menu-btn' );
	menuBtn.on( 'click', function(e) {
		e.preventDefault();
		simpleShowHide( $(this), 'mm-open', $('body') );
		
	} );
	
	// Call open / close function for the drop downs
	var panelBtn = $('.panel-btn');
	panelBtn.click(function(e) {
		e.preventDefault();
		var item = $(this);
	
		if ( item.closest('li').is('.open') ) {
			panelBtn.closest('li').removeClass('open');
			panelBtn.next( '[data-role="fly-nav"]' ).slideUp(400);
		} else {
			panelBtn.closest('li').removeClass('open');
			panelBtn.next( '[data-role="fly-nav"]' ).slideUp(400);
			item.closest('li').addClass('open');
			item.next( '[data-role="fly-nav"]' ).slideDown(400);
		}
	});
	
	mobileHeighter();
	
	$('body').addClass('mobile-ready');
	
}

if ( window.register ) {
	window.register( '/includes/js/special-mobile-nav-script-v2.js' );
}
