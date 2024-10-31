<?php

namespace SaberCommerce\Component\Product;

class ProductApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/product',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getProductCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/product/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getProduct' ],
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

	public function getProductCollection() {

		$m = new ProductModel();
		$products = $m->fetchAll();
		$response = [
			'products' => $products
		];
		return $response;

	}

	public function getProduct( $request ) {

		$m = new ProductModel();
		$product = $m->fetchOne( $request['id'] );

		if ( !$product ) {
			return new \WP_Error( 'no_product', 'No product with that product ID.', array( 'status' => 404 ) );
		}

		return $product;

	}

}
