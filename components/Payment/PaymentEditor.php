<?php

namespace SaberCommerce\Component\Payment;

class PaymentEditor {

	public function init() {

		add_action( 'wp_ajax_sacom_payment_loader', function() {

			$response = new \stdClass();

			$obj = new PaymentModel();
			$response->objects = $obj->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});


	}

	public function enqueueEditorScript() {

		wp_enqueue_script(
			'sacom-payment-editor',
			SABER_COMMERCE_URL . 'components/Payment/js/PaymentEditor.js',
			[ 'sacom-editor-base', 'sacom-admin-script', 'sacom-cleave', 'wp-util', 'jquery-ui-tooltip', 'jquery-ui-dialog', 'jquery-ui-datepicker', 'sacom-dayjs' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			1
		);

		$localizedData = [
			'saberCommerceUrl' => SABER_COMMERCE_URL,
			'strings'          => $this->strings()
		];

		wp_localize_script(
			'sacom-payment-editor',
			'editorData',
			$localizedData
		);

	}

	function strings() {

		return [
			'add_new'             => __( 'Add New', 'saber-commerce' ),
			'view_all'            => __( 'View All', 'saber-commerce' ),
			'dashboard_uppercase' => __( 'DASHBOARD', 'saber-commerce' ),
		];

	}

}
