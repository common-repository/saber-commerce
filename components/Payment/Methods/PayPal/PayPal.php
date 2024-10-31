<?php

namespace SaberCommerce\Component\Payment\Methods\PayPal;

use \SaberCommerce\Component\Payment\PaymentModel;
use \SaberCommerce\Component\Payment\PaymentInvoiceModel;
use \SaberCommerce\Component\Invoice\InvoiceModel;
use \SaberCommerce\Component\Setting\SettingField;
use \SaberCommerce\Component\Setting\SettingModel;

class PayPal extends \SaberCommerce\Component\Payment\PaymentMethod {

	public function init() {

		add_filter( 'sacom_payment_settings_page_fields', function( $page ) {

			if( $page->key !== 'payment' ) {
				return $page;
			}

			// Setting Field paypal_enabled.
			$field          = new SettingField();
			$field->type    = 'toggle';
			$field->id      = 'paypal_enabled';
			$field->label   = __( 'PayPal Enabled', 'saber-commerce' );
			$field->default = 0;
			$field->value = SettingModel::load( 'paypal_enabled' );
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

			return $fields;

		});

	}

	public function getKey() {
		return 'paypal';
	}

	public function getTitle() {
		return 'PayPal';
	}

	public function addScripts() {}

	public function render() {

		print '<h2>Use PayPal?</h2>';

	}

	function script() {

		return false;

	}

}
