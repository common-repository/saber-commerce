<?php

namespace SaberCommerce\Component\Order;

class OrderApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/order',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getOrderCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/order/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getOrder' ],
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

	public function getOrderCollection() {

		$m = new OrderModel();
		$orders = $m->fetchAll();
		$response = [
			'orders' => $orders
		];
		return $response;

	}

	public function getOrder( $request ) {

		$m = new OrderModel();
		$order = $m->fetchOne( $request['id'] );

		if ( !$order ) {
			return new \WP_Error( 'no_order', 'No order with that order ID.', array( 'status' => 404 ) );
		}

		return $order;

	}

}
