<?php

namespace SaberCommerce\Component\Payment;

class PaymentApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/payment',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getPaymentCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/payment/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getPayment' ],
				'args' => array(
					'id' => array(
						'validate_callback' => function($param, $request, $key) {
							return is_numeric( $param );
						}
					),
				),
			]
		);

	}

	public function getPaymentCollection() {

		$m = new PaymentModel();
		$payments = $m->fetchAll();
		$response = [
			'payments' => $payments
		];
		return $response;

	}

	public function getPayment( $request ) {

		$m = new PaymentModel();
		$payment = $m->fetchOne( $request['id'] );

		if ( !$payment ) {
			return new \WP_Error( 'no_payment', 'No payment with that payment ID.', array( 'status' => 404 ) );
		}

		return $payment;

	}

}
