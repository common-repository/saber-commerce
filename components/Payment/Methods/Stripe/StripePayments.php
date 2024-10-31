<?php

namespace SaberCommerce\Component\Payment\Methods\Stripe;

use \SaberCommerce\Component\Setting\SettingField;
use \SaberCommerce\Component\Setting\SettingModel;
use \SaberCommerce\Component\Payment\PaymentModel;
use \SaberCommerce\Component\Payment\PaymentInvoiceModel;
use \SaberCommerce\Component\Invoice\InvoiceModel;

class StripePayments extends \SaberCommerce\Component\Payment\PaymentMethod {

	public function getKey() {
		return 'stripe';
	}

	public function getTitle() {
		return 'Stripe';
	}

	public function init() {

		require SABER_COMMERCE_PATH . 'components/Payment/Methods/Stripe/vendor/autoload.php';

		add_action('wp_enqueue_scripts', [$this, 'addScripts']);
		add_action('wp_enqueue_scripts', [$this, 'addStyles']);

		$this->ajaxStripeCheckout();

		add_action('wp_ajax_sacom_stripe_status_change', function() {

			$post      = sanitize_post( $_POST );
			$paymentId = $post['paymentId'];
			$status    = $post['status'];

			$response = new \stdClass();
			$response->code = 200;

			$paymentModel = new \SaberCommerce\Component\Payment\PaymentModel();
			$payment = $paymentModel->fetchOne( $paymentId );
			$payment->memo = $payment->memo . '_status_' . $status;
			$payment->save();

			wp_send_json_success( $response );
			wp_die();

		});

		/* Settings. */
		add_filter( 'sacom_setting_page_register', function( $pages ) {

			$page = new \stdClass;
			$page->key       = 'payment';
			$page->title     = __( 'Payments', 'saber-commerce' );
			$page->menuLabel = __( 'Payments', 'saber-commerce' );

			// Setting Field stripe_enabled.
			$field          = new SettingField();
			$field->type    = 'toggle';
			$field->id      = 'stripe_enabled';
			$field->label   = __( 'Stripe Enabled', 'saber-commerce' );
			$field->default = 0;
			$field->value = SettingModel::load( 'stripe_enabled' );
			$field->choices = [
				[
					'value' => 1,
					'label' => __( 'ENABLED', 'saber-commerce' )
				],
				[
					'value' => 0,
					'label' => __( 'DISABLED', 'saber-commerce' )
				]
			];
			$page->fields[] = $field;

			// Setting Field stripe_mode.
			$field          = new SettingField();
			$field->type    = 'toggle';
			$field->id      = 'stripe_mode';
			$field->label   = __( 'Stripe Mode', 'saber-commerce' );
			$field->default = 1;
			$field->value = SettingModel::load( 'stripe_mode' );
			$field->choices = [
				[
					'value' => 1,
					'label' => __( 'TEST', 'saber-commerce' )
				],
				[
					'value' => 2,
					'label' => __( 'LIVE', 'saber-commerce' )
				]
			];
			$page->fields[] = $field;

			// Setting Field stripe_test_publishable_key.
			$field        = new SettingField();
			$field->type  = 'text';
			$field->id    = 'stripe_test_publishable_key';
			$field->label = __( 'Stripe Test Publishable Key', 'saber-commerce' );
			$field->value = SettingModel::load( 'stripe_test_publishable_key' );
			$page->fields[] = $field;

			// Setting Field stripe_test_secret_key.
			$field        = new SettingField();
			$field->type  = 'text';
			$field->id    = 'stripe_test_secret_key';
			$field->label = __( 'Stripe Test Secret Key', 'saber-commerce' );
			$field->value = SettingModel::load( 'stripe_test_secret_key' );
			$page->fields[] = $field;

			// Setting Field stripe_live_publishable_key.
			$field          = new SettingField();
			$field->type    = 'text';
			$field->id      = 'stripe_live_publishable_key';
			$field->label   = __( 'Stripe Live Publishable Key', 'saber-commerce' );
			$field->value = SettingModel::load( 'stripe_live_publishable_key' );
			$page->fields[] = $field;

			// Setting Field stripe_live_secret_key.
			$field          = new SettingField();
			$field->type    = 'text';
			$field->id      = 'stripe_live_secret_key';
			$field->label   = __( 'Stripe Live Secret Key', 'saber-commerce' );
			$field->value = SettingModel::load( 'stripe_live_secret_key' );
			$page->fields[] = $field;

			// Apply a filter to fields
			// @TODO move this page setup and field filtering to payment component because it's for all payment methods...
			$page = apply_filters( 'sacom_payment_settings_page', $page );

			$pages[] = $page;
			return $pages;

		});

	}

	public function ajaxStripeCheckout() {

		add_action('wp_ajax_sacom_stripe_checkout', function() {

			$post        = sanitize_post( $_POST );
			$invoiceIds = $post['invoices'];
			$response    = new \stdClass();

			$sacomSettings = get_option( 'sacom_settings' );
			$this->setStripeApiKey( $sacomSettings->stripe_mode, $sacomSettings );

			$invoices = $this->loadInvoices( $invoiceIds );

			$response->paymentStatus = $this->parseInvoicePaymentStatus( $invoices );

			$response->amountPaid = $amountPaid;

			if( $amountPaid == $invoice->total ) {
				$response->paidInFull = 1;
			} else {
				$response->paidInFull = 0;
			}

			// use PaymentInvoice to fetch Payment
			// get the PaymentIntent ID from the payment
			$paymentInvoice = $paymentInvoiceModels[0];
			$existingPaymentId = $paymentInvoice->paymentId;
			$paymentModel = new PaymentModel();
			$payment = $paymentModel->fetchOne( $existingPaymentId );
			$paymentIntent = \Stripe\PaymentIntent::retrieve( $payment->memo );
			$response->clientSecret = $paymentIntent->client_secret;

			// send response
			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action('wp_ajax_sacom_stripe_checkout_intent', [ $this, 'checkoutIntentRequest' ] );
		add_action('wp_ajax_nopriv_sacom_stripe_checkout_intent', [ $this, 'checkoutIntentRequest' ] );

	}

	public function checkoutIntentRequest() {

		$post        = sanitize_post( $_POST );
		$response    = new \stdClass();

		//$amount = $post['amount'];

		$sacomSettings = get_option( 'sacom_setting' );
		$this->setStripeApiKey( $sacomSettings->stripe_mode, $sacomSettings );

		// use PaymentInvoice to fetch Payment
		// get the PaymentIntent ID from the payment
		$paymentIntent = \Stripe\PaymentIntent::create(
			[
				'amount' => 1000,
				'currency' => 'usd'
			]
		);
		$response->clientSecret = $paymentIntent->client_secret;

		// send response
		$response->code = 200;
		wp_send_json_success( $response );

	}

	public function parseInvoicePaymentStatus( $invoices ) {

		$status = 'unpaid';

		$paidInFull = 0;
		$paidPartial = 0;
		foreach( $invoices as $invoice ) {

			if( $invoice->total <= $invoice->paid ) {

				$paidInFull++;
				continue;

			}

			if( $invoice->paid > 0 ) {

				$paidPartial++;

			}

		}

		if( $paidInFull == count( $invoices ) ) {

			return 'paid_full';

		}

		if( $paidPartial >= 1 ) {

			return 'paid_partial';

		}

	}

	public function setStripeApiKey( $mode, $sacomSettings ) {

		if( $mode == 1 ) {

			\Stripe\Stripe::setApiKey( $sacomSettings->stripe_test_secret_key );

		}

		if( $mode == 2 ) {

			\Stripe\Stripe::setApiKey( $sacomSettings->stripe_live_secret_key );

		}

	}

	public function loadInvoices( $invoiceIds ) {

		$invoices = [];
		$m = new \SaberCommerce\Component\Invoice\InvoiceModel;
		foreach( $invoiceIds as $invoiceId ) {

			$invoices[] = $m->fetchOne( $invoiceId );

		}

		return $invoices;

	}

	public function addScripts() {

		wp_enqueue_script(
			'sacom-stripe',
			'https://js.stripe.com/v3/',
			[],
			'3.0.0',
			false
	  );

		wp_enqueue_script(
			'sacom-stripe-client',
			SABER_COMMERCE_URL . '/components/Payment/Methods/Stripe/script/client.js',
			[ 'sacom-stripe', 'wp-util' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			false
		);

		wp_enqueue_script(
			'sacom-stripe-client-v2',
			SABER_COMMERCE_URL . '/components/Payment/Methods/Stripe/script/client_v2.js',
			[ 'sacom-stripe', 'wp-util' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			false
		);

		$localizedData = [
			'saberCommerceUrl' => SABER_COMMERCE_URL,
			'settings'         => get_option( 'sacom_settings' )
		];

		wp_localize_script(
			'sacom-stripe-client',
			'stripePaymentData',
			$localizedData
		);

		wp_localize_script(
			'sacom-stripe-client-v2',
			'stripePaymentData',
			$localizedData
		);

	}

	public function addStyles() {

		wp_enqueue_style(
			'sacom-stripe-form',
			SABER_COMMERCE_URL . '/components/Payment/Methods/Stripe/css/stripe-form.css',
			[],
			time()
	  );

	}

	public function render() {

		require( SABER_COMMERCE_PATH . 'components/Payment/Methods/Stripe/templates/checkout.php' );

	}

	public function script() {

		$s = '';

		$s .= '<script type="text/javascript">';
		$s .= 'var sacomStripeClient = new SACOM_StripeClient();';
		$s .= 'sacomStripeClient.init();';
		$s .= '</script>';

		print $s;

	}

}
