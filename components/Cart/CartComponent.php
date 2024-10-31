<?php

namespace SaberCommerce\Component\Cart;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Product\ProductModel;

class CartComponent extends \SaberCommerce\Component {

	public function init() {

		$this->shortcodes();

		$this->enqueueFrontScripts();

		$this->ajaxHooks();

		$api = new CartApi();
		$api->init();

	}

	public function ajaxHooks() {

		/* Update cart item quantity. */
		add_action( 'wp_ajax_sacom_cart_item_update', function() {

			$response = new \stdClass();
			$post     = sanitize_post( $_POST );

			$m = new CartModel();
			$cart = $m->get();
			$response->cart = $cart;

			if( $cart->status === 'locked' ) {

				$response->error = 'Cart is locked by the system for archival and cannot be edited.';
				$response->code = 200;
				wp_send_json_success( $response );

			}

			$m = new CartItemModel();
			$cartItem = $m->fetchOne( $post['cartItemId'] );
			$cartItem->quantity = $post['quantity'];
			$cartItem->save();

			// Get new cart markup.
			$response->cartMarkup = $this->getCartMarkup( $cart );

			$response->code = 200;
			wp_send_json_success( $response );

		});

		/* Add item to cart. */
		add_action( 'wp_ajax_sacom_cart_add', [ $this, 'cartAdd' ] );
		add_action( 'wp_ajax_nopriv_sacom_cart_add', [ $this, 'cartAdd' ] );

		/* Remove item from cart. */
		add_action( 'wp_ajax_sacom_cart_remove', function() {

			$response = new \stdClass();

			$response = new \stdClass();
			$post     = sanitize_post( $_POST );

			// Load and return cart updated.
			$cartId = $post[ 'cartId' ];
			$m = new CartModel();
			$cart = $m->get();
			$response->cart = $cart;

			if( $cart->status === 'locked' ) {

				$response->error = 'Cart is locked by the system for archival and cannot be edited.';
				$response->code = 200;
				wp_send_json_success( $response );

			}

			$cartItemId = $post[ 'cartItemId' ];

			// Load then delete cart item.
			$m = new CartItemModel();
			$m->fetchOne( $cartItemId );
			$m->delete();

			// Get new cart markup.
			$response->cartMarkup = $this->getCartMarkup( $cart );

			$response->code = 200;
			wp_send_json_success( $response );

		});

		/* Empty cart. */
		add_action( 'wp_ajax_sacom_cart_empty', function() {

			$response = new \stdClass();

			$post = sanitize_post( $_POST );
			$cartId = $post['cartId'];

			$m = new CartModel();
			$cart = $m->get();

			if( $cart->status === 'locked' ) {

				$response->error = 'Cart is locked by the system for archival and cannot be edited.';
				$response->code = 200;
				wp_send_json_success( $response );

			}

			foreach( $cart->items as $item ) {

				$item->delete();

			}

			// Fetch and send updated cart.
			$cart = $m->get();
			$response->cart = $cart;

			// Get new cart markup.
			$response->cartMarkup = $this->getCartMarkup( $cart );

			$response->code = 200;
			wp_send_json_success( $response );

		});

		/* Make cart for current logged in user. */
		add_action( 'wp_ajax_sacom_cart_make', function() {

			$response = new \stdClass();

			$post = sanitize_post( $_POST );

			$m = new CartModel();
			$m->referenceType = 'user';
			$m->referenceId = get_current_user_id();
			$m->save();

			// Fetch and send updated cart.
			$cart = $m->get();
			$response->cart = $cart;

			// Get new cart markup.
			$response->cartMarkup = $this->getCartMarkup( $cart );

			$response->code = 200;
			wp_send_json_success( $response );

		});

	}

	public function cartAdd() {

		$response = new \stdClass();
		$post     = sanitize_post( $_POST );

		$m = new CartModel();
		$cart = $m->get();

		// Check for locked cart status.
		if( $cart->status === 'locked' ) {

			$response->error = 'Cart is locked by the system for archival and cannot be edited.';
			$response->code = 200;
			wp_send_json_success( $response );

		}

		$m = new CartItemModel();
		$m->cartId     = $post['cartId'];
		$m->objectType = $post['objectType'];
		$m->objectId   = $post['objectId'];

		$p = new ProductModel;
		$product = $p->fetchOne( $m->objectId );
		$m->price      = $product->price;
		$m->quantity   = '1';

		$m->subtotal = number_format( $m->quantity * $m->price, 2 );
		$m->save();

		$response->cartItem = $m;

		// Get new cart markup.
		$response->cartMarkup = $this->getCartMarkup( $cart );

		$response->code = 200;
		wp_send_json_success( $response );

	}

	public function shortcodes() {

		add_shortcode( 'sacom_cart', function() {

			$m = new CartModel();
			$cart = $m->get();

			return $this->getCartMarkup( $cart );

		});

	}

	public function getCartMarkup( $cart ) {

		$strings = [
			'product'          => __( 'Product', 'saber-commerce' ),
			'new'              => __( 'New', 'saber-commerce' ),
			'price'            => __( 'Price', 'saber-commerce' ),
			'quantity'         => __( 'Quantity', 'saber-commerce' ),
			'subtotal'         => __( 'Subtotal', 'saber-commerce' ),
			'empty_cart'       => __( 'Empty Cart', 'saber-commerce' ),
			'proceed_checkout' => __( 'Proceed to Checkout', 'saber-commerce' ),
			'remove'           => __( 'Remove', 'saber-commerce' ),
			'return_to_shop'   => __( 'Return to Shop', 'saber-commerce' )
		];

		$templateOverridePath = locate_template( 'sacom/cart/cart.php' );
		$templateOverridePathSecure = ( 0 === strpos( realpath( $templateOverridePath ), realpath( STYLESHEETPATH ) ) || 0 === strpos( realpath( $templateOverridePath ), realpath( TEMPLATEPATH ) ) || 0 === strpos( realpath( $templateOverridePath ), realpath( ABSPATH . WPINC . '/theme-compat/' ) ));

		$template = new Template();

		if ( $templateOverridePathSecure ) {

			$template->setFullPath( $templateOverridePath );

		} else {

			$template->path = 'components/Cart/templates/';
			$template->name = 'cart';

		}

		$template->data = [
			'cart'    => $cart,
			'strings' => $strings
		];

		return $template->get();

	}

	public function enqueueFrontScripts() {

		add_action( 'wp_enqueue_scripts', function() {

			wp_enqueue_script(
				'sacom-cart-script',
				SABER_COMMERCE_URL . 'components/Cart/js/Cart.js',
				['jquery'],
				\SaberCommerce\Plugin::getEnqueueVersion(),
				true
			);

			$m = new CartModel();
			$cart = $m->get();

			// Get cart page.
			$cartPage = get_page_by_path( 'cart' );
			$cartPagePermalink = get_permalink( $cartPage->ID );

			$localizedData = [
				'adminUrl'          => admin_url(),
				'saberCommerceUrl'  => SABER_COMMERCE_URL,
				'siteUrl'           => site_url(),
				'userId'            => get_current_user_id(),
				'cartId'            => $cart->cartId,
				'cartPagePermalink' => $cartPagePermalink,
				'strings'           => $this->strings()
			];

			wp_localize_script(
				'sacom-cart-script',
				'SACOM_CartData',
				$localizedData
			);

		});

	}

	function strings() {

		return [

			'cart_emptied' => __( 'Cart emptied!', 'saber-commerce' ),
			'item_removed' => __( 'Item removed from cart.', 'saber-commerce' ),
			'cart_updated' => __( 'Cart updated.', 'saber-commerce' ),

		];

	}

	public function addCartPage( $ae ) {

		$slug = 'cart';

		$page = [
			'post_type'    => 'page',
			'post_title'   => 'Cart',
			'post_author'  => 1,
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_content' => '[sacom_cart]'
		];

		if( !get_page_by_path( $slug ) ) {

			$pageId = wp_insert_post( $page );

		}

	}

	public function addDatabaseTables( $ae ) {

		global $wpdb;
		$charsetCollate = $wpdb->get_charset_collate();
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		/* Install cart main table. */
		$tableName = $ae->dbPrefix . 'cart';
		$sql = "CREATE TABLE $tableName (
			id_cart mediumint( 9 ) NOT NULL AUTO_INCREMENT,
			reference_type varchar( 255 ) NOT NULL,
			reference_id varchar( 255 ) NOT NULL,
			status varchar( 128 ) DEFAULT 'active' NOT NULL,
			created datetime DEFAULT now() NOT NULL,
			PRIMARY KEY ( id_cart )
		) $charsetCollate;";
		dbDelta( $sql );

		/* Install cart item table. */
		$tableName = $ae->dbPrefix . 'cart_item';
		$sql = "CREATE TABLE $tableName (
			id_cart_item mediumint(9) NOT NULL AUTO_INCREMENT,
			id_cart mediumint(9) NOT NULL,
			object_type varchar(255) NOT NULL,
			object_id mediumint(9) NOT NULL,
			quantity mediumint(9) NOT NULL,
			price decimal(10,2) NOT NULL,
			subtotal decimal(10,2) NOT NULL,
			created datetime DEFAULT now() NOT NULL,
			PRIMARY KEY (id_cart_item)
		) $charsetCollate;";
		dbDelta( $sql );

	}

	public function activation( $ae ) {

		$this->addCartPage( $ae );
		$this->addDatabaseTables( $ae );

	}

}
