class SACOM_Cart {

	init() {

		this.add();
		this.remove();
		this.change();
		this.cartEmpty();
		this.checkout();
		this.returnToShop();

		/* Do cart refresh after cart updated hook fires. */
		jQuery( document ).on( 'sacom_cart_updated', function( e ) {

			console.log( 'doing on sacom_cart_updated...' );

			const cartEl = jQuery( 'div.sacom-cart' );

			if( cartEl.length >= 1 ) {
				cart.refresh( e.cartMarkup );
			}

		});

	}

	change() {

		/* Change from block cart fires on click to update button. */
		jQuery( document ).on( 'click', '.scm-cart-update-button', function() {

			console.log('firing click update cart...')

		});

		/* Change from PHP/HTML mixed template where it fires on change to input. */
		jQuery( document ).on( 'change', '.sacom-cart-quantity', function() {

			let el = jQuery( this );
			let newQuantity = el.val();
			let cartId     = cart.getCartId();
			let cartItemId = el.parents( 'tr' ).attr( 'data-cart-item' );

			let data = {
				cartId: cartId,
				cartItemId: cartItemId,
				quantity: newQuantity
			}

			wp.ajax.post( 'sacom_cart_item_update', data ).done( function( response ) {

				cart.message( SACOM_CartData.strings.cart_updated );

				jQuery( document ).trigger({

					type: 'sacom_cart_updated',
					cartMarkup: response.cartMarkup

				});

			});

		});

	}

	/* Add single item to cart. */
	add() {

		jQuery( document ).on( 'click', '.sacom-cart-add', function() {

			const button = jQuery( this );

			// Make cart if user doesn't have one yet.
			if( !cart.userHasCart() ) {

				// @TODO in this situation where a cart is made, it might be instant (cookie cart for anonymous) or it might take a request and response from server after making a database cart record.
				// We need to fire an event when cart is made, and only add the product when this happens.
				cart.makeCart();

			}

			// Fetch cart ID.
			let cartId = cart.getCartId();

			let objectType = jQuery( this ).attr( 'data-object-type' );
			let objectId   = jQuery( this ).attr( 'data-object-id' );

			let data = {

				cartId: cartId,
				objectType: objectType,
				objectId: objectId

			}

			wp.ajax.post( 'sacom_cart_add', data ).done( function( response ) {

				// Show notice to user.
				cart.showCartAddMessage( button );

				// Maybe refresh cart if on cart page.

			});

		});

	}

	showCartAddMessage( button ) {

		const cartUrl = SACOM_CartData.cartPagePermalink;
		button.after( '<div class="sacom-cart-add-message">Product has been added to the cart. Visit your <a href="' + cartUrl + '">cart</a>.' );
		setInterval( function() { jQuery( '.sacom-cart-add-message' ).remove(); }, 3000);
		button.before( '<input class="sacom-cart-quantity" type="number" value="1" />')
		button.remove();

	}

	/* Remove single item from cart. */
	remove() {

		jQuery( document ).on( 'click', '.sacom-cart-remove', function() {

			let cartId     = cart.getCartId();
			let cartItemId = jQuery( this ).attr( 'data-cart-item' );

			let data = {
				cartId: cartId,
				cartItemId: cartItemId
			}

			wp.ajax.post( 'sacom_cart_remove', data ).done( function( response ) {

				cart.refresh( response.cartMarkup );
				cart.message( SACOM_CartData.strings.item_removed );

			});

		});

	}

	cartEmpty() {

		jQuery( document ).on( 'click', '#sacom-cart-empty', function() {

			let cartId = cart.getCartId();
			let data = {
				cartId: cartId
			}

			wp.ajax.post( 'sacom_cart_empty', data ).done( function( response ) {

				cart.refresh( response.cartMarkup );
				cart.message( SACOM_CartData.strings.cart_emptied );

			});

		});

	}

	checkout() {

		jQuery( document ).on( 'click', '#sacom-cart-checkout, .wp-block-saber-commerce-cart-actions button.btn-primary', function() {

			window.location = SACOM_CartData.siteUrl + '/checkout/';

		});

	}

	refresh( markup ) {

		jQuery( '.entry-content' ).html( markup );

	}

	message( msg ) {

		jQuery( '.sacom-cart-alerts' ).html( msg ).show();

		setTimeout( function() {

			cart.messageClear();

		}, 2000);

	}

	messageClear() {

		jQuery( '.sacom-cart-alerts' ).html( '' ).hide();

	}

	userHasCart() {

		// Get saved cart for logged in user.
		if( SACOM_CartData.cartId > 0 ) {

			return true;

		}

		// Get cookie cart for anonymous user.
		if( this.cookieGet( 'sacom_cart' ) ) {

			return true;

		}

		// No cart found.
		return false;

	}

	getCartId() {

		if( SACOM_CartData.cartId > 0 ) {

			return SACOM_CartData.cartId;

		}

		if( this.cookieGet( 'sacom_cart' ) ) {

			return this.cookieGet( 'sacom_cart' );

		}

		return false;

	}

	makeCart() {

		if( this.userLoggedOut() ) {

			this.makeAnonymousCart();

		} else {

			this.makeUserCart();

		}

	}

	makeUserCart() {

		wp.ajax.post( 'sacom_cart_make' ).done( function( response ) {

			// Update stored cart ID reference.
			SACOM_CartData.cartId = response.cart.cartId;

		});

	}

	userLoggedOut() {

		if( SACOM_CartData.userId == 0 ) {
			return true;
		}

		return false;

	}

	makeAnonymousCart() {

		let cartReference = 'HKLHKFLJFKLDSFSDJGFDSKFHDSFDKLDSFSDFDS';
		this.cookieSet( 'sacom_cart', cartReference, 15 );

	}

	cookieSet( name, value, expiryDays ) {

		let date = new Date();
		date.setTime( date.getTime() + ( expiryDays * 24 * 60 * 60 * 1000 ) );
		const expires = "expires=" + date.toUTCString();
		document.cookie = name + "=" + value + "; " + expires + "; path=/";

	}

	cookieGet( cname ) {

		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');

		for( var i = 0; i <ca.length; i++ ) {

			var c = ca[i];

			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}

			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}

		}

		return "";

	}

	returnToShop() {

		jQuery( document ).on( 'click', '#sacom-cart-return-shop, .scm-continue-shopping-button', function() {

			window.location = SACOM_CartData.siteUrl + '/shop/';

		});

	}

}

var cart = new SACOM_Cart();
cart.init();
