rrequire( 'jquery', function() {

$.widget( "cms.accordion", {
	options: {
	},

	_create: function() {
		// First we'll bake the height in place.
		this.element.find("[data-type='title']").each(function(i){
			// Get the parent element and it's current height.
			var el = $(this),
				p = el.parent(),
				h = p.height();

			// Bake it in place.
			p.css({overflow:'hidden',height:h});

			// Save a reference to the height and add ARIA controls
			el.attr({ tabindex: 0, 'aria-expanded': false, 'aria-controls': 'section' + i }).data('height',h);
			el.parent().find( '[data-type="section"]' ).attr({ id: 'section' + i, 'aria-hidden':  true })
		}).on( 'click keydown', $.proxy(this._toggleSection,this) );

		// Then show the sibling sections.
		this.element.find("[data-type='section']").show();
	},

	_toggleSection: function(e) {
		
		if ( e.type === 'keydown' && e.keyCode != 13 && e.keyCode != 40 && e.keyCode != 38 ) {
			return;
		}
		
		var el = $(e.target).closest("[data-type='title']").addClass( 'working' ),
			p = el.parent(),
			hp = p.closest( '.collapsing-list' ),
			current = hp.find( '[data-type="title"].active' ),
			active = el.is('.active'),
			h = active ? el.data('height') : p[0].scrollHeight;

		if ( current.length ) {
			
			for ( i = 0; i < current.length; i++ ) {
				
				if ( !current.eq(i).is( '.working' ) ) {
					
					current.eq(i).removeClass( 'active' ).attr( 'aria-expanded', false );
					current.eq(i).parent().animate( { height: current.data( 'height' ) } ).find( '[data-type="section"]' ).attr( 'aria-hidden', true );
					
				}
				
			}
			
		}
			
		if ( active ) {
			el.removeClass('active').attr( 'aria-expanded', false );
			p.find( '[data-type="section"]' ).removeAttr( 'tabindex' ).attr( 'aria-hidden', true );
		} else {
			el.addClass('active').attr( 'aria-expanded', true );
			p.find( '[data-type="section"]' ).attr( 'aria-hidden', false );
			if ( e.type === 'keydown' || e.pageX === 0 && e.pageY === 0 ) {
				p.find( '[data-type="section"]' ).attr( 'tabindex', 0 ).focus();
			}
		}

		el.removeClass( 'working' );
		
		p.stop().animate({height:h},500);
		
		

	}
});

	if ( window.register ) {
		window.register( '/includes/js/accordian-script.js' );
	}

});