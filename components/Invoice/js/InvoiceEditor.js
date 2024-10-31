var InvoiceEditor = {

	init: function() {

		EditorBase.setChildClass( 'InvoiceEditor' );
		EditorBase.setRootElement( 'sacom-invoice-editor' );
		EditorBase.setObjectListLoaderHook( 'sacom_invoice_loader' );
		EditorBase.setParentIdKey( 'invoiceId' );

		// Do route parsing from location hash.
		let route = EditorBase.parseHash();

		// Do load list request.
		EditorBase.request.loadList();

		// Render page header.
		EditorBase.renderPageHeader();

		// Do routing.
		if( route.action === 'view' ) {

			jQuery( document ).on( 'sacom_editor_object_list_loaded', function() {

				InvoiceEditor.modeSwitchEdit( route.objectId );

			});

		} else {

			// Default load list.
			EditorBase.renderListFilters();
			InvoiceEditor.renderObjectListContainer();
			InvoiceEditor.loadList();

		}

		InvoiceEditor.parentObjectEditEvents();

		/* Child object event handlers and setup. */
		InvoiceEditor.childObjectCreateButtonHandler();
		InvoiceEditor.childObjectDeleteButtonHandler();

		jQuery( document ).on( 'click', '.sacom-editor-child-object-list li .child-object-list-item-body', function() {

			let childObjectId = jQuery( this ).parents( 'li' ).attr( 'data-id' );
			InvoiceEditor.childObjectStartEdit( childObjectId );

			// Scroll up to edit form.
			let childObjectFormEl = jQuery( '.sacom-editor-child-object-form' );
			jQuery( window ).scrollTop( childObjectFormEl.position().top );

		});

		// Handler for closing overlay and return buttons.
		jQuery( document ).on( 'click', '#sacom-editor-overlay-close, #sacom-button-return button', function() {

			EditorBase.clearUx();
			EditorBase.renderPageHeader();
			InvoiceEditor.renderListFilters();
			InvoiceEditor.renderObjectListContainer();
			InvoiceEditor.loadList();

		});

		/* Init sorting. */
		InvoiceEditor.sortingSetup();

		/* Init context menu events. */
		EditorBase.initContextMenu();

		/* Create new button click handler */
		InvoiceEditor.createNewButtonClick();

		// PDF event handlers.
		InvoiceEditor.downloadPdfEvent();
		InvoiceEditor.sendInvoiceEvent();
		InvoiceEditor.generatePdfRequest();

		/* Init EditorBase */
		EditorBase.init();

	},

	getPageTitleUppercase: function() {

		return "INVOICES";

	},

	createNewButtonClick: function() {

		// Create new button click.
		jQuery( document ).on( 'click', '#sacom-button-create', function() {
			InvoiceEditor.modeSwitchEdit( 0 );
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

	loadList() {

		if( EditorBase.data.objectList === undefined ) {

			// @TODO this does not look right, why is this on handler here?
			// This should be a loading handler, if list empty send load request.
			jQuery( document ).off( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted' );
			jQuery( document ).on( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted', function() {

				InvoiceEditor.renderList();

			});

		} else {

			InvoiceEditor.renderList();

		}

	},

	renderList: function() {

		var html = '';

		jQuery.each( EditorBase.data.objectList, function( index, item ) {

			html += '<div class="sacom-card" data-id="' + item.invoiceId + '">';

			/* Id. */
			html += '<div class="invoice-item-id">';
			html += '<h5>Invoice ID ';
			html += item.invoiceId;
			html += '</h5>';
			html += '</div>';


			/* Title. */
			html += '<div class="invoice-item-title">';
			html += '<h2>';

			if( item.title ) {
				html += item.title;
			} else {
				html += 'No Title Set';
			}

			html += '</h2>';
			html += '</div>';

			// Account title.
			html += '<h4 class="italic-medium">';
			if( item.account.title ) {
				html += item.account.title;
			} else {
				html += 'No account set.';
			}

			html += '</h4>';

			/* Dates. */
			let dayStart = dayjs( item.dateStart );
			let dayEnd = dayjs( item.dateEnd );
			html += '<div class="invoice-item-dates">';
			html += '<h3>';
			html += dayStart.format( 'MMMM D' ) + ' to ' + dayEnd.format( 'MMMM D' );
			html += '</h3>';
			html += '</div>';

			/* card footer */
			html += '<div class="sacom-card-footer">';
			html += '</div>';

			html += '</div>';

		});

		html += '</div>';

		jQuery( '#sacom-object-list' ).html( html )

		// Edit button click.
		jQuery('.invoice-item').on('click', function() {

			let objectId = jQuery( this ).attr( 'data-id' );
			InvoiceEditor.modeSwitchEdit( objectId );

		});

	},

	parentObjectEditEvents: function() {

		jQuery( document ).on( 'click', '#sacom-object-list .sacom-card', function() {

			let objectId = jQuery( this ).attr( 'data-id' );
			InvoiceEditor.modeSwitchEdit( objectId );

		});

	},

	modeSwitchEdit: function( objectId ) {

		console.log( 'switch edit mode...' + objectId)

		EditorBase.clearUx();
		EditorBase.renderPageHeader();
		EditorBase.renderEditorGrid();
		EditorBase.renderOverlayCloseButton();
		InvoiceEditor.parentFormRender();
		InvoiceEditor.childObjectListRender();

		// Dynamic selector loading.
		InvoiceEditor.accountOptionLoader();

		InvoiceEditor.childObjectDeleteConfirmationDialog();

		if( objectId ) {

			var parentObject = EditorBase.getLoadedObjectModel( objectId );

			EditorBase.setCurrentParentObjectModel( parentObject );
			InvoiceEditor.initEditMode();

		} else {

			InvoiceEditor.initCreateMode();

		}

		// Add save handler after UX rendered because it contains change events that may fire when setting up fields.
		InvoiceEditor.parentSaveHandler();

	},

	parentFormRender: function() {

		var h = '';

		h += '<div id="account-editor-form" class="sacom-editor-form-primary">';
		h += '<input id="field-title" class="sacom-big-text-field" name="field-title" placeholder="Enter the invoice title." />';
		h += '</div>';

		h += InvoiceEditor.getAccountFieldHtml();

		h += '<div id="stat-invoice-total" class="sacom-stat">';
		h += '<h2>$0.00</h2>';
		h += '<h4>GRAND TOTAL</h4>';
		h += '</div>';

		h += '<div id="stat-invoice-id" class="sacom-stat">';
		h += '<h2>-</h2>';
		h += '<h4>INVOICE ID</h4>';
		h += '</div>';

		h += '<div id="stat-account-id" class="sacom-stat">';
		h += '<h2>-</h2>';
		h += '<h4>ACCOUNT ID</h4>';
		h += '</div>';

		// Add to DOM.
		var container = jQuery( '.sacom-editor-column-main' );
		container.html( h );

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

	childObjectListRender: function() {

		var h = '';

		// Child object add button.
		h += '<button id="invoice-line-add-button" class="sacom-add-child-object-button">';
		h += '<span>+ Add Line Item</span>';
		h += '<span>'
		h += '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="file-alt" class="svg-inline--fa fa-file-alt fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M288 248v28c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-28c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm-12 72H108c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12v-28c0-6.6-5.4-12-12-12zm108-188.1V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48C0 21.5 21.5 0 48 0h204.1C264.8 0 277 5.1 286 14.1L369.9 98c9 8.9 14.1 21.2 14.1 33.9zm-128-80V128h76.1L256 51.9zM336 464V176H232c-13.3 0-24-10.7-24-24V48H48v416h288z"></path></svg>';
		h += '</span>';
		h += '</button>';

		h += '<div class="sacom-editor-child-object-form">';

		h += '<div class="sacom-invoice-line-item-row">';
		h += '<input id="field-memo" placeholder="Enter a memo." />';
		h += '<input id="field-amount" placeholder="$0.00" />';
		h += '</div>';

		h += '<div class="sacom-invoice-line-item-row">';
		h += '<input id="field-rate" placeholder="10.00" />';
		h += '<input id="field-quantity" placeholder="1" />';
		h += '</div>';

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


		h += '<div id="invoice-lines-grid" class="sacom-editor-child-object-list">';
		h += '<ul>';
		h += '</ul>';
		h += '</div>';

		jQuery( '.sacom-editor-column-right' ).append( h );

		InvoiceEditor.formScriptReinit();

		/* Child object save button click. */
		jQuery( '.sacom-editor-child-object-save-button' ).on( 'click', function() {

			InvoiceEditor.childObjectFormHide();
			InvoiceEditor.childObjectFormParseValues();
			InvoiceEditor.childObjectSaveRequest();

		});

		/* Child object cancel button click. */
		jQuery( '.sacom-editor-child-object-cancel-button' ).on( 'click', function() {

			InvoiceEditor.childObjectFormHide();

		});

	},

	/* Sorting Functions */

	sortingSetup: function() {

		jQuery( document ).on( 'click', '#sort-asc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( InvoiceEditor.sortAsc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Most Recent' );

		});

		jQuery( document ).on( 'click', '#sort-desc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( InvoiceEditor.sortDesc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Oldest Invoices' );

		});

	},

	sortAsc: function( a, b ) {

		return parseFloat( a.invoiceId ) > parseFloat( b.invoiceId ) ? -1 : 1;

	},

	sortDesc: function( a, b ) {

		return parseFloat( a.invoiceId ) < parseFloat( b.invoiceId ) ? -1 : 1;

	},

	accountOptionLoader: function() {

		let data = {}
		wp.ajax.post( 'sacom_invoice_account_option_loader', data ).done( function( response ) {

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

	initEditMode: function() {

		let parentObject = EditorBase.getCurrentParentObjectModel();

		if( parentObject.title ) {
			jQuery( '#field-title' ).val( parentObject.title );
		} else {
			jQuery( '#field-title' ).attr( 'placeholder', 'Enter a title for this account.' );
		}

		jQuery( '#account' ).val( parentObject.accountId );

		// Set invoice total.
		jQuery( '#stat-invoice-total h2' ).html( '$' + EditorBase.data.currentObjects.parent.model.total );

		// Set account ID.
		jQuery( '#stat-account-id h2' ).html( EditorBase.data.currentObjects.parent.model.accountId );

		// Set invoice ID.
		jQuery( '#stat-invoice-id h2' ).html( EditorBase.data.currentObjects.parent.model.invoiceId );

		/* Render existing child objects. */
		InvoiceEditor.childObjectItemsRender();

		// Show buttons only available in edit mode.
		InvoiceEditor.showPdfDownloadButton();
		InvoiceEditor.showSendButton();

	},

	childObjectItemsRender: function() {

		let parentObject = EditorBase.getCurrentParentObjectModel();

		var childObjectItemHtml = '';
		jQuery.each( parentObject.lines, function( index, childObject ) {

			childObjectItemHtml += InvoiceEditor.childObjectItemHtml( childObject );

		});

		var container = jQuery( '.sacom-editor-child-object-list ul' );
		jQuery( container ).html( childObjectItemHtml );

	},

	parentSaveHandler: function() {

		jQuery( document ).off( 'change.save', '#field-title, #account' );

		jQuery( document ).on( 'change.save', '#field-title, #account', function() {

			InvoiceEditor.parseParentForm();
			InvoiceEditor.parentSaveRequest();

		});

	},

	parseParentForm: function() {

		if( EditorBase.data.currentObjects.parent.model === false ) {
			EditorBase.data.currentObjects.parent.model = {}
		}

		EditorBase.data.currentObjects.parent.model.title     = jQuery( '#field-title' ).val();
		EditorBase.data.currentObjects.parent.model.accountId = jQuery( '#account' ).val();

	},

	parentSaveRequest: function() {

		let data = {
			model: EditorBase.data.currentObjects.parent.model
		}
		wp.ajax.post( 'sacom_invoice_save', data ).done( function( response ) {

			/* Show response message. */
			if( response.code === 200 ) {

				if( EditorBase.data.mode === 'create' ) {

					EditorBase.data.mode = 'edit';
					//InvoiceEditor.messages.showMessage( 'Timesheet created. Your timesheet was created successfully with ID ' + response.timesheet.timesheetId + '.' );

				} else {

					//InvoiceEditor.messages.showMessage( 'Timesheet saved. Your timesheet was updated successfully.' );

				}

			} else {

				// Show error message (not saved)
				//InvoiceEditor.messages.showMessage( 'Account could not be saved.' );

			}

			/* Update EditorBase parent data model. */
			EditorBase.data.currentObjects.parent.model = response.model;

			/* Fire sacom_invoice_saved event. */
			jQuery( document ).trigger({

				type: 'sacom_invoice_saved',
				response: response

			});

			// Update Invoice ID in case it's not already set.
			jQuery( '#stat-invoice-total h2' ).html( '$' + EditorBase.data.currentObjects.parent.model.total );

			// Update Invoice ID in case it's not already set.
			jQuery( '#stat-invoice-id h2' ).html( EditorBase.data.currentObjects.parent.model.invoiceId );

			// Update Account ID in case it's not already set.
			jQuery( '#stat-account-id h2' ).html( EditorBase.data.currentObjects.parent.model.accountId );

		});

	},

	childObjectCreateButtonHandler: function() {

		jQuery( document ).on( 'click', '.sacom-add-child-object-button', function() {

			InvoiceEditor.childObjectFormShow();
			InvoiceEditor.entryFormInitDefaults();

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

		if( !EditorBase.data.currentObjects.child.model.invoiceLineId ) {

			EditorBase.data.currentObjects.child.model = {};

		} else {

			EditorBase.data.currentObjects.child.model = {
				invoiceLineId: EditorBase.data.currentObjects.child.model.invoiceLineId
			};

		}

		if( EditorBase.data.currentObjects.parent.model.invoiceId == undefined ) {
			EditorBase.data.currentObjects.child.model.invoiceId = 0;
		} else {
			EditorBase.data.currentObjects.child.model.invoiceId = EditorBase.data.currentObjects.parent.model.invoiceId;
		}

		EditorBase.data.currentObjects.child.model.memo      = jQuery( '#field-memo' ).val();
		EditorBase.data.currentObjects.child.model.rate      = jQuery( '#field-rate' ).val();
		EditorBase.data.currentObjects.child.model.quantity      = jQuery( '#field-quantity' ).val();
		EditorBase.data.currentObjects.child.model.amount    = jQuery( '#field-amount' ).val().replace( '$', '' );

	},

	childObjectSaveRequest: function() {

		/* do ajax request to save entry */
		let data = {
			model: EditorBase.data.currentObjects.child.model
		}

		wp.ajax.post( 'sacom_invoice_line_save', data ).done( function( response ) {

			InvoiceEditor.childObjectAfterSave( response );

		});

	},

	childObjectAfterSave( r ) {

		// Do cleanup (unloading) of stashed data for current entry.
		EditorBase.data.currentObjects.parent.model = r.parentModel;
		EditorBase.data.currentObjects.child.model  = r.childModel;


		InvoiceEditor.childObjectItemsRender();
		// InvoiceEditor.messages.showMessage( 'User associated to this account successfully.' );

		// Update associate accounts count.
		jQuery( '#stat-account-id h2' ).html( EditorBase.data.currentObjects.parent.model.accountId );

		// Update invoice total.
		jQuery( '#stat-invoice-total h2' ).html( '$' + EditorBase.data.currentObjects.parent.model.total );

		jQuery( document ).trigger({

			type: 'sacom_invoice_line_saved',
			response: r

		});

	},

	formScriptReinit: function() {

		EditorBase.initBigSelectors();

		new Cleave( '#field-amount', {
			numeral: true,
			prefix: '$'
		});

	},

	childObjectItemHtml: function( childObject ) {

		var h = '';
		h += '<li data-id="' + childObject.invoiceLineId + '">';

		// Context menu.
		h += '<div class="child-object-context-menu">'
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" class="svg-inline--fa fa-ellipsis-h fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>';
		h += '<ul>';
		h += '<li class="child-object-delete-button">';
		h += 'Remove this line.';
		h += '</li>';
		h += '</ul>';
		h += '</div>';

		// Item body.
		h += '<div class="child-object-list-item-body">';
		h += '<h3>';
		h += childObject.memo;
		h += '</h3>';
		h += '<h4>';
		h += '$' + childObject.amount;
		h += '</h4>';
		h += '</div>';

		h += '</li>';

		return h;

	},

	childObjectStartEdit: function( childObjectId ) {

		InvoiceEditor.childObjectFormShow();

		let currentParentObject = EditorBase.getCurrentParentObjectModel();

		jQuery.each( currentParentObject.lines, function( index, childModel ) {

			if( childModel.invoiceLineId === childObjectId ) {
				EditorBase.data.currentObjects.child.model = childModel;
			}

		});

		let childModel = EditorBase.data.currentObjects.child.model;

		InvoiceEditor.entryFormInit( childModel );

	},

	entryFormInit: function( object ) {

		jQuery( '#field-memo' ).val( object.memo );
		jQuery( '#field-rate' ).val( object.rate );
		jQuery( '#field-quantity' ).val( object.quantity );
		jQuery( '#field-amount' ).val( object.amount );

	},

	entryFormInitDefaults: function() {

		/*
		 * Set form field defaults.
		 */
		jQuery( '#field-memo' ).val('');
		jQuery( '#field-rate' ).val('');
		jQuery( '#field-quantity' ).val('');
		jQuery( '#field-amount' ).val('');

	},

	initCreateMode: function() {

		EditorBase.data.currentObjects.parent = {
			model: false
		}

	},

	childObjectDeleteButtonHandler: function() {

		jQuery( document ).on( 'click', '.child-object-delete-button', function() {

			// Set the current entry ID.
			EditorBase.data.currentObjects.child.rowElement = jQuery( this ).parents( 'li' );

			var objectId = jQuery( this ).parents( 'li' ).attr( 'data-id' );

			EditorBase.data.currentObjects.child.model = {
				invoiceLineId: objectId
			}

			// Open dialog confirmation.
			jQuery( '.sacom-dialog' ).dialog('open');

		});

	},

	childObjectDeleteConfirmationDialog: function() {

		let dialogEl = jQuery( '.sacom-dialog' );
		if( dialogEl.length > 0 ) {
			return;
		}

		EditorBase.data.rootElement.append( '<div class="sacom-dialog">Are you sure you want to delete this invoice line item?</div>' );

		jQuery( '.sacom-dialog' ).dialog({
      resizable: false,
			autoOpen: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Delete Entry": function() {
					InvoiceEditor.childObjectDeleteProcess();
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
			invoiceLineId: EditorBase.data.currentObjects.child.model.invoiceLineId
		};

		wp.ajax.post( 'sacom_invoice_line_delete', data ).done( function( response ) {

			// Update data store.
			EditorBase.data.currentObjects.parent.model = response.parentModel;

			// Show message to user.
			// InvoiceEditor.messages.showMessage('Entry ID ' + response.entryId  + ' was successfully deleted.')

			// Remove entry from table.
			EditorBase.data.currentObjects.child.rowElement.remove();

			// Update associate accounts count.
			jQuery( '#stat-account-id h2' ).html( EditorBase.data.currentObjects.parent.model.accountId );

			// Update total.
			jQuery( '#stat-invoice-total h2' ).html( '$' + EditorBase.data.currentObjects.parent.model.total );

		});

	},

	getSubheaderButtons: function() {

		var h = '';

		h += '<button id="invoice-send-button" class="sacom-button">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="envelope" class="svg-inline--fa fa-envelope fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path></svg>';
		h += '<span>';
		h += 'Send Invoice';
		h += '</span>';
		h += '</button>';

		h += '<button id="invoice-pdf-download-button" class="sacom-button">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-pdf" class="svg-inline--fa fa-file-pdf fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"></path></svg>';
		h += '<span>';
		h += 'Download PDF';
		h += '</span>';
		h += '</button>';

		return h;

	},

	downloadPdfEvent: function() {

		jQuery( document ).on( 'click', '#invoice-pdf-download-button', function() {

			window.open( EditorBase.data.currentObjects.parent.model.pdfDownloadUrl, '_blank' );

		});

	},

	sendInvoiceEvent: function() {

		jQuery( document ).on( 'click', '#invoice-send-button', function() {

			let data = {
				invoiceId: EditorBase.data.currentObjects.parent.model.invoiceId
			};

			wp.ajax.post( 'sacom_invoice_send', data ).done( function( response ) {

				console.log( response )

			});

		});

	},

	generatePdfRequest: function() {

		jQuery( document ).on( 'sacom_invoice_saved', function() {

			let invoice = EditorBase.data.currentObjects.parent.model;

			let data = {
				invoice: invoice
			};

			wp.ajax.post( 'sacom_invoice_pdf', data ).done( function( response ) {

				// Update display of button.
				InvoiceEditor.showPdfDownloadButton();

			});

		});

	},

	showPdfDownloadButton: function() {

		// Show PDF download button.
		jQuery( '#invoice-pdf-download-button' ).css( 'display', 'flex' );

	},

	showSendButton: function() {

		// Show send button.
		jQuery( '#invoice-send-button' ).css( 'display', 'flex' );

	}

}


InvoiceEditor.init();
