/*
 * PaymentEditor
 *
*/

var PaymentEditor = {

	init: function() {

		// Do EditorBase config.
		EditorBase.setChildClass( 'PaymentEditor' );
		EditorBase.setRootElement( 'sacom-payment-editor' );
		EditorBase.setObjectListLoaderHook( 'sacom_payment_loader' );
		EditorBase.setParentIdKey( 'paymentId' );

		// Do route parsing from location hash.
		let route = EditorBase.parseHash();

		console.log( route )

		// Do load list request.
		EditorBase.request.loadList();

		// Render page header.
		EditorBase.renderPageHeader();

		// Do routing.
		if( route.action === 'view' ) {

			jQuery( document ).on( 'sacom_editor_object_list_loaded', function() {

				PaymentEditor.modeSwitchView( route.objectId );

			});

		} else {

			// Default load list.
			EditorBase.renderListFilters();
			PaymentEditor.renderObjectListContainer();
			PaymentEditor.loadList();

		}

		/* Init sorting. */
		PaymentEditor.sortingSetup();

		/* Init return to list events. */
		PaymentEditor.returnToListEvents();

	},

	getPageTitleUppercase: function() {

		return "PAYMENTS";

	},

	childObjectViewOnly: 1,

	renderObjectListContainer: function() {

		let html = SacomRender.getObjectListHtml();
		jQuery( html ).appendTo( EditorBase.data.rootElement );

	},

	loadList: function() {

		if( EditorBase.data.objectList === undefined ) {

			jQuery( document ).off( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted' );
			jQuery( document ).on( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted', function() {

				PaymentEditor.renderList();

			});

		} else {

			PaymentEditor.renderList();

		}

	},

	renderList: function() {

		var html = '';

		jQuery.each( EditorBase.data.objectList, function( index, item ) {

			html += '<div class="sacom-card" data-id="' + item.paymentId + '">';

			/* Id. */
			html += '<div class="payment-item-id">';
			html += '<table>';
			html += '<tr>';
			html += '<td>';
			html += '<h4>Payment ID ';
			html += item.paymentId;
			html += '</h4>';

			html += '</tr>';
			html += '</table>';
			html += '</div>';

			// Amount.
			html += '<h4 class="sacom-text-large">';
			html += '$' + item.amount;
			html += '</h4>';

			/* card footer */
			var createdDate = dayjs( item.created );
			html += '<div class="sacom-card-footer">';
			html += '<h4>' + createdDate.format('YYYY-MM-DD') + '</h4>';
			html += '</div>';

			html += '</div>';

		});

		html += '</div>';

		jQuery( '#sacom-object-list' ).html( html )

		// Edit button click.
		jQuery('.sacom-card').on('click', function() {

			let objectId = jQuery( this ).attr( 'data-id' );
			PaymentEditor.modeSwitchView( objectId );

		});

		// Create new button click.
		jQuery('#sacom-button-create').on('click', function() {

			PaymentEditor.modeSwitchView( 0 );

		});

	},

	/* Sorting Functions */

	sortingSetup: function() {

		jQuery( document ).on( 'click', '#sort-asc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( PaymentEditor.sortAsc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Most Recent' );

		});

		jQuery( document ).on( 'click', '#sort-desc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( PaymentEditor.sortDesc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Oldest Payments' );

		});

	},

	sortAsc: function( a, b ) {

		return a.paymentId > b.paymentId ? -1 : 1;

	},

	sortDesc: function( a, b ) {

		return a.paymentId < b.paymentId ? -1 : 1;

	},

	modeSwitchView: function( objectId ) {

		EditorBase.clearUx();
		EditorBase.renderPageHeader();
		EditorBase.renderEditorGrid( 1 );
		EditorBase.renderOverlayCloseButton();

		var parentObject = EditorBase.getLoadedObjectModel( objectId );
		EditorBase.setCurrentParentObjectModel( parentObject );

		PaymentEditor.renderViewSingle();

	},

	renderViewSingle: function() {

		let model = EditorBase.getCurrentParentObjectModel();

		var html = '';

		html += '<div class="payment-item">';
		html += '<table class="sacom-info-table">';

		// Payment ID.
		html += '<tr>';
		html += '<td>';
		html += 'Payment ID';
		html += '</td>';
		html += '<td>';
		html += model.paymentId;
		html += '</td>';
		html += '</tr>';

		// Payment amount.
		html += '<tr>';
		html += '<td>';
		html += 'Payment Amount';
		html += '</td>';
		html += '<td>';
		html += '$' + model.amount;
		html += '</td>';
		html += '</tr>';

		// Payment amount.
		html += '<tr>';
		html += '<td>';
		html += 'Payment Memo';
		html += '</td>';
		html += '<td>';
		html += model.memo;
		html += '</td>';
		html += '</tr>';

		// Payment method.
		html += '<tr>';
		html += '<td>';
		html += 'Payment Method ID';
		html += '</td>';
		html += '<td>';
		html += model.id_payment_method;
		html += '</td>';
		html += '</tr>';

		// Payment date.
		html += '<tr>';
		html += '<td>';
		html += 'Payment Date';
		html += '</td>';
		html += '<td>';
		html += model.created;
		html += '</td>';
		html += '</tr>';

		html += '</table>';
		html += '</div>';

		// Add to DOM.
		var container = jQuery( '.sacom-editor-column-main' );
		container.html( html );

	},

	returnToListEvents: function() {

		jQuery( document ).on( 'click', '#sacom-editor-overlay-close, #sacom-button-return button', function() {

			EditorBase.clearUx();
			EditorBase.renderPageHeader();
			EditorBase.renderListFilters();
			PaymentEditor.renderObjectListContainer();
			PaymentEditor.loadList();

		});

	},

	parentSaveHandler: function() {

		jQuery( document ).off( 'change.save', '#field-title' );

		jQuery( document ).on( 'change.save', '#field-title', function() {

			PaymentEditor.parseParentForm();
			PaymentEditor.parentSaveRequest();

		});

	},

	formScriptReinit: function() {

		EditorBase.initBigSelectors();
		jQuery( '.select2' ).select2();

	},

}


PaymentEditor.init();
