var AccountEditor = {

	init: function() {

		// List loading process.
		EditorBase.setChildClass( 'AccountEditor' );
		EditorBase.setRootElement( 'sacom-accounts' );
		EditorBase.setObjectListLoaderHook( 'sacom_account_loader' );
		EditorBase.setParentIdKey( 'accountId' );

		EditorBase.renderPageHeader();
		AccountEditor.renderListFilters();
		AccountEditor.renderObjectListContainer();
		AccountEditor.loadList();

		jQuery( '.list-section-header' ).html( 'Most Recent' );

		AccountEditor.returnToListEvents();
		AccountEditor.parentObjectEditEvents();

		/* Child object event handlers and setup. */
		AccountEditor.childObjectCreateButtonHandler();
		AccountEditor.childObjectDeleteButtonHandler();
		AccountEditor.childObjectDeleteConfirmationDialog();

		/* Init sorting. */
		AccountEditor.sortingSetup();

		/* Init context menu events. */
		EditorBase.initContextMenu();

		/* Init setting a user as primary account holder. */
		AccountEditor.childObjectSetPrimaryUserButtonHandler();

	},

	getPageTitleUppercase: function() {

		return "ACCOUNTS";

	},

	returnToListEvents: function() {

		jQuery( document ).on( 'click', '#sacom-editor-overlay-close, #sacom-button-return button', function() {

			EditorBase.clearUx();
			EditorBase.renderPageHeader();
			AccountEditor.renderListFilters();
			AccountEditor.renderObjectListContainer();
			AccountEditor.loadList();

		});

	},

	parentObjectEditEvents: function() {

		jQuery( document ).on( 'click', '#sacom-object-list .sacom-card', function() {

			let objectId = jQuery( this ).attr( 'data-id' );
			AccountEditor.modeSwitchEdit( objectId );

		});

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

				h += AccountEditor.makeListCard( item );

			});

			jQuery( '#sacom-object-list' ).html( h );

			// Create new button click.
			jQuery( document ).on('click', '#sacom-button-create', function() {

				AccountEditor.modeSwitchEdit( 0 );

			});

		});

	},

	modeSwitchEdit: function( objectId ) {

		EditorBase.clearUx();
		EditorBase.renderPageHeader();
		EditorBase.renderEditorGrid();
		EditorBase.renderOverlayCloseButton();
		AccountEditor.renderEditForm();
		AccountEditor.childObjectListRender();

		if( objectId ) {

			let account = EditorBase.getLoadedObjectModel( objectId );

			EditorBase.setCurrentParentObjectModel( account );
			AccountEditor.initEditMode();

			jQuery( '#stat-account-users-count h2' ).html( account.users.length );

			// Update Account ID.
			jQuery( '#stat-account-id h2' ).html( account.accountId );

		} else {

			AccountEditor.initCreateMode();

		}

		// Add save handler after UX rendered because it contains change events that may fire when setting up fields.
		AccountEditor.parentSaveHandler();

		/* Populate list of WP Users. */
		AccountEditor.wpUserOptionLoader();

		// Do script or jQuery plugin init.
		AccountEditor.formScriptReinit()

	},

	initCreateMode: function() {

		EditorBase.data.currentObjects.parent = {
			model: false
		}

	},

	initEditMode: function() {

		let account = EditorBase.getCurrentParentObjectModel();

		if( account.title ) {
			jQuery( '#field-title' ).val( account.title );
		} else {
			jQuery( '#field-title' ).attr( 'placeholder', 'Enter a title for this account.' );
		}


		/* Render existing child objects. */
		var childObjectItemHtml = '';
		jQuery.each( account.users, function( index, childObject ) {

			childObjectItemHtml += AccountEditor.childObjectItemHtml( childObject );

		});

		var container = jQuery( '.sacom-editor-child-object-list ul' );
		return jQuery( childObjectItemHtml ).appendTo( container )

	},

	parentSaveHandler: function() {

		jQuery( document ).off( 'change.save', '#field-title' );

		jQuery( document ).on( 'change.save', '#field-title', function() {

			AccountEditor.parseParentForm();
			AccountEditor.parentSaveRequest();

		});

	},

	parseParentForm: function() {

		if( EditorBase.data.currentObjects.parent.model === false ) {
			EditorBase.data.currentObjects.parent.model = {}
		}

		EditorBase.data.currentObjects.parent.model.title = jQuery( '#field-title' ).val();
		EditorBase.data.currentObjects.parent.model.wpUserId = 542;

	},

	parentSaveRequest: function() {

		let data = {
			model: EditorBase.data.currentObjects.parent.model
		}
		wp.ajax.post( 'sacom_account_save', data ).done( function( response ) {


			jQuery( document ).trigger({

				type: 'sacom_account_saved',
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

			// Update Account ID in case it's not already set.
			jQuery( '#stat-account-id h2' ).html( EditorBase.data.currentObjects.parent.model.accountId );


		});

	},

	renderEditForm: function() {

		var h = '';
		h += '<div id="account-editor-form" class="sacom-editor-form-primary">';
		h += '<input id="field-title" class="sacom-big-text-field" name="field-title" placeholder="Enter the account title." />';
		h += '</div>';

		h += '<div id="stat-account-users-count" class="sacom-stat">';
		h += '<h2>-</h2>';
		h += '<h4>ASSOCIATED USERS</h4>';
		h += '</div>';

		h += '<div id="stat-account-id" class="sacom-stat">';
		h += '<h2>-</h2>';
		h += '<h4>ACCOUNT ID</h4>';
		h += '</div>';

		// Add to DOM.
		var container = jQuery( '.sacom-editor-column-main' );
		container.html( h );

		// AccountEditor.formScriptReinit();

	},

	childObjectListRender: function() {

		var h = '';

		h += '<button id="associate-user-add-button" class="sacom-add-child-object-button">';
		h += 'Associate User';
		h += '</button>';

		h += '<div class="sacom-editor-child-object-form">';

		h += AccountEditor.getWpUserSelectorHtml();

		// Save and cancel buttons.
		h += '<div class="sacom-form-row-block child-object-save-row">';

		// Cancel button.
		h += '<button class="sacom-editor-child-object-cancel-button">';
		h += 'Cancel';
		h += '</button>';

		// Save button.
		h += '<button style="margin-left: auto;" class="sacom-editor-child-object-save-button">';
		h += '<span>';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check-circle" class="svg-inline--fa fa-check-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path></svg>';
		h += '</span>';
		h += '<span>';
		h += 'SAVE';
		h += '</span>';
		h += '</button>';
		h += '</div>';

		h += '</div>';


		h += '<div id="account-users-entry-grid" class="sacom-editor-child-object-list">';
		h += '<ul>';
		h += '</ul>';
		h += '</div>';

		jQuery( '.sacom-editor-column-right' ).append( h );

		// AccountEditor.formScriptReinit();

		/* Child object save button click. */
		jQuery( '.sacom-editor-child-object-save-button' ).on( 'click', function() {

			AccountEditor.childObjectFormHide();
			AccountEditor.childObjectFormParseValues();

			let model = EditorBase.data.currentObjects.child.model;

			// Get the user display name from temporary storage
			var matchedUser = false;

			jQuery.each( editorData.wpUsers, function( index, user ) {

				if( user.ID == model.wpUserId ) {
					matchedUser = user;
				}
			});

			model.wpUserLabel = matchedUser.data.display_name + " (" + matchedUser.data.user_email + ")"
			EditorBase.data.currentObjects.child.element = AccountEditor.childObjectItemRender( model );

			AccountEditor.childObjectSaveRequest();

		});

		/* Child object cancel button click. */
		jQuery( '.sacom-editor-child-object-cancel-button' ).on( 'click', function() {

			AccountEditor.childObjectFormHide();

		});

	},

	getWpUserSelectorHtml: function() {

		var h = '';
		h += '<div id="field-wp-user" class="sacom-editor-big-selector sacom-cursor-pointer">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-shield" class="svg-inline--fa fa-user-shield fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M622.3 271.1l-115.2-45c-4.1-1.6-12.6-3.7-22.2 0l-115.2 45c-10.7 4.2-17.7 14-17.7 24.9 0 111.6 68.7 188.8 132.9 213.9 9.6 3.7 18 1.6 22.2 0C558.4 489.9 640 420.5 640 296c0-10.9-7-20.7-17.7-24.9zM496 462.4V273.3l95.5 37.3c-5.6 87.1-60.9 135.4-95.5 151.8zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm96 40c0-2.5.8-4.8 1.1-7.2-2.5-.1-4.9-.8-7.5-.8h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c6.8 0 13.3-1.5 19.2-4-54-42.9-99.2-116.7-99.2-212z"></path></svg>';
		h += '<select id="field-wp-user-id" class="select2"></select>';
		h += '<h3>USER</h3>';
		h += '</div>';
		return h;

	},

	wpUserOptionLoader: function() {

		let objects = AccountEditor.filterUserList();

		let selectEl = jQuery( '#field-wp-user-id' );
		selectEl.children().remove();

		jQuery.each( objects, function( index, item ) {

			selectEl.append( new Option( item.data.display_name + " (" + item.data.user_email + ")", item.ID ) );

		});

		/* Fire event "account_field_populated" */
		jQuery( '#field-wp-user-id' ).trigger({
			type: 'sacom_account_editor_wp_user_field_populated'
		});

	},

	makeListCard: function( account ) {

		var h = '';
		h += '<div class="sacom-card" data-id="' + account.accountId + '">';

		// Card Header.
		h += '<div class="sacom-card-header">';
		h += '<h4>';
		h += 'Account ID #' + account.accountId;
		h += '</h4>';
		h += '</div>';

		// Card Body.
		h += '<div class="sacom-card-body">';
		h += '<h4>';
		h += account.title;
		h += '</h4>';
		h += '</div>';

		// Card footer.
		h += '<div class="sacom-card-footer">';
		h += '<h4>';
		h += account.users.length + " Associated Users";
		h += '</h4>';
		h += '</div>';

		// Close card.
		h += '</div>';

		return h;

	},

	childObjectCreateButtonHandler: function() {

		jQuery( document ).on( 'click', '.sacom-add-child-object-button', function() {

			AccountEditor.childObjectFormShow();
			// AccountEditor.entryFormInitDefaults();

			// Reset editor data stored current entry
			EditorBase.data.currentObjects.child = {
				model: {},
				element: false
			};

		});

	},

	childObjectFormShow: function() {

		jQuery( '.sacom-editor-child-object-form' ).show();
		jQuery( '.sacom-add-child-object-button' ).hide();

	},

	childObjectFormHide: function() {

		jQuery( '.sacom-editor-child-object-form' ).hide();
		jQuery( '.sacom-add-child-object-button' ).show();

	},

	childObjectFormParseValues: function() {

		if( !EditorBase.data.currentObjects.child.model.accountUserId ) {

			EditorBase.data.currentObjects.child.model = {};

		} else {

			EditorBase.data.currentObjects.child.model = {
				accountUserId: EditorBase.data.currentObjects.child.model.accountUserId
			};

		}

		EditorBase.data.currentObjects.child.model.accountId = EditorBase.data.currentObjects.parent.model.accountId;
		EditorBase.data.currentObjects.child.model.wpUserId = jQuery( '#field-wp-user-id' ).val();

	},

	childObjectSaveRequest: function() {

		/* do ajax request to save entry */
		let data = {
			model: EditorBase.data.currentObjects.child.model
		}

		wp.ajax.post( 'sacom_account_user_save', data ).done( function( response ) {

			AccountEditor.childObjectAfterSave( response );

		});

	},

	childObjectAfterSave( r ) {

		// Do cleanup (unloading) of stashed data for current entry.
		EditorBase.data.currentObjects.parent.model = r.parentModel;
		EditorBase.data.currentObjects.child.model  = r.childModel;

		EditorBase.data.currentObjects.child.element.attr( 'data-id', EditorBase.data.currentObjects.child.model.accountUserId );

		// AccountEditor.messages.showMessage( 'User associated to this account successfully.' );

		// Update associate accounts count.
		jQuery( '#stat-account-users-count h2' ).html( EditorBase.data.currentObjects.parent.model.users.length );

		jQuery( document ).trigger({

			type: 'sacom_account_user_saved',
			response: r

		});

	},

	childObjectItemRender: function( childObject ) {

		var h = '';
		h += '<li data-id="' + childObject.accountUserId + '">';
		h += '<div class="child-object-context-menu">'
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" class="svg-inline--fa fa-ellipsis-h fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>';
		h += '<ul>';
		h += '<li class="child-object-set-primary-user-button">';
		h += 'Set this user as the primary account holder';
		h += '</li>';
		h += '<li class="child-object-delete-button">';
		h += 'Remove this user';
		h += '</li>';
		h += '</ul>';
		h += '</div>';
		h += '<h3>';
		h += childObject.wpUserLabel;
		h += '</h3>';
		h += '</li>';

		var container = jQuery( '.sacom-editor-child-object-list ul' );
		return jQuery( h ).appendTo( container )

	},

	childObjectItemHtml: function( childObject ) {

		var h = '';
		h += '<li data-id="' + childObject.accountUserId + '">';
		h += '<div class="child-object-context-menu">'
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" class="svg-inline--fa fa-ellipsis-h fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>';
		h += '<ul>';
		h += '<li class="child-object-set-primary-user-button">';
		h += 'Set this user as the primary account holder';
		h += '</li>';
		h += '<li class="child-object-delete-button">';
		h += 'Remove this user';
		h += '</li>';
		h += '</ul>';
		h += '</div>';
		h += '<h3>';
		h += childObject.wpUserLabel;
		h += '</h3>';
		h += '</li>';

		return h;

	},

	childObjectDeleteButtonHandler: function() {

		jQuery( document ).on( 'click', '.child-object-delete-button', function() {

			// Set the current entry ID.
			EditorBase.data.currentObjects.child.rowElement = jQuery( this ).parents( 'li' );

			var objectId = jQuery( this ).parents( 'li' ).attr( 'data-id' );

			EditorBase.data.currentObjects.child.model = {
				accountUserId: objectId
			}

			// Open dialog confirmation.
			jQuery( '.sacom-dialog' ).dialog('open');

		});

	},

	childObjectSetPrimaryUserButtonHandler: function() {

		jQuery( document ).on( 'click', '.child-object-set-primary-user-button', function() {

			console.log('setting primary...')

			// Set the current entry ID.
			EditorBase.data.currentObjects.child.rowElement = jQuery( this ).parents( 'li' );

			var objectId = jQuery( this ).parents( 'li' ).attr( 'data-id' );

			EditorBase.data.currentObjects.child.model = {
				accountUserId: objectId
			}

			// Open dialog confirmation.
			jQuery( '.sacom-dialog-set-primary-user' ).dialog('open');

		});

	},

	childObjectDeleteConfirmationDialog: function() {

		EditorBase.data.rootElement.append( '<div class="sacom-dialog">Are you sure you want to remove this user from the account?</div>' );

		jQuery( '.sacom-dialog' ).dialog({
      resizable: false,
			autoOpen: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Delete Entry": function() {
					AccountEditor.childObjectDeleteProcess();
          jQuery( this ).dialog( "close" );
        },
        Cancel: function() {
          jQuery( this ).dialog( "close" );
        }
      }
    });

	},

	childObjectDeleteProcess: function() {

		let data = {
			accountUserId: EditorBase.data.currentObjects.child.model.accountUserId
		};

		wp.ajax.post( 'sacom_account_user_delete', data ).done( function( response ) {

			// Update data store.
			EditorBase.data.currentObjects.parent.model = response.parentModel;

			// Show message to user.
			// AccountEditor.messages.showMessage('Entry ID ' + response.entryId  + ' was successfully deleted.')

			// Remove entry from table.
			EditorBase.data.currentObjects.child.rowElement.remove();

			// Update associate accounts count.
			jQuery( '#stat-account-users-count h2' ).html( EditorBase.data.currentObjects.parent.model.users.length );

		});

	},

	/* Sorting Functions */

	sortingSetup: function() {

		jQuery( document ).on( 'click', '#sort-asc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( AccountEditor.sortAsc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Most Recent' );

		});

		jQuery( document ).on( 'click', '#sort-desc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( AccountEditor.sortDesc );
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

	formScriptReinit: function() {

		EditorBase.initBigSelectors();
		jQuery( '.select2' ).select2();

	},

	/*
	 *
	 * Filter User list
	 *
	 * The full list of WP Users is loaded into editorData.wpUsers using WP Localize Script.
	 * We don't want the same user associated twice to the same account, and instead of validating to avoid duplicates we want to avoid showing existing associated users in the selection list.
	 * This function strips away all the existing associated users from editorData.wpUsers and then stores it in the EditorBase.data storage.
	 * Called by AccountEditor.wpUserOptionLoader()
	 */
	filterUserList: function() {

		let objects = editorData.wpUsers;
		var refined = objects.filter( function( user ) {

			var keep = 1;

			jQuery.each( EditorBase.data.currentObjects.parent.model.users, function( index, accountUser ) {

				if( user.ID == accountUser.wpUserId ) {

					keep = 0;
					return false;

				}

			});

			return keep;

		});

		return refined;

	}

}

AccountEditor.init();
