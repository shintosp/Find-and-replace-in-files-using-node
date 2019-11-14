rrequire( 'jquery', function() {

$.widget( 'cms.tabs', {
	
	options: {
		slider: false,
		speed: 500,
		// Are the tabs and their panels siblings or in separate elements?
		siblings: true,
		// Do we want to close an item if it's open and they click the tab again?
		closing: false,
		// Do we want to open items when their tab is hovered?
		hovers: false,
		hoverStay: true,
		// Is it a navigation?
		nav: false
	},
	
	_create: function () {
		
		// Declare the items to be used
		this.tabs = this.element.find( '.el-tab' );
		this.panels = this.element.find( '.el-tab-panel' );
		
		// Start panel elements hidden for slider.
		if ( this.options.slider ) {
			this.panels.filter(':not(.active)').slideUp( this.options.speed );
		}
		
		// Add ARIA Markup
		this._addAria();
		
		// Call the togglePanel script when we click a tab
		this.tabs.on( 'click keydown mouseenter mouseleave outsideclick', $.proxy( this._togglePanel, this ) );
		
		// If our elements aren't siblings, add a call in for tab control.
		if ( this.options.siblings === false ) {
			this.panels.on( 'keydown', $.proxy( this._panelTabbing, this ) );
		}
		
		
	},
	
	_addAria: function() {
		
		// Handle ARIA Markup
		// Add some universal attributes
		this.tabs.attr( { role: 'tab', tabindex: 0, 'aria-selected': false } );
		this.panels.attr( { 'aria-label': 'submenu', 'aria-hidden': true, role: 'tabpanel' } );
		
		// Setup attributes for if our elements are siblings
		if ( this.options.siblings === true ) {
			
			// Use a different set for Nav items
			if ( this.options.nav === true ) {
				
				// Add appropriate roles for our type
				this.element.attr( 'role', 'menu' );
				this.tabs.attr( { 'aria-haspopup': true } );
				this.panels.attr( { 'aria-label': 'submenu', 'aria-hidden': true } );
				
			} else {
				
				// Add appropriate roles for our type
				this.tabs.attr( { 'aria-expanded': false } );
				
			}	
			
			
		} 
		// Use a different setup for when the elements aren't siblings
		else {
			
			// Add appropriate roles for our type
			this.tabs.attr( { 'aria-expanded': false } )
				.closest( 'li' ).attr( 'role', 'presentation' )
					.parent( 'ul' ).attr( 'role', 'tablist' );
					
			// Since our tabs and panels aren't siblings, add tab indexes to the panels
			// so we can move to the panels and back to the tabs 
			this.panels.attr( 'tabindex', 0 );
			
		}
		
		// Add individual attributes to the items
		for ( i = 0; i < this.tabs.length; i++ ) {
			
			// Set the control attribute for the tabs and their panels
			this.tabs.eq(i).attr( 'aria-controls', 'TabPanel-' + i );
			this.panels.eq(i).attr( 'id', 'TabPanel-' + i );
			
			// Set ARIA attributes to selected / open for the initial active item if we have one
			if ( this.tabs.eq(i).is( '.active' ) ) {
				
				this.tabs.eq(i).attr( 'aria-selected', true );
				this.panels.eq(i).attr( 'aria-hidden', false );
						
			}	
			
		}
		
	},
	
	_panelTabbing: function(e) {
		
		// If it's not tab, idc...
		if ( e.keyCode !== 9 ) {
			return;
		}
	
		var target = $( e.target ),
			panel = target.closest( '.el-tab-panel' ),
			links = panel.find( 'a' );
		
		if ( target.is( '.el-tab-panel' ) ) {
				
			// If we held to shift key to move back, move us back to the tab.
			if ( e.shiftKey ) {
				
				// Prevent the default so it doesn't double-tab us.
				e.preventDefault();
				
				// Find the matching tab and set the focus.
				this.tabs.filter( '[aria-controls="' + target.attr( 'id' ) + '"]' ).focus();
			
			} else {
			
				// Since we're moving forward, check to see if the panel has any links in it to move to
				// If there is a link, that means we're still inside so do nothing.
				if ( links.length ) {
					return;
				} else {
					
					// Prevent the default so it doesn't double-tab us.
					e.preventDefault();
					
					// Since there are no links inside the panel to move to, move to the next tab
					this.tabs.filter( '[aria-controls="' + target.attr( 'id' ) + '"]' ).next().focus();
				
				}
			
			}
		
		} 
		// If the target is a link and that link is the last one in the panel, let's move on to the next panel
		else if ( target.is( 'a' ) && links.index(target) == ( links.length - 1 ) ) {
			
			// Prevent the default so it doesn't double-tab us.
			e.preventDefault();
			
			// Since there are no links inside the panel to move to, move to the next tab
			this.tabs.filter( '[aria-controls="' + panel.attr( 'id' ) + '"]' ).next().focus();
		
		}
		
	
	},
	
	_togglePanel: function(e) {
	
		var target = $( e.target ).closest('.el-tab');
	
		// Make sure we want the hover controls before we move on with them
		if ( e.type === 'mouseenter' || e.type === 'mouseleave' && this.options.hovers === false ) {
			return;	
		} else if ( e.type === 'mouseleave' && this.options.hoverStay === false ) {
			return;	
		}

		// Check some things if it was a keydown event
		if ( e.type === 'keydown' ) {
			
			// If we've hit the tab key and our items aren't siblings, navigate us through the nonsense.
			if ( e.keyCode == 9 && this.options.siblings === false ) {
				
				if ( e.shiftKey ) {
					
					if ( target.prev().is( '.active' ) ) {
					
						// Prevent the default so it doesn't double-tab us.
						e.preventDefault();
						
						this.panels.filter( '[id="' + target.prev().attr( 'aria-controls' ) + '"]' ).focus();
				
					} 
				
				} else if ( target.is( '.active' ) ) {
				
					// Prevent the default so it doesn't double-tab us.
					e.preventDefault();
					
					this.panels.filter( '[id="' + target.attr( 'aria-controls' ) + '"]' ).focus();
				
				}
			
				// Leave since we don't need anything else
				return;
			
			} else if ( e.keyCode != '13' ) {
				
				// If it wasn't the tab key and it's not the enter key, abort the mission.
				return;	
			
			}
		
		}
		
		
		// Make sure the tab we clicked isn't active before moving on
		if ( target.is( '.active' ) ) {
			
			// If we're closing open panels when their tab is clicked, do so.
			if ( this.options.closing === true || this.options.hovers === true && this.options.hoverStay === false ) {
			
				// Handle changing attributes and hiding the panel
				target.removeClass( 'active' ).attr( { 'aria-selected': false } );
				this.panels.filter( '[id="' + target.attr( 'aria-controls' ) + '"]' ).removeClass( 'active' ).attr( { 'aria-hidden': true } );
				
				// slide up the item if needed
				if ( this.options.slider === true ) {
					this.panels.filter( '[id="' + target.attr( 'aria-controls' ) + '"]' ).slideUp( this.options.speed );	
				}
				
			}
			
		} else {
			
			// Slide up the previously open item if needed
			if ( this.options.slider === true ) {
				this.panels.filter( '.active' ).slideUp( this.options.speed );	
			}
			
			// Close any other open tabs
			this.tabs.filter( '.active' ).removeClass( 'active' ).attr( { 'aria-selected': false } );
			this.panels.filter( '.active' ).removeClass( 'active' ).attr( { 'aria-hidden': true } );
			
			// Open the selected item
			target.addClass( 'active' ).attr( { 'aria-selected': true } );
			this.panels.filter( '[id="' + target.attr( 'aria-controls' ) + '"]' ).addClass( 'active' ).attr( { 'aria-hidden': false } );
			
			// Slide the new item open if needed
			if ( this.options.slider === true ) {
				this.panels.filter( '[id="' + target.attr( 'aria-controls' ) + '"]' ).slideDown( this.options.speed );
			}
			
		}
		
	}
	
} );

	if ( window.register ) {
		window.register( '/includes/js/tabs-script.js' );
	}

} );