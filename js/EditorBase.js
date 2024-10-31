var EditorBase = {

	data: {
		currentObjects: {
			parent: {
				model: false,
				element: false
			},
			child:  {
				model: false,
				element: false
			}
		}
	},

	init: function() {

		EditorBase.addClickHandlerHeaderLogo();

	},

	addClickHandlerHeaderLogo() {

		jQuery( document ).on( 'click', '#sacom-header-logo', function() {

			window.location = editorData.adminUrl + '/admin.php?page=sacom';

		});

	},

	setChildClass( className ) {

		EditorBase.data.childClass = className;

	},

	/*
	 * Sets the hook name from PHP for the list loader.
	 */
	setObjectListLoaderHook: function( hookName ) {

		EditorBase.data.objectListLoaderHook = hookName;

	},

	setRootElement: function( elementName ) {

		EditorBase.data.rootElement = jQuery( elementName );

	},

	getRootElement: function() {

		return EditorBase.data.rootElement;

	},

	setParentIdKey: function( parentIdKey ) {

		EditorBase.data.parentIdKey = parentIdKey;

	},

	/*
	 * Resets the entire UX.
	 */
	clearUx: function() {

		EditorBase.data.rootElement.html('');

	},

	getLoadedObjectModel: function( objectId ) {

		var objectMatch = 0;

		jQuery.each( EditorBase.data.objectList, function( index, object ) {

			if( object[ EditorBase.data.parentIdKey ] == objectId ) {
				objectMatch = object;
				return false;
			}

		});

		return objectMatch;

	},

	setCurrentParentObjectModel: function( object ) {

		EditorBase.data.currentObjects.parent.model = object;

	},

	getCurrentParentObjectModel: function() {

		return EditorBase.data.currentObjects.parent.model;

	},

	request: {

		loadList: function() {

			let data = {}
			wp.ajax.post( EditorBase.data.objectListLoaderHook, data ).done( function( response ) {

				EditorBase.data.objectList = response.objects;

				jQuery( document ).trigger({
					type: 'sacom_editor_object_list_loaded'
				});

			});

		}

	},

	initBigSelectors: function() {

		// Display current values.
		jQuery( '.sacom-editor-big-selector' ).each( function( index ) {

			var el = jQuery( this );
			var currentVal = el.find( 'select' ).val();
			el.find( 'h2' ).html( currentVal );

		})

		jQuery( document ).on( 'click', '.sacom-editor-big-selector', function() {

			let bigSelectorEl = jQuery( this );
			let selectEl = jQuery( this ).find( 'select' )
			selectEl.show();
			bigSelectorEl.find( '.select2-container' ).show().focus();

			selectEl.on( 'change', function() {

				var optionText = jQuery( this ).find( 'option:selected' ).text();
				var value = jQuery( this ).val();

				// Update display value.
				jQuery( this ).parents( '.sacom-editor-big-selector' ).find( 'h2' ).html( optionText );

			});

		});

		jQuery( document ).on('focusout', '.sacom-editor-big-selector', function() {

			let bigSelectorEl = jQuery( this );
			let selectEl = jQuery( this ).find( 'select' )
			selectEl.hide();
			bigSelectorEl.find( '.select2-container' ).hide()
			selectEl.off( 'change' );

		});

	},

	initContextMenu: function() {

		jQuery( document ).on( 'click', '.child-object-context-menu', function() {

			jQuery( this ).find( 'ul' ).show();

			jQuery( document ).on( 'click.close-context-menu', function( event ) {

				if ( !jQuery( event.target ).is( '.child-object-context-menu ul' )) {

					jQuery( '.child-object-context-menu ul' ).hide();

					jQuery( document ).off( 'click.close-context-menu' );

				}



			});

		});

	},

	renderPageHeader: function() {

		var headerEl = SacomRender.getPageHeaderElement();
		var headerHtml = '';
		headerHtml += SacomRender.getLogoHtml();

		// Not all child classes will have the property childObjectViewOnly.
		if( EditorBase.child().hasOwnProperty( 'childObjectViewOnly' ) && EditorBase.child().childObjectViewOnly !== true ) {

			// No create button.

		} else {

			headerHtml += SacomRender.getCreateButton();

		}



		headerHtml += SacomRender.getReturnButton();

		var data = {
			pageTitleUppercase: EditorBase.child().getPageTitleUppercase(),
			subheaderButtons: ''
		}

		if( EditorBase.child().hasOwnProperty( 'getSubheaderButtons' ) ) {

			data.subheaderButtons = EditorBase.child().getSubheaderButtons();

		}

		var subheaderHtml = SacomRender.getSubheaderEl( data );


		var header = jQuery( headerEl ).appendTo( EditorBase.data.rootElement );
		header.append( headerHtml );
		jQuery( subheaderHtml ).appendTo( EditorBase.data.rootElement );

	},

	// Returns the defined child class object.
	child: function() {
		return window[ EditorBase.data.childClass ];
	},

	renderListFilters: function() {

		// Filters.
		var html = '';

		// Sorting options.
		html += '<div class="sacom-filters">';
		html += '<h3 id="sort-asc" class="active">Newest First</h3>';
		html += '<h3 id="sort-desc">Oldest First</h3>';
		html += '</div>';

		html += '<h3 class="list-section-header"></h3>';

		jQuery( html ).appendTo( EditorBase.data.rootElement );

	},

	editClickEvent: function() {

		jQuery( document ).on( 'click', '.sacom-editor-child-object-list li .child-object-list-item-body', function() {

			let childObjectId = jQuery( this ).parents( 'li' ).attr( 'data-id' );
			window[ EditorBase.data.childClass ].childObjectStartEdit( childObjectId );

			// Scroll up to edit form.
			let childObjectFormEl = jQuery( '.sacom-editor-child-object-form' );
			jQuery( window ).scrollTop( childObjectFormEl.position().top );

		});

	},

	childEditCancelEvent: function() {

		/* Child object cancel button click. */
		jQuery( '.sacom-editor-child-object-cancel-button' ).on( 'click', function() {

			window[ EditorBase.data.childClass ].childObjectFormHide();

		});

	},

	parseHash: function() {

		var route = {
			segments: location.hash.split( '/' )
		};

		if( route.segments <= 2 ) {

			route.action   = 'list';
			route.objectId = 0;

		} else {

			route.action   = route.segments[1];
			route.objectId = route.segments[2];

		}

		return route;

	},

	renderEditorGrid: function( cols ) {

		var h = '';
		h += '<div id="sacom-editor-grid">';

		/* Editor grid header. */
		h += '<div id="editor-grid-header">';
		h += '<div id="editor-message-container">';
		h += '</div>';
		h += '</div>';

		/* Editor grid body. */
		if( cols == 1 ) {

			h += '<div id="editor-grid-body" class="sacom-editor-grid-single-col">';

		} else {

			h += '<div id="editor-grid-body">';

		}

		h += '<div id="sacom-editor-column-main" class="sacom-editor-column-main">';
		h += '</div>';
		h += '<div id="sacom-editor-column-right" class="sacom-editor-column-right">';
		h += '</div>';
		h += '</div>';

		h += '</div>';
		EditorBase.data.rootElement.append( h );

	},

	renderOverlayCloseButton: function() {

		var h = '';
		h += '<div id="sacom-editor-overlay-close">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="window-close" class="svg-inline--fa fa-window-close fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z"></path></svg>';
		h += '</div>';
		EditorBase.data.rootElement.find( '#sacom-editor-grid' ).append( h );

	},

}
