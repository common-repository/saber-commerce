var WorkspaceEditor = {

	init: function() {

		// Definitions using EditorBase.
		EditorBase.setChildClass( 'WorkspaceEditor' );
		EditorBase.setRootElement( 'sacom-workspace-editor' );
		EditorBase.setObjectListLoaderHook( 'sacom_workspace_loader' );
		EditorBase.setParentIdKey( 'workspaceId' );

		// Initial rendering routine.
		EditorBase.renderPageHeader();
		WorkspaceEditor.renderListFilters();
		WorkspaceEditor.renderObjectListContainer();

		// Do initial list loading.
		WorkspaceEditor.loadList();

		WorkspaceEditor.parentObjectEditEvents();

		// Handler for closing overlay and return buttons.
		jQuery( document ).on( 'click', '#sacom-editor-overlay-close, #sacom-button-return button', function() {

			EditorBase.clearUx();
			EditorBase.renderPageHeader();
			WorkspaceEditor.renderListFilters();
			WorkspaceEditor.renderObjectListContainer();
			WorkspaceEditor.loadList();

		});

		/* Init sorting. */
		WorkspaceEditor.sortingSetup();

	},

	getPageTitleUppercase: function() {

		return "WORKSPACES";

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

	renderObjectListContainer: function() {

		let html = SacomRender.getObjectListHtml();
		jQuery( html ).appendTo( EditorBase.data.rootElement );

	},

	loadList: function() {

		EditorBase.request.loadList();

		jQuery( document ).off( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted' );
		jQuery( document ).on( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted', function() {

			var h = '';

			jQuery.each( EditorBase.data.objectList, function( index, item ) {

				h += WorkspaceEditor.makeListCard( item );

			});

			jQuery( '#sacom-object-list' ).html( h )

			// Create new button click.
			jQuery( document ).on('click', '#sacom-button-create', function() {

				WorkspaceEditor.modeSwitchEdit( 0 );

			});

		});

	},

	makeListCard: function( object ) {

		var h = '';
		h += '<div class="sacom-card" data-id="' + object.workspaceId + '">';

		// Card Header.
		h += '<div class="sacom-card-header">';
		h += '<h4>';
		h += 'Workspace ID #' + object.workspaceId;
		h += '</h4>';
		h += '</div>';

		// Card Body.
		h += '<div class="sacom-card-body">';
		h += '<h4>';
		h += object.title;
		h += '</h4>';
		h += '</div>';

		// Card footer.
		h += '<div class="sacom-card-footer">';
		h += '<h4>';
		h += "Account ID " + object.accountId;
		h += '</h4>';
		h += '</div>';

		// Close card.
		h += '</div>';

		return h;

	},

	modeSwitchEdit: function( objectId ) {

		EditorBase.clearUx();
		EditorBase.renderPageHeader();
		EditorBase.renderEditorGrid();
		EditorBase.renderOverlayCloseButton();
		WorkspaceEditor.renderEditForm();
		WorkspaceEditor.accountOptionLoader();

		if( objectId ) {

			let parentObject = EditorBase.getLoadedObjectModel( objectId );

			EditorBase.setCurrentParentObjectModel( parentObject );
			WorkspaceEditor.initEditMode();

			// Update Account ID.
			jQuery( '#stat-account-id h2' ).html( parentObject.accountId );

		} else {

			WorkspaceEditor.initCreateMode();

		}

		// Add save handler after UX rendered because it contains change events that may fire when setting up fields.
		WorkspaceEditor.parentSaveHandler();

		// Do script or jQuery plugin init.
		WorkspaceEditor.formScriptReinit();

	},

	renderEditForm: function() {

		var h = '';

		h += '<div id="account-editor-form" class="sacom-editor-form-primary">';
		h += '<input id="field-title" class="sacom-big-text-field" name="field-title" placeholder="Enter the workspace title." />';
		h += '</div>';

		h += WorkspaceEditor.getAccountFieldHtml();

		h += '<div id="stat-account-id" class="sacom-stat">';
		h += '<h2>-</h2>';
		h += '<h4>ACCOUNT ID</h4>';
		h += '</div>';

		// Add to DOM.
		var container = jQuery( '.sacom-editor-column-main' );
		container.html( h );

	},

	initCreateMode: function() {

		EditorBase.data.currentObjects.parent = {
			model: false
		}

	},

	parentSaveHandler: function() {

		jQuery( document ).off( 'change.save', '#field-title' );

		jQuery( document ).on( 'change.save', '#field-title', function() {

			WorkspaceEditor.parseParentForm();
			WorkspaceEditor.parentSaveRequest();

		});

	},

	formScriptReinit: function() {

		EditorBase.initBigSelectors();
		jQuery( '.select2' ).select2();

	},

	getAccountFieldHtml: function() {

		var h = '';
		h += '<div id="field-account" class="sacom-editor-big-selector sacom-cursor-pointer">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-shield" class="svg-inline--fa fa-user-shield fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M622.3 271.1l-115.2-45c-4.1-1.6-12.6-3.7-22.2 0l-115.2 45c-10.7 4.2-17.7 14-17.7 24.9 0 111.6 68.7 188.8 132.9 213.9 9.6 3.7 18 1.6 22.2 0C558.4 489.9 640 420.5 640 296c0-10.9-7-20.7-17.7-24.9zM496 462.4V273.3l95.5 37.3c-5.6 87.1-60.9 135.4-95.5 151.8zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm96 40c0-2.5.8-4.8 1.1-7.2-2.5-.1-4.9-.8-7.5-.8h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c6.8 0 13.3-1.5 19.2-4-54-42.9-99.2-116.7-99.2-212z"></path></svg>';
		h += '<select id="account" name="account"></select>';
		h += '<h3>ACCOUNT</h3>';
		h += '</div>';
		return h;

	},

	accountOptionLoader: function() {

		let data = {}
		wp.ajax.post( 'sacom_timesheet_account_option_loader', data ).done( function( response ) {

			let objects = response.accounts;
			let selectEl = jQuery( '#account' );
			selectEl.children().remove();

			jQuery.each( objects, function( index, item ) {

				selectEl.append( new Option( item.title, item.accountId ) );

			});

			/* Fire event "account_field_populated" */
			jQuery( '#account' ).trigger({
				type: 'account_field_populated'
			});

		});

	},

	parseParentForm: function() {

		if( EditorBase.data.currentObjects.parent.model === false ) {
			EditorBase.data.currentObjects.parent.model = {}
		}

		console.log( EditorBase.data.currentObjects.parent );

		EditorBase.data.currentObjects.parent.model.title = jQuery( '#field-title' ).val();
		EditorBase.data.currentObjects.parent.model.accountId = jQuery( '#account' ).val();

	},

	parentSaveRequest: function() {

		let data = {
			model: EditorBase.data.currentObjects.parent.model
		}
		wp.ajax.post( 'sacom_workspace_save', data ).done( function( response ) {


			jQuery( document ).trigger({

				type: 'sacom_workspace_saved',
				response: response

			});

			/* Show response message. */
			if( response.code === 200 ) {

				if( EditorBase.data.mode === 'create' ) {

					EditorBase.data.mode = 'edit';
					//TimesheetEditor.messages.showMessage( 'Timesheet created. Your timesheet was created successfully with ID ' + response.timesheet.timesheetId + '.' );

				} else {

					//TimesheetEditor.messages.showMessage( 'Timesheet saved. Your timesheet was updated successfully.' );

				}

			} else {

				// Show error message (not saved)
				//TimesheetEditor.messages.showMessage( 'Account could not be saved.' );

			}

			/* Update EditorBase parent data model. */
			EditorBase.data.currentObjects.parent.model = response.model;

		});

	},

	parentObjectEditEvents: function() {

		jQuery( document ).on( 'click', '#sacom-object-list .sacom-card', function() {

			let objectId = jQuery( this ).attr( 'data-id' );
			WorkspaceEditor.modeSwitchEdit( objectId );

		});

	},

	initEditMode: function() {

		let parentObject = EditorBase.getCurrentParentObjectModel();

		if( parentObject.title ) {
			jQuery( '#field-title' ).val( parentObject.title );
		} else {
			jQuery( '#field-title' ).attr( 'placeholder', 'Enter a title for this account.' );
		}

		if( parentObject.accountId ) {
			jQuery( '#account' ).val( parentObject.accountId );
		}

	},

	/* Sorting Functions */

	sortingSetup: function() {

		jQuery( document ).on( 'click', '#sort-asc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( WorkspaceEditor.sortAsc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Most Recent' );

		});

		jQuery( document ).on( 'click', '#sort-desc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( WorkspaceEditor.sortDesc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Oldest Accounts' );

		});

	},

	sortAsc: function( a, b ) {

		return a.accountId > b.accountId ? -1 : 1;

	},

	sortDesc: function( a, b ) {

		return a.accountId < b.accountId ? -1 : 1;

	},

}

WorkspaceEditor.init();
