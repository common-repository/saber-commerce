/*
 * TimesheetEditor
 *
*/

var TimesheetEditor = {

	init: function() {

		EditorBase.setChildClass( 'TimesheetEditor' );
		EditorBase.setRootElement( 'timesheet-editor' );
		EditorBase.setObjectListLoaderHook( 'sacom_timesheet_loader' );
		EditorBase.setParentIdKey( 'timesheetId' );

		EditorBase.renderPageHeader();
		EditorBase.renderListFilters();
		TimesheetEditor.renderObjectListContainer();
		TimesheetEditor.loadList();

		/* Entry event handlers. */
		TimesheetEditor.entryAddButtonHandler();
		TimesheetEditor.childObjectDeleteButtonHandler();
		TimesheetEditor.calculateDurationEvent();

		TimesheetEditor.renderTotalsSection();
		TimesheetEditor.setBillableRateFromWorkspace();
		TimesheetEditor.refreshTotals();

		/* Init sorting. */
		TimesheetEditor.sortingSetup();

		/* Init messages subclass. */
		TimesheetEditor.messages.init();

		EditorBase.editClickEvent();

		jQuery( document ).on( 'click', '#sacom-editor-overlay-close, #sacom-button-return button', function() {

			EditorBase.clearUx();
			EditorBase.renderPageHeader();
			EditorBase.renderListFilters();
			TimesheetEditor.renderObjectListContainer();
			TimesheetEditor.loadList();

		});

		/* Init context menu events. */
		EditorBase.initContextMenu();

		/* Time entry AM/PM events */
		TimesheetEditor.timeEntryClickEvent();

		/* Generate invoice button handler. */
		TimesheetEditor.generateInvoiceEvent();

	},

	childObjectStartEdit: function( childObjectId ) {

		TimesheetEditor.childObjectFormShow();

		let currentParentObject = EditorBase.getCurrentParentObjectModel();

		jQuery.each( currentParentObject.entries, function( index, childModel ) {

			if( childModel.timesheetEntryId === childObjectId ) {
				EditorBase.data.currentObjects.child.model = childModel;
			}

		});

		let childModel = EditorBase.data.currentObjects.child.model;

		TimesheetEditor.entryFormInit( childModel );

	},

	getPageTitleUppercase: function() {

		return "TIMESHEETS";

	},

	sortAsc: function( a, b ) {

		return a.timesheetId < b.timesheetId ? -1 : 1;

	},

	sortDesc: function( a, b ) {

		return a.timesheetId > b.timesheetId ? -1 : 1;

	},

	loadList: function() {

		EditorBase.request.loadList();

		jQuery( document ).off( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted' );
		jQuery( document ).on( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted', function() {

			var html = '';

			jQuery.each( EditorBase.data.objectList, function( index, item ) {

				html += '<div class="timesheet-item" data-id="' + item.timesheetId + '">';

				/* Id. */
				html += '<div class="timesheet-item-id">';
				html += '<h5>Timesheet ID ';
				html += item.timesheetId;
				html += '</h5>';
				html += '</div>';


				/* Title. */
				html += '<div class="timesheet-item-title">';
				html += '<h2>';

				if( item.label ) {
					html += item.label;
				} else {
					html += 'No Label Set';
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
				html += '<div class="timesheet-item-dates">';
				html += '<h3>';
				html += dayStart.format( 'MMMM D' ) + ' to ' + dayEnd.format( 'MMMM D' );
				html += '</h3>';
				html += '</div>';

				/* card footer */
				html += '<div class="sacom-card-footer">';
				html += '<h4>$' + item.totals.billable + '</h4>';
				html += '<h4>' + item.totals.hours + ' Hours</h4>';
				html += '</div>';

				html += '</div>';

			});

			html += '</div>';

			jQuery( '#sacom-object-list' ).html( html )

			// Edit button click.
			jQuery('.timesheet-item').on('click', function() {

				let objectId = jQuery( this ).attr( 'data-id' );
				TimesheetEditor.modeSwitchEdit( objectId );

			});

			// Create new button click.
			jQuery('#sacom-button-create').on('click', function() {

				TimesheetEditor.modeSwitchEdit( 0 );

			});

		});

	},

	modeSwitchEdit: function( objectId ) {

		EditorBase.clearUx();
		EditorBase.renderPageHeader();
		EditorBase.renderEditorGrid();
		TimesheetEditor.renderOverlayCloseButton();
		TimesheetEditor.renderEditForm();
		TimesheetEditor.childObjectListRender();

		// Dynamic selector loading.
		TimesheetEditor.accountOptionLoader();
		TimesheetEditor.workspaceOptionLoader();
		TimesheetEditor.workspaceAccountChangeClear();

		TimesheetEditor.childObjectDeleteConfirmationDialog();

		if( objectId ) {

			var timesheet = EditorBase.getLoadedObjectModel( objectId );
			EditorBase.setCurrentParentObjectModel( timesheet );
			TimesheetEditor.initEditMode();

		} else {

			TimesheetEditor.initCreateMode();

		}

		// Add save handler after UX rendered because it contains change events that may fire when setting up fields.
		TimesheetEditor.timesheetSaveHandler();

		// Show the generate invoice button.
		TimesheetEditor.showGenerateInvoiceButton();

	},

	/* CurrentEntry Subclass */
	CurrentEntry: {

		rowElement: false

	},

	renderTotalsSection: function() {

		/* Append totals section. */
		var totals = '<div id="timesheet-totals">';
		totals += '$0.00';
		totals += '</div>';
		jQuery( '#timesheet-editor-column-right' ).append( totals );


	},

	getEntryStartTimeDateFieldHtml: function() {

		h = '';
		h += '<div class="datepicker-wrap">';
		h += '<div class="datepicker-prepend start-date-prepend">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-alt" class="svg-inline--fa fa-calendar-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path></svg>';
		h += '</div>';
		h += '<input id="field-time-start-date" name="field-time-start-date" class="datepicker" />';
		h += '</div>';
		return h;

	},

	getEndDateFieldHtml: function() {

		h = '';
		h += '<div class="datepicker-wrap">';
		h += '<div class="datepicker-prepend end-date-prepend">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-check" class="svg-inline--fa fa-calendar-check fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M436 160H12c-6.627 0-12-5.373-12-12v-36c0-26.51 21.49-48 48-48h48V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h128V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h48c26.51 0 48 21.49 48 48v36c0 6.627-5.373 12-12 12zM12 192h424c6.627 0 12 5.373 12 12v260c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V204c0-6.627 5.373-12 12-12zm333.296 95.947l-28.169-28.398c-4.667-4.705-12.265-4.736-16.97-.068L194.12 364.665l-45.98-46.352c-4.667-4.705-12.266-4.736-16.971-.068l-28.397 28.17c-4.705 4.667-4.736 12.265-.068 16.97l82.601 83.269c4.667 4.705 12.265 4.736 16.97.068l142.953-141.805c4.705-4.667 4.736-12.265.068-16.97z"></path></svg>';
		h += '</div>';
		h += '<input id="field-time-end-date" name="field-time-end-date" class="datepicker" />';
		h += '</div>';
		return h;

	},

	getStartTimeFieldHtml: function() {

		h = '';
		h += '<div class="sacom-time-entry">';
		h += '<label>';
		h += 'Start Time';
		h += '</label>';
		h += '<div class="sacom-time-entry-input-wrapper">';
		h += '<input id="field-time-start-time" />';
		h += '<div class="sacom-time-entry-ampm">';
		h += '<span data-value="am" class="selected">AM</span>';
		h += '<span data-value="pm">PM</span>';
		h += '</div>';
		h += '</div>';
		h += '</div>';
		return h;

	},


	getEndTimeFieldHtml: function() {

		h = '';
		h += '<div class="sacom-time-entry">';
		h += '<label>';
		h += 'End Time';
		h += '</label>';
		h += '<div class="sacom-time-entry-input-wrapper">';
		h += '<input id="field-time-end-time" />';
		h += '<div class="sacom-time-entry-ampm">';
		h += '<span data-value="am" class="selected">AM</span>';
		h += '<span data-value="pm">PM</span>';
		h += '</div>';
		h += '</div>';
		h += '</div>';
		return h;

	},

	childObjectListRender: function() {

		var h = '';

		h += '<button id="time-entry-add-button" class="sacom-add-child-object-button">';
		h += '<span>+ Add Time Entry</span>';
		h += '<span>'
		h += '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="clock" class="svg-inline--fa fa-clock fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path></svg>';
		h += '</span>';
		h += '</button>';

		h += '<div class="sacom-editor-child-object-form">';

		h += '<div class="sacom-form-row-block">';
		h += TimesheetEditor.getEntryStartTimeDateFieldHtml();
		// h += TimesheetEditor.getEndDateFieldHtml();
		h += '</div>';

		h += '<div class="sacom-form-row-block">';
		h += '<input id="field-memo" placeholder="Enter a memo..." />';
		h += '</div>';

		h += '<div class="sacom-form-row sacom-mb-3">';
		h += TimesheetEditor.getStartTimeFieldHtml();
		h += TimesheetEditor.getEndTimeFieldHtml();
		h += '</div>';

		// Duration notice.
		h += '<div id="duration">';
		h += '<input type="hidden" id="field-duration" />';
		h += '<h3>';
		h += '</h3>';
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


		h += '<div id="timesheet-entry-grid" class="sacom-editor-child-object-list">';
		h += '<ul>';
		h += '</ul>';
		h += '</div>';

		jQuery( '.sacom-editor-column-right' ).append( h );

		TimesheetEditor.formScriptReinit();

		EditorBase.childEditCancelEvent();

		var cleave = new Cleave( '#field-time-start-time', {
			time: true,
			timePattern: ['h', 'm'],
			timeFormat: 12
		});

		var cleave = new Cleave( '#field-time-end-time', {
			time: true,
			timePattern: ['h', 'm'],
			timeFormat: 12
		});

		// Testing out how to read the values and potentially enforce decimals.
		jQuery( '#field-billable-rate' ).on( 'keyup', function() {

			var el = jQuery( this );
			var value = el.val();

			console.log( value );

		});

		new Cleave( '#field-billable-rate', {

			numeral: true

		});

		/* Entry save button click. */
		jQuery( '.sacom-editor-child-object-save-button' ).on( 'click', function() {

			TimesheetEditor.childObjectFormHide();
			TimesheetEditor.childObjectFormParseValues();
			TimesheetEditor.entrySaveRequest();

		});

	},

	/***
	 **
	 ** Messages Subclass
	 **
	 **/
	messages: {

		init: function() {

		},

		clearMessages: function() {

			var container = jQuery( '#editor-message-container' );
			container.html('');

		},

		showMessage: function( message ) {

			TimesheetEditor.messages.clearMessages();
			var container = jQuery( '#editor-message-container' );
			container.append( message );

			setTimeout( function() {

				jQuery( '#editor-message-container' ).html('');

			}, 2000);

		}

	},
	/* End functions for messages subclass. */

	entryEditButtonHandler: function() {

		jQuery( document ).on( 'click', '.entry-row-edit-button', function() {

			let entryId = jQuery( this ).parents( 'tr' ).attr( 'data-entry-id' );

			// TimesheetEditor.entryFormRender();

		});

	},

	entryFormInit: function( entry ) {

		jQuery( '#field-memo' ).val( entry.memo );

		// Show duration.
		jQuery( '#duration span' ).html( entry.duration );

		let start = dayjs( entry.timeStart );
		jQuery( '#field-time-start-date' ).val( start.format('YYYY-MM-DD') );
		jQuery( '#field-time-start-time' ).val( start.format('hh:mm') );
		let end = dayjs( entry.timeEnd );

		jQuery( '#field-time-end-date' ).val( end.format('YYYY-MM-DD') );
		jQuery( '#field-time-end-time' ).val( end.format('hh:mm') );

	},

	entryFormInitDefaults: function() {

		/*
		 * Set form field defaults.
		 */
		TimesheetEditor.durationDisplay( 15 );
		jQuery( '#field-duration' ).val( '15' );
		jQuery( '#field-time-start-date' ).val( '2021-04-15' );
		jQuery( '#field-time-start-time' ).val( '12:00' );
		jQuery( '#field-time-end-date' ).val( '2021-04-15' );
		jQuery( '#field-time-end-time' ).val( '12:15' );

	},

	childObjectDeleteButtonHandler: function() {

		jQuery( document ).on( 'click', '.child-object-delete-button', function() {

			// Set the current entry ID.
			EditorBase.data.currentObjects.child.rowElement = jQuery( this ).parents( 'li' );

			var objectId = jQuery( this ).parents( 'li' ).attr( 'data-id' );

			EditorBase.data.currentObjects.child.model = {
				timesheetEntryId: objectId
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

		EditorBase.data.rootElement.append( '<div class="sacom-dialog">Are you sure you want to delete this timesheet entry?</div>' );

		jQuery( '.sacom-dialog' ).dialog({
      resizable: false,
			autoOpen: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Delete Timesheet Entry": function() {
					TimesheetEditor.childObjectDeleteProcess();
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
			entryId: EditorBase.data.currentObjects.child.model.timesheetEntryId
		};

		wp.ajax.post( 'sacom_timesheet_entry_delete', data ).done( function( response ) {

			// Update data store.
			EditorBase.data.currentObjects.parent.model = response.timesheet;

			// Show message to user.
			TimesheetEditor.messages.showMessage('Entry ID ' + response.entryId  + ' was successfully deleted.')

			// Remove entry from table.
			EditorBase.data.currentObjects.child.rowElement.remove();

			// Update stats shown.
			let timesheet = EditorBase.data.currentObjects.parent.model;
			jQuery( '.stat-billable-hours h2' ).html( timesheet.totals.hours );
			jQuery( '.stat-billable-amount h2' ).html( '$' + timesheet.totals.billable );

		});

	},

	renderOverlayCloseButton: function() {

		var h = '';

		h += '<div id="sacom-editor-overlay-close">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="window-close" class="svg-inline--fa fa-window-close fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v340zM356.5 194.6L295.1 256l61.4 61.4c4.6 4.6 4.6 12.1 0 16.8l-22.3 22.3c-4.6 4.6-12.1 4.6-16.8 0L256 295.1l-61.4 61.4c-4.6 4.6-12.1 4.6-16.8 0l-22.3-22.3c-4.6-4.6-4.6-12.1 0-16.8l61.4-61.4-61.4-61.4c-4.6-4.6-4.6-12.1 0-16.8l22.3-22.3c4.6-4.6 12.1-4.6 16.8 0l61.4 61.4 61.4-61.4c4.6-4.6 12.1-4.6 16.8 0l22.3 22.3c4.7 4.6 4.7 12.1 0 16.8z"></path></svg>';
		h += '</div>';

		EditorBase.data.rootElement.find( '#sacom-editor-grid' ).append( h );

	},

	getAccountFieldHtml: function() {

		var h = '';
		h += '<div id="field-account" class="sacom-editor-big-selector sacom-cursor-pointer">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-shield" class="svg-inline--fa fa-user-shield fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M622.3 271.1l-115.2-45c-4.1-1.6-12.6-3.7-22.2 0l-115.2 45c-10.7 4.2-17.7 14-17.7 24.9 0 111.6 68.7 188.8 132.9 213.9 9.6 3.7 18 1.6 22.2 0C558.4 489.9 640 420.5 640 296c0-10.9-7-20.7-17.7-24.9zM496 462.4V273.3l95.5 37.3c-5.6 87.1-60.9 135.4-95.5 151.8zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm96 40c0-2.5.8-4.8 1.1-7.2-2.5-.1-4.9-.8-7.5-.8h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c6.8 0 13.3-1.5 19.2-4-54-42.9-99.2-116.7-99.2-212z"></path></svg>';
		h += '<h2></h2>';
		h += '<select id="account" name="account"></select>';
		h += '<h3>ACCOUNT</h3>';
		h += '</div>';
		return h;

	},

	getWorkspaceFieldHtml: function() {

		var h = '';
		h += '<div id="field-workspace" class="sacom-editor-big-selector sacom-cursor-pointer">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="project-diagram" class="svg-inline--fa fa-project-diagram fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M384 320H256c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h128c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32zM192 32c0-17.67-14.33-32-32-32H32C14.33 0 0 14.33 0 32v128c0 17.67 14.33 32 32 32h95.72l73.16 128.04C211.98 300.98 232.4 288 256 288h.28L192 175.51V128h224V64H192V32zM608 0H480c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h128c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32z"></path></svg>';
		h += '<h2></h2>';
		h += '<select id="workspace" name="workspace" disabled></select>';
		h += '<h3>WORKSPACE</h3>';
		h += '</div>';
		return h;

	},

	getEntryStartTimeDateFieldHtml: function() {

		h = '';
		h += '<div class="datepicker-wrap">';
		h += '<div class="datepicker-prepend start-date-prepend">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-alt" class="svg-inline--fa fa-calendar-alt fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path></svg>';
		h += '</div>';
		h += '<input id="field-time-start-date" class="datepicker" />';
		h += '</div>';
		return h;

	},

	getBillableRateFieldHtml: function() {

		var h = '';
		h += '<div class="sacom-edit-row billable-rates">';
		h += '<div class="field-prepend">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-invoice-dollar" class="svg-inline--fa fa-file-invoice-dollar fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-153 31V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8V72zm0 80v-16c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8zm144 263.88V440c0 4.42-3.58 8-8 8h-16c-4.42 0-8-3.58-8-8v-24.29c-11.29-.58-22.27-4.52-31.37-11.35-3.9-2.93-4.1-8.77-.57-12.14l11.75-11.21c2.77-2.64 6.89-2.76 10.13-.73 3.87 2.42 8.26 3.72 12.82 3.72h28.11c6.5 0 11.8-5.92 11.8-13.19 0-5.95-3.61-11.19-8.77-12.73l-45-13.5c-18.59-5.58-31.58-23.42-31.58-43.39 0-24.52 19.05-44.44 42.67-45.07V232c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v24.29c11.29.58 22.27 4.51 31.37 11.35 3.9 2.93 4.1 8.77.57 12.14l-11.75 11.21c-2.77 2.64-6.89 2.76-10.13.73-3.87-2.43-8.26-3.72-12.82-3.72h-28.11c-6.5 0-11.8 5.92-11.8 13.19 0 5.95 3.61 11.19 8.77 12.73l45 13.5c18.59 5.58 31.58 23.42 31.58 43.39 0 24.53-19.05 44.44-42.67 45.07z"></path></svg>';
		h += '</div>';
		h += '<input id="field-billable-rate" type="text" />';
		h += '</div>';

		return h;

	},

	getStartDateFieldHtml: function() {

		var h = '';
		h += '<div class="datepicker-wrap">';
		h += '<div class="datepicker-prepend end-date-prepend">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-check" class="svg-inline--fa fa-calendar-check fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M436 160H12c-6.627 0-12-5.373-12-12v-36c0-26.51 21.49-48 48-48h48V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h128V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h48c26.51 0 48 21.49 48 48v36c0 6.627-5.373 12-12 12zM12 192h424c6.627 0 12 5.373 12 12v260c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V204c0-6.627 5.373-12 12-12zm333.296 95.947l-28.169-28.398c-4.667-4.705-12.265-4.736-16.97-.068L194.12 364.665l-45.98-46.352c-4.667-4.705-12.266-4.736-16.971-.068l-28.397 28.17c-4.705 4.667-4.736 12.265-.068 16.97l82.601 83.269c4.667 4.705 12.265 4.736 16.97.068l142.953-141.805c4.705-4.667 4.736-12.265.068-16.97z"></path></svg>';
		h += '</div>';
		h += '<input id="field-date-start" class="datepicker" />';
		h += '</div>';
		return h;

	},

	getEndDateFieldHtml: function() {

		var h = '';
		h += '<div class="datepicker-wrap">';
		h += '<div class="datepicker-prepend end-date-prepend">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-check" class="svg-inline--fa fa-calendar-check fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M436 160H12c-6.627 0-12-5.373-12-12v-36c0-26.51 21.49-48 48-48h48V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h128V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h48c26.51 0 48 21.49 48 48v36c0 6.627-5.373 12-12 12zM12 192h424c6.627 0 12 5.373 12 12v260c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V204c0-6.627 5.373-12 12-12zm333.296 95.947l-28.169-28.398c-4.667-4.705-12.265-4.736-16.97-.068L194.12 364.665l-45.98-46.352c-4.667-4.705-12.266-4.736-16.971-.068l-28.397 28.17c-4.705 4.667-4.736 12.265-.068 16.97l82.601 83.269c4.667 4.705 12.265 4.736 16.97.068l142.953-141.805c4.705-4.667 4.736-12.265.068-16.97z"></path></svg>';
		h += '</div>';
		h += '<input id="field-date-end" class="datepicker" />';
		h += '</div>';
		return h;

	},

	renderEditForm: function() {

		var h = '';
		h += '<div id="timesheet-editor-form" class="sacom-editor-form-primary">';
		h += '<input id="field-label" name="field-label" placeholder="Enter a label for your timesheet." />';

		h += '<div class="sacom-form-row account-workspace-row">';
		h += TimesheetEditor.getAccountFieldHtml();
		h += TimesheetEditor.getWorkspaceFieldHtml();
		h += '</div>';


		h += '<div class="sacom-form-row">';
		h += TimesheetEditor.getStartDateFieldHtml();
		h += TimesheetEditor.getEndDateFieldHtml();
		h += '</div>';

		h += '</div>';
		h += '</div>';

		h += TimesheetEditor.getBillableRateFieldHtml();

		h += '<div class="sacom-stat stat-billable-hours">';
		h += '<h2>0.00</h2>';
		h += '<h4>BILLABLE HOURS</h4>';
		h += '</div>';

		h += '<div class="sacom-stat stat-billable-amount">';
		h += '<h2>$0.00</h2>';
		h += '<h4>BILLABLE AMOUNT</h4>';
		h += '</div>';

		// Add to DOM.
		var container = jQuery( '.sacom-editor-column-main' );
		container.html( h );

		TimesheetEditor.formScriptReinit();

	},

	accountOptionLoader: function() {

		let selectEl = jQuery( '#account' );
		selectEl.children().remove();

		jQuery.each( editorData.accounts, function( index, item ) {

			selectEl.append( new Option( item.title, item.accountId ) );

		});

		/* Fire event "account_field_populated" */
		jQuery( '#account' ).trigger({
			type: 'account_field_populated'
		});

	},

	workspaceOptionLoader: function() {

		jQuery( document ).on( 'change', '#account', function() {

			let accountId = jQuery( this ).val();
			if( accountId == 0 ) {
				return;
			}

			TimesheetEditor.requestWorkspaceOptions( accountId );

		});

	},

	workspaceAccountChangeClear() {

		jQuery( document ).on( 'change', '#account', function() {

			TimesheetEditor.workspaceValueDisplayClear();

		});

	},

	setBillableRateFromWorkspace: function() {

		jQuery( '#workspace' ).on( 'change', function() {

			// Fetch workspace model.
			let billableRate = 58.49;

			// Update billable rate field if rate available.
			jQuery( '#field-billable-rate' ).val( billableRate );


		});

	},

	requestWorkspaceOptions: function( accountId ) {

		let data = {
			accountId: accountId
		}
		wp.ajax.post( 'sacom_timesheet_account_workspace_option_loader', data ).done( function( response ) {

			let objects = response.workspaces;
			let selectEl = jQuery( '#workspace' );
			selectEl.children().remove();

			jQuery.each( objects, function( index, item ) {

				selectEl.append( new Option( item.title, item.workspaceId ) );

			});

			// Enable workspace selector.
			selectEl.attr( 'disabled', false );

			/* Fire event "workspace_field_populated" */
			jQuery( '#workspace' ).trigger({
				type: 'workspace_field_populated'
			});

		});

	},

	entrySaveRequest: function() {

		/* do ajax request to save entry */
		let data = {
			entry: EditorBase.data.currentObjects.child.model
		}

		wp.ajax.post( 'sacom_timesheet_entry_save', data ).done( function( response ) {

			TimesheetEditor.entryAfterSave( response );

		});

	},

	entryAfterSave: function( r ) {

		/* Render existing timesheet entries. */
		var childObjectItemHtml = '';
		jQuery.each( r.timesheet.entries, function( index, entry ) {

			childObjectItemHtml += TimesheetEditor.childObjectItemHtml( entry );

		});

		var container = jQuery( '.sacom-editor-child-object-list ul' );
		jQuery( container ).html( childObjectItemHtml );

		// Do cleanup (unloading) of stashed data for current entry.

		console.log( r.timesheet )

		EditorBase.data.currentObjects.parent.model = r.timesheet;
		EditorBase.data.currentObjects.child.model = r.timesheetEntry;

		TimesheetEditor.messages.showMessage( 'Entry saved successfully.' );

		jQuery( '.stat-billable-hours h2' ).html( r.timesheet.totals.hours );
		jQuery( '.stat-billable-amount h2' ).html( '$' + r.timesheet.totals.billable );

		jQuery( document ).trigger({

			type: 'sacom_timesheet_saved',
			response: r

		});

	},

	childObjectFormParseValues: function() {

		console.log( EditorBase.data.currentObjects.child.model );

		if( !EditorBase.data.currentObjects.child.model.timesheetEntryId ) {

			EditorBase.data.currentObjects.child.model = {};

		} else {

			EditorBase.data.currentObjects.child.model = {
				timesheetEntryId: EditorBase.data.currentObjects.child.model.timesheetEntryId
			};

		}

		EditorBase.data.currentObjects.child.model.timesheetId = EditorBase.data.currentObjects.parent.model.timesheetId;
		EditorBase.data.currentObjects.child.model.memo        = jQuery( '#field-memo' ).val();
		EditorBase.data.currentObjects.child.model.timeStart   = jQuery( '#field-time-start-date' ).val() + ' ' + jQuery( '#field-time-start-time' ).val();
		EditorBase.data.currentObjects.child.model.timeEnd     = jQuery( '#field-time-start-date' ).val() + ' ' + jQuery( '#field-time-end-time' ).val();
		EditorBase.data.currentObjects.child.model.duration    = jQuery( '#field-duration' ).val();

	},

	calculateDurationEvent: function() {

		jQuery( document ).on( 'sacom_time_selector_ampm_changed', function() {

			TimesheetEditor.durationCalculatePrepare();

		});

		jQuery( document ).on( 'change', '#field-time-start-date, #field-time-start-time, #field-time-end-date, #field-time-end-time', function() {

			TimesheetEditor.durationCalculatePrepare();

		});

	},

	durationCalculatePrepare: function() {

		TimesheetEditor.calculateDuration();

	},

	calculateDurationParseAmPm: function( selector ) {

		let ampmEl = jQuery( selector ).siblings('.sacom-time-entry-ampm');
		let value = ampmEl.find('span.selected').attr('data-value');

		return value;

	},

	calculateDuration: function() {

		/*
		 * Parse date and time in ISO 8601 format.
		 * Format: 2018-04-04T16:00:00.000Z
		 * https://day.js.org/docs/en/parse/string.
		 */
		let startDate  = jQuery( '#field-time-start-date' ).val();
		var startTime  = jQuery( '#field-time-start-time' ).val();
		var amPmVal = TimesheetEditor.calculateDurationParseAmPm( '#field-time-start-time' );
		startTime = startTime + amPmVal;
		startTime = TimesheetEditor.convertTimeTo24Hour( startTime );

		// End date is same as start date unless we add an optional different end date field.
		let endDate    = jQuery( '#field-time-start-date' ).val();
		var endTime    = jQuery( '#field-time-end-time' ).val();
		var amPmVal = TimesheetEditor.calculateDurationParseAmPm( '#field-time-end-time' );
		endTime = endTime + amPmVal;
		endTime = TimesheetEditor.convertTimeTo24Hour( endTime );

		let start      = startDate + 'T' + startTime + ':00.000Z';
		let startDay   = dayjs( start );

		let end        = endDate + 'T' + endTime + ':00.000Z';
		let endDay     = dayjs( end );

		/* Test if dates are valid. */
		if( startDay.isValid() === false || endDay.isValid() === false ) {

			return false;

		}

		let durationMs = endDay.diff( startDay );
		let duration   = durationMs / ( 1000 * 60 );

		// Update duration value shown
		if( isNaN( duration ) === false ) {

			if( duration < 0 ) {

				jQuery( '#field-duration' ).val( '0' );
				TimesheetEditor.durationOverwriteMessage( "End time is before start time, please update." );

			} else {

				TimesheetEditor.durationOverwriteMessage( 'Tracking a total of <span></span> minutes.' );
				TimesheetEditor.durationDisplay( duration );
				jQuery( '#field-duration' ).val( duration );

			}

		} else {

			jQuery( '#field-duration' ).val( '0' );
			TimesheetEditor.durationOverwriteMessage( "Invalid time calculation, please update." );

		}

		jQuery( document ).trigger({
			type: 'entry_duration_updated'
		});

	},

	durationDisplay( durationInMinutes ) {

		jQuery( '#duration > h3 > span' ).html( durationInMinutes );

	},

	durationOverwriteMessage( message ) {

		jQuery( '#duration h3' ).html( message );

	},

	convertTimeTo24Hour: function( time ) {

		if( time.includes('pm') ) {
			var first2 = time.substring(0,2)
			if( first2 != '12' ) {

				var mt = parseInt("12") + parseInt( first2 )
				time = time.replace( first2, mt );

			}
		}

		if( time.includes('am') ) {
			var first2 = time.substring(0,2)
			if( first2 == '12' ) {
				time = time.replace( first2, '00' );
			}
		}

		time = time.replace( 'am', '' );
		time = time.replace( 'pm', '' );
		time = time.replace( ' ', '' );

		return time;

	},

	refreshTotals: function() {

		jQuery( document ).on( 'sacom_timesheet_saved', function( e ) {

			let totals = e.response.timesheet.totals;

			jQuery( '.stat-billable-hours h2' ).html( totals.hours );
			jQuery( '.stat-billable-amount h2' ).html( '$' + totals.billable );

		});

	},

	entryAddButtonHandler: function() {

		jQuery( document ).on( 'click', '#time-entry-add-button', function() {

			TimesheetEditor.childObjectFormShow();
			TimesheetEditor.entryFormInitDefaults();

			// Reset editor data stored current entry
			EditorBase.data.currentObjects.child = {
				model: {},
				element: false
			};

		});

	},

	childObjectFormShow: function() {

		jQuery( '.sacom-editor-child-object-form' ).show();
		jQuery( '#time-entry-add-button' ).hide();

	},

	childObjectFormHide: function() {

		jQuery('.sacom-editor-child-object-form').hide();
		jQuery( '#time-entry-add-button' ).show();

	},

	childObjectItemHtml: function( childObject ) {

		var h = '';
		h += '<li data-id="' + childObject.timesheetEntryId + '">';

		// Context menu.
		h += '<div class="child-object-context-menu">'
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" class="svg-inline--fa fa-ellipsis-h fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path></svg>';
		h += '<ul>';
		h += '<li class="child-object-delete-button">';
		h += 'Remove this timesheet entry';
		h += '</li>';
		h += '</ul>';
		h += '</div>';

		// Item body.
		h += '<div class="child-object-list-item-body">';
		h += '<h3>';
		h += childObject.memo;
		h += '</h3>';
		h += '<h4>';
		h += childObject.duration;
		h += '</h4>';
		h += '</li>';
		h += '</div>';

		return h;

	},

	formScriptReinit: function() {

		TimesheetEditor.initDatepicker();
		EditorBase.initBigSelectors();



	},

	initDatepicker: function() {

		jQuery('.datepicker').datepicker();

	},

	initEditMode: function() {

		let timesheet = EditorBase.getCurrentParentObjectModel();

		/* Show already selected values for account and workspace. */
		TimesheetEditor.accountValueDisplay();
		TimesheetEditor.workspaceValueDisplay();

		TimesheetEditor.workspaceListInit();

		// Set start date.
		if( timesheet.dateStart === '0000-00-00 00:00:00' ) {

			jQuery( '#field-date-start' ).val( '' );

		} else {

			var day = dayjs( timesheet.dateStart );
			let dateStart = day.format( 'YYYY-MM-DD' );
			jQuery( '#field-date-start' ).val( dateStart );

		}

		// Set end date.
		if( timesheet.dateEnd === '0000-00-00 00:00:00' ) {

			jQuery( '#field-date-end' ).val( '' );

		} else {

			var day = dayjs( timesheet.dateEnd );
			let dateEnd = day.format( 'YYYY-MM-DD' );
			jQuery( '#field-date-end' ).val( dateEnd );

		}

		if( timesheet.label ) {
			jQuery( '#field-label' ).val( timesheet.label );
		} else {
			jQuery( '#field-label' ).attr( 'placeholder', 'Enter a label for your timesheet.' );
		}

		// Show link to generated invoice if available.
		if( timesheet.invoice ) {

			TimesheetEditor.showInvoiceLinkButton();

			// Update generate title.
			jQuery( '#invoice-generate-button span' ).html( 'Regenerate Invoice' );

		}

		jQuery( '#field-billable-rate' ).val( timesheet.billableRate );

		// Setup the account field.
		jQuery( '#account' ).on( 'account_field_populated', function() {

			// Update value with selected.
			jQuery( '#account' ).val( timesheet.accountId );

		});

		// Enable the workspace selector.
		jQuery( '#workspace' ).on( 'workspace_field_populated', function() {

			jQuery( this ).val( timesheet.workspaceId );

		});

		/* Render existing timesheet entries. */
		var childObjectItemHtml = '';
		jQuery.each( timesheet.entries, function( index, entry ) {

			childObjectItemHtml += TimesheetEditor.childObjectItemHtml( entry );

		});

		var container = jQuery( '.sacom-editor-child-object-list ul' );
		jQuery( childObjectItemHtml ).appendTo( container );


		/* Display billable hours. */

		jQuery( '.stat-billable-hours h2' ).html( timesheet.totals.hours );
		jQuery( '.stat-billable-amount h2' ).html( '$' + timesheet.totals.billable );

	},

	accountValueDisplay() {

		let timesheet = EditorBase.getCurrentParentObjectModel();

		var display = '';

		if( timesheet.accountId > 0 ) {

			display = timesheet.account.title;

		} else {

			display = "No account selected.";

		}

		// Show account selected in big selector.
		jQuery( '#field-account h2' ).html( display );

	},

	workspaceValueDisplay() {

		let timesheet = EditorBase.getCurrentParentObjectModel();

		var display = '';

		if( timesheet.workspaceId > 0 ) {

			display = timesheet.workspace.title;

		} else {

			display = "No workspace selected.";

		}

		// Show value selected in big selector.
		jQuery( '#field-workspace h2' ).html( display );

	},

	workspaceValueDisplayClear() {

		jQuery( '#field-workspace h2' ).html( "No workspace selected." );

	},

	workspaceListInit() {

		let timesheet = EditorBase.getCurrentParentObjectModel();
		let accountId = timesheet.accountId;

		if( accountId > 0 ) {

			TimesheetEditor.requestWorkspaceOptions( accountId );

		}

	},

	initCreateMode: function() {

		EditorBase.data.currentObjects.parent = {
			model: false
		}

	},

	timesheetSaveHandler: function() {

		jQuery( document ).off( 'change.save', '#field-label, #account, #workspace, #field-date-start, #field-date-end, #field-billable-rate' );

		jQuery( document ).on( 'change.save', '#field-label, #account, #workspace, #field-date-start, #field-date-end, #field-billable-rate', function( e ) {

			e.preventDefault();

			TimesheetEditor.parseTimesheetForm();
			TimesheetEditor.timesheetSaveRequest();

		});

	},

	timesheetSaveRequest: function() {

		let data = {
			timesheet: EditorBase.data.currentObjects.parent.model
		}
		wp.ajax.post( 'sacom_timesheet_save', data ).done( function( response ) {


			jQuery( document ).trigger({

				type: 'sacom_timesheet_saved',
				response: response

			});

			/* Show response message. */
			if( response.code === 200 ) {

				if( EditorBase.data.mode === 'create' ) {

					EditorBase.data.mode = 'edit';
					TimesheetEditor.messages.showMessage( 'Timesheet created. Your timesheet was created successfully with ID ' + response.timesheet.timesheetId + '.' );

				} else {

					TimesheetEditor.messages.showMessage( 'Timesheet saved. Your timesheet was updated successfully.' );

				}

			} else {

				// Show error message (not saved)
				TimesheetEditor.messages.showMessage( 'Timesheet could not be saved.' );

			}

			/* Update timesheet editor data. */
			EditorBase.data.currentObjects.parent.model = response.timesheet;

		});

	},

	parseTimesheetForm: function() {

		if( EditorBase.data.currentObjects.parent.model === false ) {
			EditorBase.data.currentObjects.parent.model = {}
		}

		EditorBase.data.currentObjects.parent.model.accountId    = jQuery( '#account' ).val();
		EditorBase.data.currentObjects.parent.model.workspaceId  = jQuery( '#workspace' ).val();
		EditorBase.data.currentObjects.parent.model.label        = jQuery( '#field-label' ).val();
		EditorBase.data.currentObjects.parent.model.dateStart    = jQuery( '#field-date-start' ).val();
		EditorBase.data.currentObjects.parent.model.dateEnd      = jQuery( '#field-date-end' ).val();
		EditorBase.data.currentObjects.parent.model.billableRate = jQuery( '#field-billable-rate' ).val();

	},

	renderObjectListContainer: function() {

		let html = SacomRender.getObjectListHtml();
		jQuery( html ).appendTo( EditorBase.data.rootElement );

	},

	/* Sorting Functions */

	sortingSetup: function() {

		jQuery( document ).on( 'click', '#sort-asc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( TimesheetEditor.sortAsc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Most Recent' );

		});

		jQuery( document ).on( 'click', '#sort-desc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( TimesheetEditor.sortDesc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Oldest Timesheets' );

		});

	},

	sortAsc: function( a, b ) {

		return a.timesheetId > b.timesheetId ? -1 : 1;

	},

	sortDesc: function( a, b ) {

		return a.timesheetId < b.timesheetId ? -1 : 1;

	},

	timeEntryClickEvent: function() {

		jQuery( document ).on( 'click', '.sacom-time-entry-ampm span', function() {

			let parentEl = jQuery( this ).parents( '.sacom-time-entry-input-wrapper' );

			parentEl.find( '.sacom-time-entry-ampm span' ).removeClass( 'selected' );
			jQuery( this ).addClass( 'selected' );

			let value = jQuery( this ).attr('data-value');

			// Fire trigger event.
			jQuery( document ).trigger({
				type: 'sacom_time_selector_ampm_changed',
				value: value,
				element: jQuery( this )
			});

		});


	},

	getSubheaderButtons: function() {

		var h = '';

		h += '<button id="invoice-link-button" class="sacom-button">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="link" class="svg-inline--fa fa-link fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path></svg>';
		h += '<span>';
		h += 'View Linked Invoice';
		h += '</span>';
		h += '</button>';

		h += '<button id="invoice-generate-button" class="sacom-button">';
		h += '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="file-alt" class="svg-inline--fa fa-file-alt fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M288 248v28c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-28c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm-12 72H108c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12v-28c0-6.6-5.4-12-12-12zm108-188.1V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48C0 21.5 21.5 0 48 0h204.1C264.8 0 277 5.1 286 14.1L369.9 98c9 8.9 14.1 21.2 14.1 33.9zm-128-80V128h76.1L256 51.9zM336 464V176H232c-13.3 0-24-10.7-24-24V48H48v416h288z"></path></svg>';
		h += '<span>';
		h += 'Generate Invoice';
		h += '</span>';
		h += '</button>';

		return h;

	},

	generateInvoiceEvent: function() {

		jQuery( document ).on( 'click', '#invoice-generate-button', function() {

			TimesheetEditor.messages.showMessage( 'Invoice generation processing...' );

			let data = {
				timesheetId: EditorBase.data.currentObjects.parent.model.timesheetId
			};

			wp.ajax.post( 'sacom_timesheet_generate_invoice', data ).done( function( response ) {

				console.log( response );

				TimesheetEditor.messages.showMessage( 'Invoice generation completed successfully.' );

				// Update parent object model.
				if( response.timesheet ) {

					EditorBase.setCurrentParentObjectModel( response.timesheet );

				}

				// Show button link to invoice.
				TimesheetEditor.showInvoiceLinkButton();

				// Update generate title.
				jQuery( '#invoice-generate-button span' ).html( 'Regenerate Invoice' );

			});

		});

	},

	showGenerateInvoiceButton: function() {

		jQuery( '#invoice-generate-button' ).css( 'display', 'flex' );

	},

	showInvoiceLinkButton: function() {

		jQuery( '#invoice-link-button' ).css( 'display', 'flex' );
		TimesheetEditor.invoiceLinkButtonClick();

	},

	invoiceLinkButtonClick: function() {

		jQuery( '#invoice-link-button' ).off( 'click' );
		jQuery( '#invoice-link-button' ).on( 'click', function() {

			var invoiceId = EditorBase.getCurrentParentObjectModel().invoice.invoiceId;
			var url = editorData.adminUrl + 'admin.php?page=sacom-invoices#/view/' + invoiceId;
			window.location = url;

		});

	}

}

TimesheetEditor.init();
