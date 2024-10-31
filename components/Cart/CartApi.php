<?php

namespace SaberCommerce\Component\Cart;

class CartApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/cart',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getCartCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/cart/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getCart' ],
				'permission_callback' => function() {

					// Restrict access to only administrators.
					return true;

				},
				'args' => array(
					'id' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						}
					),
				),
			]
		);

	}

	public function getCartCollection() {

		$m = new CartModel();
		$carts = $m->fetchAll();
		$response = [
			'carts' => $carts
		];
		return $response;

	}

	public function getCart( $request ) {

		$m = new CartModel();
		$cart = $m->fetchOne( $request['id'] );

		if ( !$cart ) {
			return new \WP_Error( 'no_cart', 'No cart with that cart ID.', array( 'status' => 404 ) );
		}

		return $cart;

	}

}
