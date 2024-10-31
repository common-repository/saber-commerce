<?php

namespace SaberCommerce\Component\Checkout;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Cart\CartModel;
use \SaberCommerce\Component\Order\OrderModel;
use \SaberCommerce\Component\Payment\PaymentComponent;

class CheckoutComponent extends \SaberCommerce\Component {

	public function init() {

		$this->addShortcodes();
		$this->enqueueFrontScripts();
		$this->ajaxHooks();

	}

	public function ajaxHooks() {

		/* Process checkout form. */
		add_action( 'wp_ajax_nopriv_sacom_checkout_process', [ $this, 'process' ] );
		add_action( 'wp_ajax_sacom_checkout_process', [ $this, 'process' ] );

	}

	public function process() {

		$response = new \stdClass();
		$post     = sanitize_post( $_POST );
		$formData = $post['formData'];

		/*

		@TODO
			We should check the length of the cartId here to find if it's a cookie cart reference.
			This saves us having to pass the reference type, if it's a long string with alpha-numeric it's a hash length.

		*/

		$m = new CartModel();
		$cart = $m->fetchOne( $post['cartId'] );

		// Make order from cart.
		$m = new OrderModel();
		$order = $m->makeOrderFromCart( $cart );

		// Make WP user account.

		// Make SACOM account.

		/* Return order with order number. */
		$response->order = $order;

		if( $order->isValid() ) {

			$response->code = 200;

		} else {

			// Send code 500 for invalid order, order creation failure.
			$response->code = 500;

		}

		wp_send_json_success( $response );

	}

	public function enqueueFrontScripts() {

		add_action( 'wp_enqueue_scripts', function() {

			if( is_page( 'checkout' ) ) {

				wp_enqueue_style(
					'sacom-checkout-styles',
					SABER_COMMERCE_URL . '/components/Checkout/css/checkout.css',
					[],
					\SaberCommerce\Plugin::getEnqueueVersion(),
					'all'
				);

				wp_enqueue_script(
					'sacom-checkout-script',
					SABER_COMMERCE_URL . 'components/Checkout/js/Checkout.js',
					['jquery'],
					\SaberCommerce\Plugin::getEnqueueVersion(),
					true
				);

				$localizedData = [
					'adminUrl' => admin_url(),
					'saberCommerceUrl' => SABER_COMMERCE_URL,
					'siteUrl' => site_url(),
					'cartUrl' => site_url() . '/cart'
				];

				wp_localize_script(
					'sacom-checkout-script',
					'sacomData',
					$localizedData
				);

			}

		});

	}

	public function addShortcodes() {

		add_shortcode('sacom_checkout', function() {

			$m = new CartModel();
			$cart = $m->get();

			// Create translation strings.
			$strings = [
				'billing_details_heading' => __( 'Billing Details', 'saber-commerce' ),
				'order_summary_heading'   => __( 'Your Order Summary', 'saber-commerce' ),
				'cart_col_product_label'  => __( 'Product', 'saber-commerce' ),
				'cart_col_price_label'    => __( 'Price', 'saber-commerce' ),
				'cart_col_quantity_label' => __( 'Quantity', 'saber-commerce' ),
				'cart_col_subtotal_label' => __( 'Subtotal', 'saber-commerce' ),
				'payment_options_header'  => __( 'Payment Options', 'saber-commerce' )
			];

			// Load fields.
			$fields = $this->fields();

			// Load payment methods.
			$pc = new PaymentComponent();
			$paymentMethods = $pc->registerPaymentMethods();

			$templateOverridePath = locate_template( 'sacom/checkout/checkout.php' );
			$templateOverridePathSecure = ( 0 === strpos( realpath( $templateOverridePath ), realpath( STYLESHEETPATH ) ) || 0 === strpos( realpath( $templateOverridePath ), realpath( TEMPLATEPATH ) ) || 0 === strpos( realpath( $templateOverridePath ), realpath( ABSPATH . WPINC . '/theme-compat/' ) ));

			$template = new Template();

			if ( $templateOverridePathSecure ) {

				$template->setFullPath( $templateOverridePath );

			} else {

				$template->path = 'components/Checkout/templates/';
				$template->name = 'checkout';

			}

			$template->data = [
				'cart'           => $cart,
				'strings'        => $strings,
				'fields'         => $fields,
				'paymentMethods' => $paymentMethods
			];
			return $template->get();

		});


	}

	public function fields() {

		$fields = [];

		// First name field.
		$m        = new CheckoutField();
		$m->id    = 'first_name';
		$m->label = __( 'First Name', 'saber-commerce' );
		$fields[] = $m;

		// Last name field.
		$m        = new CheckoutField();
		$m->id    = 'last_name';
		$m->label = __( 'Last Name', 'saber-commerce' );
		$fields[] = $m;

		// Company name field.
		$m        = new CheckoutField();
		$m->id    = 'company_name';
		$m->label = __( 'Company Name', 'saber-commerce' );
		$fields[] = $m;

		// Country field.
		$m        = new CheckoutField();
		$m->id    = 'country';
		$m->label = __( 'Country', 'saber-commerce' );
		$fields[] = $m;

		// Street address 1 field.
		$m        = new CheckoutField();
		$m->id    = 'street_address_1';
		$m->label = __( 'Street Address', 'saber-commerce' );
		$fields[] = $m;

		// City field.
		$m        = new CheckoutField();
		$m->id    = 'city';
		$m->label = __( 'City', 'saber-commerce' );
		$fields[] = $m;

		// City field.
		$m        = new CheckoutField();
		$m->id    = 'zip_postal';
		$m->label = __( 'Zip or Postal Code', 'saber-commerce' );
		$fields[] = $m;

		// Phone field.
		$m        = new CheckoutField();
		$m->id    = 'phone';
		$m->label = __( 'Phone', 'saber-commerce' );
		$fields[] = $m;

		// Email field.
		$m        = new CheckoutField();
		$m->id    = 'email';
		$m->label = __( 'Email', 'saber-commerce' );
		$fields[] = $m;

		// Order notes field.
		$m        = new CheckoutField();
		$m->id    = 'order_notes';
		$m->label = __( 'Order Notes', 'saber-commerce' );
		$fields[] = $m;

		$fields = apply_filters( 'sacom_checkout_fields', $fields );
		return $fields;

	}

	public function addCheckoutPage( $ae ) {

		$slug = 'checkout';

		$page = [
			'post_type'    => 'page',
			'post_title'   => 'Checkout',
			'post_author'  => 1,
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_content' => '[sacom_checkout]'
		];

		if( !get_page_by_path( $slug ) ) {

			$pageId = wp_insert_post( $page );

		}

	}

	public function activation( $ae ) {

		$this->addCheckoutPage( $ae );

	}

}
