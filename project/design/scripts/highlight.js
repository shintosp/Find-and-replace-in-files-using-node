//active links are not clickable
var disable_active_link = false;

//class applied to active text links
var activeClass = 'current';

/*active states, i.e all buttons that have corresponding (...)-a.*
e.g. if all (n-main-)(...).* have active states: ['n-main-']
only n-main-atty.gif and all (n-feat-)(...).* have active state: ['n-main-atty','n-feat']*/
var activeImages = [];

/*[['Page-Name','Scope-Filename.shtml', 'Scope-Directory/', 'Scope-Directory/ScopeFilename.shtml', (...)],(...)]
NOTE: YOU MUST PUT FULL PATH IN THESE ARRAYS - WITHOUT LEADING SLASH */
// Additional scopes to highlight
var addScopes = [];
// Scope exceptions (so that links are not highlighted)
var excScopes = [];

// Get current URL and domain
var url = location.href,
domain = url.replace(/([^:]*:\/\/[^\/]*)\/.*/gi, '$1'),
path = url.replace(/[^:]*:\/\/[^\/]*\/(.*)/gi, '$1');

// Prepare FSPageGroup and FSFilename depending on URL
var ats = document.getElementsByTagName('a');
if (url.indexOf('previewsite.do') > -1 || url.indexOf('JSPeditPageContent.do') > -1) {
	FSPageGroup = FSPageGroup ? FSPageGroup + '/' : '';
	var fileName = FSPageGroup + FSFilename + '.shtml';
	if (!FSPageGroup) FSPageGroup = FSFilename + '/';
	FSFilename = fileName;
} else {
	FSFilename = path;
	FSPageGroup = FSFilename.split('/')[0] + '/';
}

// Loop through anchors
for (var i=0, at; at=ats[i]; i++) {
	if (at.href.indexOf(domain) > -1) {
		var atPath = at.href.substring(domain.length + 1, at.href.length), atScope = 0, atExcept = 0;
		
		// Check for link href in additional scopes array
		for (var j=0, active; active=addScopes[j]; j++)
			if (FSFilename == active[0] || FSPageGroup == active[0])
				for (var k=1, scope; scope=active[k]; k++)
					if (atPath == scope) { atScope = 1; break; }
					
		// Check for link href in scope exceptions array
		for (var j=0, active; active=excScopes[j]; j++)
			if (FSFilename == active[0] || FSPageGroup == active[0])
				for (var k=1, scope; scope=active[k]; k++)
					if (atPath == scope) { atExcept = 1; break; }
		
		if (!atExcept) {
			if (atPath == FSPageGroup && FSPageGroup || atPath == FSFilename || atScope) {
				at.className += ' ' + activeClass;
				if (disable_active_link) at.removeAttribute('href'); // Make active links not clickable (if enabled)
				if (imgs = at.getElementsByTagName('img'))
					if (imgs.length) {
						img = imgs[0];
						if (img.className.match(/(^| )over( |$)/gi)) {
							img.className = img.className.replace(/(^| )over( |$)/gi, '$1$2');
							if (img.src.indexOf('-o.') < 0)	img.src = img.src.replace(/(\/[^\.]*)\.([^\.]*)$/gi, '$1-o.$2');
							// Handle active states
							for (var j=0, active; active=activeImages[j]; j++)
								if (img.src.indexOf(active) > -1) {	
									img.className += ' over activeimg';
									img.src = img.src.replace('-o.', '-a.');
									break;	
								}
						}
					}
			}
		}
	}
}