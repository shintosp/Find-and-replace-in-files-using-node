// Masthead Script
$.widget( "cms.masthead", {

	options: {
		overlap: false,
		padBanner: false,
		speed: 200,
		scrollCount: 1,
	},
	
	_create: function () {
		var path = new URI(window.location.href),
		anchor = path.Hash && path.Hash.split( '#' ).pop(),
		link = $('a[name="' + anchor + '"]'),
		grid = this,
		width = document.documentElement.clientWidth;
		this.transitionEvent = this._whichTransitionEvent();
		this.scrollCount = ( this.element.innerHeight() ) - 1;
		this.lastScroll = 0,
		this.flyNavs = this.element.find( '[data-role="fly-nav"]' ).attr( 'aria-label', 'submenu' );
		
		// Track whether or not the person is hovered over the header
		this.element.on( 'mouseenter mouseleave', $.proxy( this._trackFocus, this ));
		
		// If overlap is false, pad the body tag to prevent the masthead from obscuring other elements
		if (!this.options.overlap || this.options.padBanner) {
			this._setBuffer();
			setTimeout($.proxy(function() {
				this._setBuffer();
				// if we have an anchor link, animate to it
				if ( anchor && link && link.length ) {
					setTimeout( this._checkAnchor.apply( this, [link] ), 100 );
				}
			}, this), 500);
			
			// reset the padding on a delayed resize
			$(window).onidle('resize', $.proxy(function() {
				
				if ( document.documentElement.clientWidth !== width ) {
				
					width = document.documentElement.clientWidth;
					this._setBuffer();
					
				}
					
			}, this), 250);
		}
		
		
		$( window ).onidle( 'scroll', $.proxy( this._checkScroll, this ), 100 );
		
		// When clicking on a link that has an anchor
		$( 'a[href*="#"]' ).on( 'click', function ( e ) {
			var evt = $(e.target).is('a') ? e.target : e.currentTarget,
				target = new URI( evt.href ),
				anchor = target.Hash,
				link = $('a[name="' + anchor + '"]');
			// Prevent the default events
			e.preventDefault();
			if ( path.Path == target.Path && link.length ) {
				grid._checkAnchor.apply( grid, [link] );
			} else {
				window.location = evt.href;
			}
		} );
		
		// Setup flyouts for accessibility if we have them
		if ( this.flyNavs.length != 0 && document.documentElement.clientWidth > 985 ) {
			this._flyManagement();
		}
		
		
	},
	
	_flyManagement: function() {

		// Get elements and setup ARIA attributes
		var pItem = this.flyNavs.closest( 'li' ),
			pLink = pItem.children( 'a' ).attr( { 'aria-haspopup': true } ),
			allItems = this.element.find( '.desktop-nav > li' ),
			allLinks = allItems.children( 'a' );
			

		// Open corresponding flyout on focus of it's parent link
		pLink.on( 'focus', function() {
			
			// Close all flyouts
			pItem.removeClass( 'open' );
			
			// Open the focused item's flyout
			$(this).closest( 'li' ).addClass( 'open' );
			
		} );
		
		// If I shift + tab on a top nav link, skip the flyout of the link before it and close the flyout if it has one.
		allLinks.on( 'keydown', function(e) {
			
			// If it's the tab key with shift held
			if ( e.keyCode == 9 && e.shiftKey ) {
				
				// Close the focused item's flyout
				$(this).closest( 'li' ).removeClass( 'open' );
				
				var prevLink = allItems.eq( $(this).closest( 'li' ).index() -1 ).children( 'a' );
				
				if ( prevLink.is( '[aria-haspopup="true"]' ) ) {
				
					// Prevent the default move
					e.preventDefault();
					
					// Find the previous item in the top nav and shift the focus to it.
					allItems.eq( $(this).closest( 'li' ).index() -1 ).children( 'a' ).focus();

				}

			}
			
		});	
		
		// Watch last link in each flyout to see if we're leaving
		this.flyNavs.find( 'li a' ).last().on( 'keydown', function(e) {
			
			// If it's the tab key
			if ( e.keyCode == 9 ) {
			
				// Check to make sure Shift wasn't also pressed
				if ( !e.shiftKey ) {
				
					// Close the flyout
					$(this).closest( 'li.open' ).removeClass( 'open' );
					
				}
				
			}
		
		} );
		
	},
	
	_setBuffer: function() {
		window.buffer = this.element.innerHeight();
		
		if ( this.options.padBanner ) {
		
			$("main").children("section").first().css("padding-top", window.buffer);
		
		} else {
		
			$('main').css('padding-top', window.buffer);
		
		}
	},
	
	_trackFocus: function(e) {
	
		if ( e.type === 'mouseenter' ) {
			window.focused = true;
		} else {
			window.focused = false;
		}
	
	},
	
	_checkFocus: function() {
		var fTimer;
		
		function check() {
				
			if ( window.focused === true && $('html').is('.up-scroll') && $('body').is('.fixed') ) {
				clearTimeout(fTimer);
				focusTimer();
			} else {
				$('html').addClass('down-scroll').removeClass('up-scroll');
			}
			
		}
		
		
		function focusTimer() { 
			fTimer = setTimeout( function() {	
				check();
			}, 4000 );		
		}
		
		focusTimer();
	
	},
	
	_checkScroll: function (e) {
		var scrollTop = $( window ).scrollTop(); 
		if ( !$( 'html' ).hasClass( 'anchors' ) ) {
			// Set Fixed class for the header
			if ( scrollTop > this.scrollCount ) {
				$('body').addClass( 'fixed' );
			} else {
				$('body').removeClass( 'fixed' );
			}	
		}
		
		// Check to see whether we last scrolled up or down
		if ( this.lastScroll < ( scrollTop - 99 ) ) {
			$('html').addClass('down-scroll').removeClass('up-scroll');	
		} 
		// Only count a scroll upwards if we've moved more than a third of the viewport height
		else if ( this.lastScroll > ( scrollTop + ( window.innerHeight / 3 ) ) ) {
			$('html').removeClass('down-scroll').addClass('up-scroll');	
			
			if ( document.documentElement.clientWidth > 985 ) {	
				this._checkFocus();
			}
		}
		// Set last scroll variable to current scroll for next time
		this.lastScroll = scrollTop;
	},
	
	_checkAnchor: function ( link ) {
		var offset = link.offset().top;
		if ( this.options.overlap ) {
			offset -= this.element.innerHeight();
		} else {
			offset -= (this.element.innerHeight() - window.buffer);
		}
			this._runScroll.apply( this, [offset] );
	},
	
	_runScroll: function ( offset ) {
		if ( offset < 500 ) {
			this.options.speed = 100;
		}
		$( 'html, body' ).animate( {
			scrollTop: offset
		}, this.options.speed , function () {
			$( 'html' ).removeClass( 'anchors' );
		} );
	},
	
	_whichTransitionEvent: function () {
		var t,
		el = document.createElement( "fakeelement" );
		var transitions = {
			"transition": "transitionend",
			"OTransition": "oTransitionEnd",
			"MozTransition": "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		};
		for ( t in transitions ) {
			if ( el.style[t] !== undefined ) {
				return transitions[t];
			}
		}
	}
} );

if ( window.register ) {
	window.register( '/includes/js/header-script.js' );
}
