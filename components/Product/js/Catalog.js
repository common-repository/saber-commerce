class SACOM_Catalog {

	init() {

		// Show updated message after quantity change.
		jQuery( document ).on( 'sacom_cart_updated', function( e ) {

			console.log( 'in shop doing on sacom_cart_updated...' );

			const shopEl = jQuery( 'div.sacom-shop' );

			console.log( shopEl )
			console.log( e )

			if( shopEl.length >= 1 ) {

				// Show alert to user.

			}

		});

		/* Product grid item click to permalink single page. */
		jQuery( '.sacom-shop-grid-item' ).on( 'click', function( e ) {

			if( e.target.className === 'sacom-cart-add' ) {
				return;
			}

			const permalink = jQuery( this ).attr( 'data-permalink' );
			window.location = permalink;

		});

	}

}

var SACOM_CatalogInstance = new SACOM_Catalog();
SACOM_CatalogInstance.init();
