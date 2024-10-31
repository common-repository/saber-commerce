<?php

namespace SaberCommerce\Component\Payment;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Account\AccountUserModel;
use \SaberCommerce\Component\Portal\PortalSectionModel;

class PaymentComponent extends \SaberCommerce\Component {

	public function init() {

		$this->addShortcodes();

		add_action('wp_enqueue_scripts', [$this, 'addScripts']);
		add_action('wp_enqueue_scripts', [$this, 'addStyles']);

		/* Initiate each payment method */
		$pm = new \SaberCommerce\Component\Payment\Methods\Stripe\StripePayments();
		$pm->init();

		/* Initiate each payment method */
		$pm = new \SaberCommerce\Component\Payment\Methods\PayPal\PayPal();
		$pm->init();

		$api = new PaymentApi();
		$api->init();

		add_filter( 'sacom_dashboard_widget_register', function( $widgets ) {

			$widgets[] = new PaymentSummaryDashboardWidget();
			return $widgets;

		});

		add_filter( 'sacom_portal_section_register', function( $sections, $user ) {

			$section = new PortalSectionModel();
			$section->key = 'payment';
			$section->title = "Payments";
			$section->position = 4.0;

			$section->routes = array(
				array(
					'route'    => '/payment/',
					'callback' => 'MODEL_COLLECTION',
				),
				array(
					'route'    => '/payment/[id]/',
					'callback' => 'MODEL_SINGLE',
				),
			);

			// Fetch model definition.
			$m = new PaymentModel;
			$section->data = [
				'modelDefinition' => $m->definition()
			];

			// Fetch all models if account.
			if( $user->ID > 0 ) {

				$aum = new AccountUserModel;
				$currentAccountUser = $aum->fetchOne( $user->ID );
				$models = $m->fetch( $currentAccountUser->accountId );
				$section->data['models'] = $models;

			}

			$sections[] = $section;
			return $sections;

		}, 10, 2 );

	}

	public function registerPaymentMethods() {

		// Core methods.
		$methods = [];

		// Stripe payment method.
		$methods[] = new Methods\Stripe\StripePayments();

		// Stripe payment method.
		$methods[] = new Methods\PayPal\PayPal();

		// Filter for extension methods.
		$methods = apply_filters( 'sacom_payment_methods', $methods );

		return $methods;

	}

	public function addShortcodes() {


	}

	public function showInMenu() {

		return true;

	}

	public function menuOrder() {

		return 30;

	}

	public function wpMenuLabel() {

		return __( 'Payments', 'saber-commerce' );

	}

	public function wpAdminSlug() {

		return 'sacom-payments';

	}

	public function adminCallback() {

		print '<sacom-payment-editor />';

	}

	public function addScripts() {


	}

	public function addStyles() {


	}

	public function calculatePaymentAmount( array $invoices ): int {

		$invoiceModel = new \SaberCommerce\Component\Invoice\InvoiceModel;
		$invoice = $invoiceModel->fetchOne( $invoices[0] );
		return $invoice->total * 100;

	}

	public function activation( $ae ) {

		global $wpdb;
		$charsetCollate = $wpdb->get_charset_collate();
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		/* Install Payment Table */
		$tableName = $ae->dbPrefix . 'payment';
		$sql = "CREATE TABLE $tableName (
			id_payment mediumint(9) NOT NULL AUTO_INCREMENT,
			id_account mediumint(9) NOT NULL,
			payment_method varchar(255) NOT NULL,
			payment_method_reference tinytext NOT NULL,
			memo tinytext NOT NULL,
			amount decimal(10, 2) NOT NULL,
			created datetime DEFAULT now() NOT NULL,
			PRIMARY KEY (id_payment)
		) $charsetCollate;";
		dbDelta( $sql );

		/* Install Payment Invoice Table */
		$tableName = $ae->dbPrefix . 'payment_invoice';
		$sql = "CREATE TABLE $tableName (
			id_payment_invoice mediumint(9) NOT NULL AUTO_INCREMENT,
			id_payment mediumint(9) NOT NULL,
			id_invoice mediumint(9) NOT NULL,
			amount decimal(10, 2) NOT NULL,
			created datetime DEFAULT now() NOT NULL,
			PRIMARY KEY (id_payment_invoice)
		) $charsetCollate;";
		dbDelta( $sql );

	}


}
