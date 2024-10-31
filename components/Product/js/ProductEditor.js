class SACOM_ProductEditor {

	constructor() {

		this.frame = false;

	}

	init() {

		EditorBase.setChildClass( 'SACOM_EditorInstance' );
		EditorBase.setRootElement( 'sacom-product-editor' );
		EditorBase.setObjectListLoaderHook( 'sacom_product_loader' );
		EditorBase.setParentIdKey( 'productId' );

		EditorBase.renderPageHeader();
		EditorBase.renderListFilters();
		this.renderObjectListContainer();
		this.loadList();

		this.createNewClick();
		this.returnToListEvents();
		this.sortingSetup();
		this.loadFields();

		console.log( editorData );

		this.mediaUploadSetup();

	}

	loadFields() {

		this.fields = editorData.fields;

	}

	createNewClick() {

		jQuery( document ).on('click', '#sacom-button-create', function() {

			SACOM_EditorInstance.modeSwitchEdit( 0 );

		});

	}

	getPageTitleUppercase() {

		return "PRODUCTS";

	}

	modeSwitchEdit( objectId ) {

		EditorBase.clearUx();
		EditorBase.renderPageHeader();
		EditorBase.renderEditorGrid();
		EditorBase.renderOverlayCloseButton();
		this.renderEditForm();

		if( objectId ) {

			var product = EditorBase.getLoadedObjectModel( objectId );
			EditorBase.setCurrentParentObjectModel( product );
			this.initEditMode();

		} else {

			this.initCreateMode();

		}

		// Add save handler after UX rendered because it contains change events that may fire when setting up fields.
		this.saveHandler();

	}

	renderEditForm() {

		var h = '';
		h += '<div id="product-editor-form" class="sacom-editor-form-primary">';

		//
		this.fields.forEach( function( field, index ) {

			if( field.type === undefined ) {

				var fieldKey = 'field_' + field.id;
				h += '<div class="sacom-form-row-block">'
				h += '<label for="' + fieldKey + '">' + field.label + '</label>';
				h += '<input id="' + fieldKey + '" placeholder="' + field.placeholder + '" />';
				h += '</div>';

			} else {

				switch( field.type ) {

					case 'image':
						h += '<label for="' + fieldKey + '">' + field.label + '</label>';
						h += SACOM_EditorInstance.getImageField( field );
						break;

				}

			}

		});

		// Close form.
		h += '</div>';
		h += '</div>';

		h += '<div class="sacom-stat stat-product-id">';
		h += '<div id="stat-product-id-react"></div>';
		h += '<h4>PRODUCT ID</h4>';
		h += '</div>';

		// Add to DOM.
		var container = jQuery( '.sacom-editor-column-main' );
		container.html( h );

		SACOM_EditorInstance.formScriptReinit();

	}

	getImageField( field ) {

		const mu = new SACOM_MediaUploader();
		let markupEl = mu.markup( field.id );
		return markupEl.outerHTML;

	}

	mediaUploadSetup() {

		jQuery( document ).on( 'click', '.media_upload_field_add_button', function() {

			// If the media frame already exists, reopen it.
			if ( SACOM_EditorInstance.frame ) {

				SACOM_EditorInstance.frame.open();
				return;

			}

			// Create a new media frame
			SACOM_EditorInstance.frame = wp.media(
				{
					title: 'Select or upload a product image.',
					button: {
						text: 'Finish Selection'
					},
					multiple: false // Set to true to allow multiple files to be selected
				}
			);


			// When an image is selected in the media frame...
			SACOM_EditorInstance.frame.on( 'select', function() {

				// Get media attachment details from the frame state
				var attachment = SACOM_EditorInstance.frame.state().get('selection').first().toJSON();

				// Send the attachment URL to our custom image input field.
				jQuery( '.media_upload_field_preview_container' ).html( '<img src="' + attachment.url + '" alt="" style="max-width: 100%;" />' );

				// Send the attachment id to our hidden input
				jQuery( '.media_upload_field_input' ).val( attachment.id );

				// Fire change event.
				jQuery( '.media_upload_field_input' ).change();

				// Show remove button.
				jQuery( '.media_upload_field_remove_button' ).show();

				// Update label in the add/change button.
				jQuery( '.media_upload_field_add_button' ).html( 'Change Image' );

			});

			// Handle removal click.
			jQuery( document ).on( 'click', '.media_upload_field_remove_button', function() {

				jQuery( this ).hide();
				jQuery( '.media_upload_field_input' ).val( 0 );
				jQuery( '.media_upload_field_input' ).change();
				jQuery( '.media_upload_field_preview_container' ).html( 'No Image Selected.' );
				jQuery( '.media_upload_field_add_button' ).html( 'Add Image' );


			});

			// Finally, open the modal on click
			SACOM_EditorInstance.frame.open();

		});

	}

	formScriptReinit() {

		EditorBase.initBigSelectors();

	}

	renderObjectListContainer() {

		let html = SacomRender.getObjectListHtml();
		jQuery( html ).appendTo( EditorBase.data.rootElement );

	}

	loadList() {

		EditorBase.request.loadList();

		jQuery( document ).off( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted' );
		jQuery( document ).on( 'sacom_editor_object_list_loaded sacom_editor_object_list_sorted', function() {

			var html = '';

			jQuery.each( EditorBase.data.objectList, function( index, item ) {

				html += '<div class="sacom-card" data-id="' + item.productId + '">';

				// Card Header.
				html += '<div class="sacom-card-header">';
				html += '<h4>Product ID ';
				html += item.productId;
				html += '</h4>';
				html += '</div>';

				// Card Body.
				html += '<div class="sacom-card-body">';
				html += '<h2>';

				if( item.title ) {
					html += item.title;
				} else {
					html += 'No Title Set';
				}

				html += '</h2>';
				html += '</div>';

				/* Card footer */
				html += '<div class="sacom-card-footer">';
				html += '<h4>$' + item.price + '</h4>';
				html += '</div>';

				/* Close card. */
				html += '</div>';

			});

			html += '</div>';

			jQuery( '#sacom-object-list' ).html( html )

			// Edit button click.
			jQuery('.sacom-card').on('click', function() {

				let objectId = jQuery( this ).attr( 'data-id' );
				SACOM_EditorInstance.modeSwitchEdit( objectId );

			});

			// Create new button click.
			jQuery('#sacom-button-create').on('click', function() {

				SACOM_EditorInstance.modeSwitchEdit( 0 );

			});

		});

	}

	initEditMode() {

		let product = EditorBase.getCurrentParentObjectModel();

		if( product.title ) {
			jQuery( '#field_title' ).val( product.title );
		}

		if( product.price ) {
			jQuery( '#field_price' ).val( product.price );
		}

		if( product.sku ) {
			jQuery( '#field_sku' ).val( product.sku );
		}

		if( product.mainImage ) {

			jQuery( '.media_upload_field_preview_container' ).html( '<img src="' + product.mainImage.url + '" alt="" style="max-width: 100%;" />' );
			jQuery( '.media_upload_field_remove_button' ).show();
			jQuery( '.media_upload_field_add_button' ).html( 'Change Image' );

		}

	}

	initCreateMode() {

		EditorBase.data.currentObjects.parent = {
			model: false
		}

	}

	saveHandler() {

		jQuery( document ).off( 'change.save', '#field_title, #field_price, #field_sku, #field_main_image' );

		jQuery( document ).on( 'change.save', '#field_title, #field_price, #field_sku, #field_main_image', function( event ) {

			event.preventDefault();

			SACOM_EditorInstance.parseForm();
			SACOM_EditorInstance.saveRequest();

		});

	}

	returnToListEvents() {

		jQuery( document ).on( 'click', '#sacom-editor-overlay-close, #sacom-button-return button', function() {

			EditorBase.clearUx();
			EditorBase.renderPageHeader();
			EditorBase.renderListFilters();
			SACOM_EditorInstance.renderObjectListContainer();
			SACOM_EditorInstance.loadList();

		});

	}

	parseForm() {

		if( EditorBase.data.currentObjects.parent.model === false ) {

			EditorBase.data.currentObjects.parent.model = {}
			EditorBase.data.currentObjects.parent.model.productId = 0;

		} else {

			let productId = EditorBase.data.currentObjects.parent.model.productId;
			EditorBase.data.currentObjects.parent.model = {}
			EditorBase.data.currentObjects.parent.model.productId = productId;

		}

		EditorBase.data.currentObjects.parent.model.title     = jQuery( '#field_title' ).val();
		EditorBase.data.currentObjects.parent.model.price     = jQuery( '#field_price' ).val();
		EditorBase.data.currentObjects.parent.model.sku       = jQuery( '#field_sku' ).val();
		EditorBase.data.currentObjects.parent.model.mainImage = jQuery( '#field_main_image' ).val();

	}

	saveRequest() {

		let data = {
			product: EditorBase.data.currentObjects.parent.model
		}
		wp.ajax.post( 'sacom_product_save', data ).done( function( response ) {

			jQuery( document ).trigger({

				type: 'sacom_product_saved',
				response: response

			});

			/* Show response message. */
			if( response.code === 200 ) {

				if( EditorBase.data.mode === 'create' ) {

					EditorBase.data.mode = 'edit';
					SACOM_EditorInstance.messageShow( 'Product created. Your product was created successfully with ID ' + response.product.productId + '.' );

				} else {

					SACOM_EditorInstance.messageShow( 'Product saved. Your product was updated successfully.' );

				}

			} else {

				// Show error message (not saved)
				SACOM_EditorInstance.messageShow( 'Product could not be saved.' );

			}

			/* Update product editor data. */
			EditorBase.data.currentObjects.parent.model = response.model;

		});

	}

	/***
	 **
	 ** Messages
	 **
	 **/
	 messageClear() {

		var container = jQuery( '#editor-message-container' );
		container.html('');

	}

	messageShow( message ) {

		this.messageClear();
		var container = jQuery( '#editor-message-container' );
		container.append( message );

		setTimeout( function() {

			jQuery( '#editor-message-container' ).html('');

		}, 2000);

	}

	/* Sorting Functions */

	sortingSetup() {

		jQuery( document ).on( 'click', '#sort-asc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( SACOM_EditorInstance.sortAsc );
			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Most Recent' );

		});

		jQuery( document ).on( 'click', '#sort-desc', function() {

			jQuery( '.sacom-filters h3' ).removeClass( 'active' );
			jQuery( this ).addClass( 'active' );
			var sorted = EditorBase.data.objectList.sort( SACOM_EditorInstance.sortDesc );

			jQuery( document ).trigger({
				type: 'sacom_editor_object_list_sorted'
			});

			jQuery( '.list-section-header' ).html( 'Oldest Accounts' );

		});

	}

	sortAsc( a, b ) {

		return a.productId > b.productId ? -1 : 1;

	}

	sortDesc( a, b ) {

		return a.productId < b.productId ? -1 : 1;

	}

}

var SACOM_EditorInstance = new SACOM_ProductEditor();
SACOM_EditorInstance.init();
