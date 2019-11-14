rrequire( 'jquery', function() {

// Last update: 10-25-17
/* 
	Fixed bug with infinite scroll
	Added pause / play on hover for autoAdvance
	Added no-scroll class for when there aren't enough items.
	Made pasuse / play work on focus for people using their keyboard to navigate
	Redid math for infinite scroll moved too far piece since there was another bug with it...
	Fixed bug with plause / play that was causing all of the lists to move randomly.
*/

// Function to handles scrolling lists
$.widget("cms.scrollingList", {

	options: {
		direction: 'vertical',
		count: 1,
		scroll: 'panel',
		breakpoints: {
			tabletLandscape: {
				width: 1185,
				count: 3
			},
			tabletPortrait: {
				width: 785,
				count: 2
			},
			mobile: {
				width: 585,
				count: 1
			},
			smallMobile: {
				width: 385,
				count: 1
			}
		},
		infinite: true,
		nav: false,
		video: false,
		setHeights: false,
		autoAdvance: false,
		scrollSpeed: 8000,
		periodic: false,
		periodicCount: 2,
		paging: false,
		tabs: false,
		nowrap: false,
		emptySpace: false,
	},

	_create: function() {
		if (this.options.periodic){
			this._periodicSetup();
		}
	
		// Decalre the elements to be used :)
		this.container = this.element.find("[data-role='container']");
		this.list = this.container.find("[data-role='list']");
		this.items = this.container.find("[data-role='item']");
		
		// Set the intial state for pausing the scrolling list
		this._paused = false;
		
		// Set the initial tabbing state to false sicne most people won't be tabbing through
		this.tabbing = false;
		
		// Find out whether or not our List Items house a direct child link.
		this.linkItems = ( this.items.eq(0).children( 'a' ).length != 0 ) ? true : false;
		
		// Setup direction storage
		this.direction;

		// get the total number of elements to be scrolled
		this.total = this.items.length;
		
		// Set initial value of false
		this._isTheEndOfAllThings = false;
		
		// Set initial start value
		this._isTheBeginningOfAllThings = true;

		// Get the number of visible items based on the current window size
		this.groups = {
			count: this._detectViewport(this.options.breakpoints, this.options.count, this.total)
		};

		// If we don't have enough items to scroll, do nothing
		if (!this.groups.count) {
			this.element.addClass( 'no-scroll' );
			return false;
		} else {
			
			// If we're running infinite scroll, do some extra work before we set the amount of groups and do the sizing
			if ( this.options.infinite === true ) {
				
				// Duplicate the list items
				var itemHtml = $.trim( this.list.html() );
				this.list.html( itemHtml + itemHtml );
				
				// Reset the total
				this.total = this.total * 2;
				
				// Reset the items list
				this.items = this.container.find("[data-role='item']");
				
				
				var scrollerID = this.element.attr('id');
				window['scroller' + scrollerID] = this.element;
				
			}
			
			// Record the total number of groups
			this.groups.total = Math.ceil(this.total / this.groups.count);
		
		}
		
		// Initialize the Paging if it's true and we have the paging elements
		if ( this.options.paging === true ) {
			
			// Get the elements
			this.paging = {
				element: this.element.find( '[data-role="paging"]' ),
				active: this.element.find( '[data-role="page-active"]' ),
				total: this.element.find( '[data-role="page-total"]' )
			};
			
			// Set the initial values for the active panel and total panels
			this.paging.active.text( '1' );
			// Use the total amount of items divided by the amount we're showing at a time
			// and round up in case it's not a whole number.
			this.paging.total.text( Math.ceil( this.total / this.groups.count ) );
			
		}
		
		// Start sizing the elements
		this._setup();

		// Handle clicks on navigation elements
		this.element.on('click keydown mouseenter mouseleave focusin focusout', $.proxy(this._handleMouse, this));
		
	
		
		// Handle Swipe Events
		this.element.on('swipeleft swiperight', $.proxy(this._handleSwipe, this));

		// Add Tab Indexes to the items so they can be scrolled with keystrokes from a screen reader
		if ( this.linkItems === false ) {
			this.items.attr( 'tabindex', 0 );
		}
		
		// I heard you like items with yo items so here's some functionality to make that work ;)
		// If our items are lists, then add tab indexes to our item's items
		if ( this.items.eq(0).is( 'ul' ) ) {
			var innerItems = this.items.children( 'li' );
			if ( !innerItems.children( 'a' ).length ) {
				innerItems.attr( 'tabindex', 0);
			}
			
		}
		
		// If we're moving by single items, control the tabs to move us around
		if ( this.options.scroll === 'single' && this.options.infinite === true ) {
			this.items.on( 'keydown', $.proxy(this._handleTab, this) );
		}

		// Add Tab Indexes to the nav arrows if we have them
		var arrows = this.element.find( '[data-direction]' ).attr({ tabindex: 0, role: 'button' } );
		
		// If I have arrows, set title attributes to make them descriptive for screen readers
		if (arrows) {
			
			for( i = 0; i < arrows.length; i++ ) {
				
				// Find out which type the arrow is
				var type = ( arrows.eq(i).data( 'direction' ) == 'next' ) ? 'View Next Item' : 'View Previous Item';
				
				// Set the title attribute
				arrows.eq(i).attr( 'title', type );
			
			}
			
		}

		// Set up any additional thumbnail nav
		if (this.options.nav) {
			this._thumbNav();
		}

		// Run Auto Play if we want it.
		if ( this.options.autoAdvance ) {
			this._autoPlay();	
		}

		// Add Indexes to the items so we can have an active item
		// Only works when you're scrolling 1 item at a time.
		// Middle item is active for odd number groups and first item is active for even groups
		if ( this.options.scroll === 'single' ) {
			
			if ( this.options.infinite == true ) {
				// Remove tab indexes so they don't land on just any item
				this.items.removeAttr( 'tabindex' );
			}
			
			// Add the indexs
			for ( i = 0; i < this.items.length; i++ ) {
				this.items.eq(i).attr( 'index', i );
			}

			if ( Math.abs( this.groups.count % 2 ) == 1 ) {
				
				// Set the count type so we can use it in other places.
				this.countType = 'odd';
				
				// Set the initial active item.
				this.items.eq( ( this.groups.count / 2 ) - 0.5 ).addClass( 'active' ).attr( 'tabindex', 0 );
				
				// If we're using Infinite Scroll, save the distrance between the active item and the end of the list
				if ( this.options.infinite === true || this.options.tabs === true ) {
					this.distance = this.groups.count / 2 - 0.5;
				}
				
			} else {
				
				// Set the count type so we can use it in other places.
				this.countType = 'even';
				
				// Set the initial active item.
				this.items.eq(0).addClass( 'active' ).attr( 'tabindex', 0 );
				
				// If we're using Infinite Scroll, save the distrance between the active item and the end of the list
				if ( this.options.infinite === true ) {
					this.distance = this.groups.count - 1;	
				}
				
			}
			
			this.activeItem = true;
			
		}

	},

	_setup: function() {
		var styleMode, styleFallback, styleProp;

		this._setSizing();

		this.element.addClass('active');
		
		if ( this.options.infinite !== true ) {
			this.element.addClass('start');
		}
		
		this._index = 0;

		switch (this.options.scroll) {
			case 'panel':
				this.scroll = this.groups.count;
				break;
			case 'single':
				this.scroll = 1;
				break;
			default:
				this.scroll = 1;
				break;
		}
		
	},

	//Handle creating a periodic list of items
	_periodicSetup: function(){
		var listItems = this.element.find("[data-role='item']").children();

		this.total = listItems.length;
		this._detectViewport(this.options.breakpoints, this.options.count, this.total);

		var itemsPerGroup = this.currentBreak.periodicCount,
			listGroups = Math.ceil(listItems.length / itemsPerGroup);

		this.container = this.element.find("[data-role='container']");
		this.list = this.container.find("[data-role='list']");

		listItems.unwrap();
		for (var i=0; i < this.total; i += itemsPerGroup) {
			var items = listItems.slice(i,i+itemsPerGroup).wrapAll('<ul data-role="item"></ul>');
		}
	},


	// Handle Swipe Events
	_handleSwipe: function(e) {
		if ( e.type === 'swipeleft' && !this.element.is( '.end' ) ) {
			this._next(true);
		} else if ( e.type === 'swiperight' && !this.element.is( '.start' ) ) {
			this._prev(true);
		}
	},
	
	// Handle Tabbing on items
	_handleTab: function(e) {
	
		// Check to see if the key pressed was the tab key
		if ( e.keyCode == 9 ) {
			
			// Check to see if shift was being held
			if ( e.shiftKey ) {
			
				// Since the user did shift + tab, move them back an item
				if ( !this.element.is( '.start' ) ) {
					e.preventDefault();
					this._prev(true);
				}
					
			} else {
			
				// Since the user tabbed, move them forward an item
				if ( !this.element.is( '.end' ) ) {
					e.preventDefault();
					this._next(true);
				}	
			
			}	
				
		}
	
	},
	
	// Handl mouseenter mouseleavee Mouse Events
	_handleMouse: function(e) {
		
		var target = $(e.target),
			index;
		
		
		// Manage the mouse and focus to see if we need to pause / play the auto-advance
		if ( e.type === 'mouseenter' || e.type === 'focusin' ) {
			
			if ( this.options.autoAdvance === true ) {
				this._pause();
			}
			
			return;
		} else if ( e.type === 'mouseleave' || e.type === 'focusout' ) {
			
			if ( this._paused == true ) {
				this._play();
			}
			
			return;
		}
		
		
		// Check for keyup and various important keys
		if ( e.type === 'keydown' ) {
		
			if ( e.keyCode === 36 ) {
			
				// We clicked the Home key
				e.preventDefault();
				index = 0;
				this.items.eq(0).focus();
				
			} else if ( e.keyCode === 35 ) {
			
				// We clilcked the End key
				e.preventDefault();
				index = this.total - this.groups.count;
				this.items.eq( this.total - 1 ).focus();
			
			// Catch any other key that isn't Enter	
			} else if ( e.keyCode == 9 ) {
				this.tabbing = true;
				return;
			} else if ( e.keyCode != 13 ) {
				return;
			} 
		
		} 
		
		// See if we're doing the click on an item to bring it to the active spot thing
		if ( this.options.tabs === true && this.activeItem === true ) {
			
			var listItem = target.closest( 'li' ),
				itemIndex = $.toInt( listItem.attr( 'index' ) );
			
			// Check to see if we clicked an item or a child element of an item
			if ( listItem.data( 'role' ) == 'item' ) {
				
				// Move us to the clicked item
				if ( this.countType === 'even' && itemIndex !== this._index ) {
					
					// Set the index equal to that of our item to move it into the first spot.
					index = itemIndex;
					
				} else if ( this.countType === 'odd' && ( itemIndex - this.distance ) !== this._index ) {
				
					// Set the index equal to the index of our item minus the distance it should be from the edge of our view. 
					// Distance is referring to the amount of items between the middle of our list and the sides of our container.
					index = itemIndex - this.distance;
				
				}
				
			}
			
		}
		
		
		if ( target.parents( '.minus' ).length ) {
			var target = target.parents( '.minus' );
		}    
			
		if (target.data('role') == 'nav' ) {
			switch (target.data('direction')) {
				case 'next':
					this._next();
					break;
				case 'prev':
					this._prev();
					break;
			}

			if (target.data('index') !== undefined) {
				if ( target.is( '.minus' ) ) {
					index = target.data('index') - 1;
				} else {
					index = target.data('index');
				}
			}

		}
		
		// If we have an index from all of the above stuff, run it.
		if (index !== undefined) {
			if ( this.options.infinite !== true ) {
				this._moveTo.apply(this, [index]);
			} else {
				this._infiniteMoveTo.apply(this, [index]);
			}
		}
	
	},

	next: function () {
		this._next.apply( this, arguments );
	},

	prev: function () {
		this._prev.apply( this, arguments );
	},
	
	_next: function(swiped) {
		
		if ( !swiped || this.options.scroll == 'single' ) {
			index = this._index + this.scroll;
		} else {
			
			var thumbs = this.nav.find('span[data-index]');
			
			if ( thumbs.length ) {
				index = thumbs.filter('.active').next().data( 'index' );
			} else {
				this.element.find( '[data-direction="next"]' ).click();
				return false;
			}
			
		}
		
		// Track the direction we went
		this.direction = 'forward';
		
		this._isTheBeginningOfAllThings = false;
		if ( this.options.infinite !== true ) {
			this._moveTo.apply(this, [index]);
		} else {
			this._infiniteMoveTo.apply(this, [index]);
		}
	},
	
	_prev: function(swiped) {
		if ( !swiped || this.options.scroll == 'single' ) {
			index = this._index - this.scroll;
		} else {
			
			var thumbs = this.nav.find('span[data-index]');
			
			if ( thumbs.length ) {
				index = thumbs.filter('.active').prev().data( 'index' );
			} else {
				this.element.find( '[data-direction="prev"]' ).click();
				return false;
			}
			
		}
		
		// Track the direction we went
		this.direction = 'backward';
		
		this._isTheEndOfAllThings = false;
		if ( this.options.infinite !== true ) {
			this._moveTo.apply(this, [index]);
		} else {
			this._infiniteMoveTo.apply(this, [index]);
		}
		
	},
	
	_autoPlay: function() {
		this._clearTimer();
		
		this._timer = setTimeout( $.proxy( this._next, this ), this.options.scrollSpeed );
		
	},
	
	_play: function () {
		
		this._clearTimer();
		this._paused = false;
		this._timer = setTimeout( $.proxy( this._next, this ), this.options.scrollSpeed );
			
	},
	
	_clearTimer: function () {
		if ( this._timer ) {
			clearTimeout( this._timer );
			this._timer = null;
		}
	},
	
	_pause: function () {
	
		this._clearTimer();
		this._paused = true;
		
	},
	
	_movingTime: function(distance, index) {
		
		// If the browser supports transforms, take advantage of it
		if (Modernizr && Modernizr.csstransforms) {
			// Set the translate to the percentage * the index of how many we are moved
			this.list.css('transform', this.styles.move + '(' + distance + '%)');
		}
		// Otherwise, use the appropriate fallback
		else {
			// Set the margin-left to the percentage * the index of how many we are moved
			this.list.css(this.styles.fallback, distance + '%');
		}
		
		// If we're doing an active item, go for it
		if ( this.activeItem === true ) {
			this.items.removeClass('active');	
			if ( this.countType === 'odd' ) {
				this.items.eq( this.groups.count / 2 - 0.5 + index ).addClass('active');
			} else {
				this.items.eq( index ).addClass('active');
			}
		}
		
		// If we're doing paging, update the active panel number
		if ( this.options.paging === true ) {
			
			// Find the active number depending on whether we're scrolling by singles or panels
			var activeNum = ( this.scroll == 'single' ) ? index + 1 : Math.ceil( index / this.groups.count ) + 1;
			
			// Set the new active Value
			this.paging.active.text( activeNum );
			
		}
		
		if ( this.options.autoAdvance && this.tabbing === false && this._paused === false ) {
			this._autoPlay();
		}		
		
	},
	
	_infiniteMoveTo: function(index) {
		var distance,
			preMoveIndex,
			outOfBounds,
			preDistance;
		
		
		// Check our index and take appropriate action
		if ( index >= ( this.items.length - ( this.distance * 2 ) ) && this.countType === 'odd' || index >= ( this.items.length - ( this.distance ) ) && this.countType === 'even' ) {
			// We've moved too far for the list so set the index to the first instance of our next item	
			preMoveIndex = index - ( this.items.length / 2 + 1 );
			index =  index - ( this.items.length / 2 );
			outOfBounds = true;
		} else if ( index < this.distance - 1 && this.countType === 'odd' || index < 0 && this.countType === 'even' ) {
			// We've moved too far backwards so set the index to the second instance of our item
			preMoveIndex = index + ( this.items.length / 2 + 1 );
			index = index + ( this.items.length / 2 );
			outOfBounds = true;
		} else {
			// Everything is cool, proceed in a casual manner
			outOfBounds = false;
		}
		
		// Track if we've seen an item before
		var activeItem = this.items.filter( '.active' ),
			backCheck = ( $.toInt( activeItem.attr( 'index' ) ) - ( this.total / 2 ) );
		
		// Mark the current active item as viewed
		activeItem.attr( 'viewed', true );
		
		// find that same item in our duplicated set
		if ( backCheck < 0 ) {
			this.items.eq( $.toInt( activeItem.attr( 'index' ) ) + ( this.total / 2 ) ).attr( 'viewed', true );
		} else {
			this.items.eq( backCheck ).attr( 'viewed', true );
		}
		
		// Check to see if we're tabbing and have seen all of the items
		if ( this.tabbing === true && this.items.eq( index + this.distance ).is( '[viewed="true"]' ) ) {
			
			var section = ( this.element.is( 'section' ) ) ? this.element : this.element.closest( 'section' ), 
				escapeItem = section.find( '[data-escapeitem="true"]' );
			
			// Check to see which direction we moved
			if ( this.direction === 'forward' ) {
				
				// Check to see if we have an escape item
				if ( escapeItem.length ) {
					
					// Since we have an item, focus on it.
					escapeItem.focus();
				
				} else {
				
					// Since we have no escape item designated, we need to find one
					// Get the next section
					section.next().attr( 'tabindex', 0 ).focus();
				
				}
				
			} else if ( this.direction === 'backward' ) {
			
				// Since we moved backwards, jump to the section
				section.attr( 'tabindex', 0 ).focus();
			
			}
			
			// Remove the viewed attributes to reset the list
			this.items.removeAttr( 'viewed' );
			
			return;
			
		}
		
		// Calculate the distance to move
		distance = (this.items.size * index) * -1;
		
		// If we're out of bounds on an infinite scroll, take appropriate measures to get in place before animating.
		if ( outOfBounds === true ) {
			
			// Get the distance to jump to before transitioning
			preDistance = (this.items.size * preMoveIndex) * -1;
			
			// Add no-transition class to make it speedy
			this.element.addClass( 'no-transition' );
			
			// Set the Immediate pre-trainsition distance
			this._movingTime(preDistance, preMoveIndex);
			
			var that = this;
			
			if ( this._infiniteTimer ) {
				clearTimeout( this._infiniteTimer );
			}
			this._infiniteTimer = setTimeout( function(){
			
				that.element.removeClass( 'no-transition' );
				that._movingTime(distance, index);
			
			}, 50 );
		
		} 
		// If we're not out of bounds, conduct business as usual
		else {
			this._movingTime(distance, index);
		}
		
		if (this.options.nav) {
			this.nav.find('span').removeClass('active').filter("[data-index='" + index + "']").addClass('active');
		}

		this._index = index;
		
	},

	go: function () {
		this._moveTo.apply( this, arguments );
	},

	key: function ( id ) {
		var items = this.element.find( "[data-item='i']" ),
			selected = items.filter( "[data-key='" + id + "']" ),
			index = items.index( selected );
		this._moveTo( index );
	},
	
	_moveTo: function(index) {
		var distance,
			savedIndex,
			outOfBounds,
			preDistance;
		
		// If we're using the tabs functionality, fire a trigger to activate the tab.
		if ( this.options.tabs === true && this.activeItem === true && index >= 0 ) {

			// Trigger an event to run the tabs script if the tabs script is in place.
			this.items.eq(index).trigger( 'outsideclick' );
		}
		
		// Logic Time!!!
		
		// If we don't want to wrap and we're either at the beginning or end of the list, do nothing.
		if ( this.options.nowrap === true && index < 0 && this._isTheBeginningOfAllThings === true || this.options.nowrap === true && this._isTheEndOfAllThings === true ) {
			return;
		}
		// If we're going too far, we're not already at the end of the list, and we don't want to show blank spaces.
		// Or if our index is less than 0, we're already at the beginning of the list, and we don't want to show blank spaces.
		// Move us to the end of the list
		else if (index + this.groups.count >= this.total && this._isTheEndOfAllThings === false && this.options.emptySpace === false || index < 0 && this._isTheBeginningOfAllThings === true && this.options.emptySpace === false ) {
			
			// save the original index so we can use it to set an active thumnail
			savedIndex = index;
			
			// Set the index to the last item in the list possible without showing empty spaces.
			index = this.total - this.groups.count;
			
			// Take care of the classes and variables to track where we are.
			this.element.addClass('end').removeClass('start');
			this._isTheEndOfAllThings = true;
			this._isTheBeginningOfAllThings = false;
			
		} 
		// If our index is less than 0, we're already at the beginngin of the list, and we do want blank spaces.
		// Or if our index if for our last item and our End of All Things attribute is false.
		// Move us to the last item possible in our list and setup the classes / variables for it.
		else if ( index < 0 && this._isTheBeginningOfAllThings === true && this.options.emptySpace === true || index + 1 === this.total && this._isTheEndOfAllThings === false ) {

			// Set the index to the last item in our list and show empty spaces if there are any.
			index = this.total - 1;

			// Take care of the classes and variables to track where we are.
			this.element.addClass('end').removeClass('start');
			this._isTheEndOfAllThings = true;
			this._isTheBeginningOfAllThings = false;

		}
		// If our index is equal to 0,
		// we're trying to move too far and we're already at the end of the list,
		// or our index is less than 0 and we're not already at the beginning of the list
		// Move us to the start of the list.
		else if ( index === 0 || index + this.groups.count >= this.total && this._isTheEndOfAllThings === true && this.options.emptySpace === false || index < 0 && this._isTheBeginningOfAllThings === false  || index >= this.total ) {
			
			// Reset the index to 0
			index = 0;
			
			// Take care of the classes and variables to track where we are.
			this.element.addClass('start').removeClass('end');
			this._isTheEndOfAllThings = false;
			this._isTheBeginningOfAllThings = true;
		
		} 
		// If everything is normal and we're just in the middle of the list somewhere,
		// casually handle the classes and variables to track where we are.
		else {
			this.element.removeClass('start end');
			this._isTheEndOfAllThings = false;
			this._isTheBeginningOfAllThings = false;
		}
		
		// Calculate the distance to move
		distance = (this.items.size * index) * -1;
		
		// Call the moving function
		this._movingTime(distance, index);
		
		// Set the active class on the thumbnail nav
		if (this.options.nav) {
			if ( savedIndex && this.options.scroll == 'panel' ) {
				this.nav.find('span').removeClass('active').filter("[data-index='" + savedIndex + "']").addClass('active');
			} else {
				this.nav.find('span').removeClass('active').filter("[data-index='" + index + "']").addClass('active');
			}
		}

		this._index = index;
		
		
	},

	_thumbNav: function() {
		this.nav = this.element.find("nav[data-role='thumbs']");
		for (var i = 0; i < this.groups.total; i++) {
			this.nav.append('<span data-role="nav" tabindex="0" data-index="' + (i * this.groups.count) + '" title="View group ' + (i + 1) + '">');
		}
		this.nav.find('span').first().addClass('active');
	},

	// Set sizing
	_setSizing: function() {
		switch (this.options.direction) {
			case 'vertical':
				// Get the height of the largest item or group of items in the list
				if ( this.options.count == 1 ) {
					this.container.size = this._maxHeight( this.items, this.groups.count );
				} else {
					this.container.size = this._maxHeight( this.items, this.groups.count, this.options.count );
				}

				this.styles = {
					prop: 'height',
					move: 'translateY',
					fallback: 'margin-top'
				}

				break;
			case 'horizontal':
			default:
				this.container.size = this.container.innerWidth();

				this.styles = {
					prop: 'width',
					move: 'translateX',
					fallback: 'margin-left'
				}
				break;
		}

		this.list.size = (((this.container.size / this.groups.count) * this.total - this.container.size) / this.container.size + 1) * 100;
		this.items.size = ((this.list.size / this.total) / this.list.size) * 100;
		this.groups.size = this.items.size * this.groups.count;


		// If we are scrolling vertically, we need to do a little extra work
		if (this.options.direction == 'vertical') {
			// Set the height so that the overflow will work
			this.container.height(this.container.size);
		}

		// Set size of the list as a percentage of the container
		this.list.css(this.styles.prop, this.list.size + '%');

		// Set size of the items as a percentage of the list 
		this.items.css(this.styles.prop, this.items.size + '%');
	},

	// Find out how many items we will be showing at once and see if we have enough items to active a scroller	
	_detectViewport: function(breakpoints, desktop, count) {
		var win = $(window).width();
		
		// If we are above tabletLandscape width, 
		if (win >= breakpoints.tabletLandscape.width &&
			// and there are enough items to fill more than one group
			count > desktop) {
			// Set up desktop version
			this.currentBreak = this.options;
			return desktop;
		}

		// If we are above tablet portrait width
		else if (win >= breakpoints.tabletPortrait.width &&
			// and below tablet landscape width
			win <= breakpoints.tabletLandscape.width &&
			// and there are enough items to fill more than one group
			count > breakpoints.tabletLandscape.count) {
			// set up the tabletLandscape version
			this.currentBreak = breakpoints.tabletLandscape;
			return breakpoints.tabletLandscape.count;
		}

		// If we are above mobile width
		else if (win >= breakpoints.mobile.width &&
			// and below table width
			win <= breakpoints.tabletPortrait.width &&
			// and there are enough items to fill more than one group
			count > breakpoints.tabletPortrait.count) {
			// set up the tabletPortrait version
			this.currentBreak = breakpoints.tabletPortrait;
			return breakpoints.tabletPortrait.count;
		}

		// If we are below mobile width
		else if (win <= breakpoints.mobile.width &&
			win >= breakpoints.smallMobile.width &&
			// and there are enough items to fill more than one group
			count > breakpoints.mobile.count) {
			// set up mobile
			this.currentBreak = breakpoints.mobile;
			return breakpoints.mobile.count;
		}
		
		// If we are below smallmobile width
		else if (win <= breakpoints.smallMobile.width &&
			// and there are enough items to fill more than one group
			count > breakpoints.smallMobile.count) {
			// set up mobile
			this.currentBreak = breakpoints.smallMobile;
			return breakpoints.smallMobile.count;
		}
		// we don't need to start, return false and quit
		else {
			this.element.addClass('no-scroll');
			this.currentBreak = 1;
			return false;
		}
	},

	// Find max height of scrollable elements
	_maxHeight: function(items, group, count) {
		var heights = [];

		// Iterate through the slides and get the heights
		for (var i = 0; i < items.length; i++) {
			heights.push(items.eq(i).outerHeight());
		}

		// Get the tallest height
		if ( count ) {
			return Math.max.apply( Math, heights ) * count;
		} else {
			return Math.max.apply( Math, heights );
		}
	},
	
	_destroy: function() {
		clearTimeout( this._timer );
		clearTimeout( this._infiniteTimer );
	}
});

	if ( window.register ) {
		window.register( '/includes/js/scrolling-list-script.js' );
	}

} );