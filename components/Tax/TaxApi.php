<?php

namespace SaberCommerce\Component\Tax;

class TaxApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/tax-rate',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getTaxRateCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/tax-rate/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getTaxRate' ],
				'args' => array(
					'id' => array(
						'validate_callback' => function($param, $request, $key) {
							return is_numeric( $param );
						}
					),
				),
			]
		);

		register_rest_route( 'sacom/v1', '/tax-rate/(?P<id>\d+)',
			[
				'methods' => 'PUT',
				'callback' => [ $this, 'changeTaxRate' ],
				'args' => array(
					'id' => array(
						'validate_callback' => function($param, $request, $key) {
							return is_numeric( $param );
						}
					),
				),
			]
		);

		register_rest_route( 'sacom/v1', '/tax-rate/(?P<id>\d+)',
			[
				'methods' => 'DELETE',
				'callback' => [ $this, 'deleteTaxRate' ],
				'args' => array(
					'id' => array(
						'validate_callback' => function($param, $request, $key) {
							return is_numeric( $param );
						}
					),
				),
			]
		);


		register_rest_route( 'sacom/v1', '/tax-rate',
			[
				'methods' => 'POST',
				'callback' => [ $this, 'createTaxRate' ],
				'args' => array(),
				'permission_callback' => function() {

					return current_user_can( 'manage_options' );

				}
			]
		);

		register_rest_route( 'sacom/v1', '/tax-class',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getTaxClassCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/tax-class',
			[
				'methods' => 'POST',
				'callback' => [ $this, 'createTaxClass' ],
				'args' => array(),
				'permission_callback' => function() {

					return current_user_can( 'manage_options' );

				}
			]
		);

		register_rest_route( 'sacom/v1', '/tax-class/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getTaxClass' ],
				'args' => array(
					'id' => array(
						'validate_callback' => function($param, $request, $key) {
							return is_numeric( $param );
						}
					),
				),
			]
		);

		register_rest_route( 'sacom/v1', '/tax-class/(?P<id>\d+)',
			[
				'methods' => 'PUT',
				'callback' => [ $this, 'changeTaxClass' ],
				'args' => array(
					'id' => array(
						'validate_callback' => function($param, $request, $key) {
							return is_numeric( $param );
						}
					),
				),
			]
		);

		register_rest_route( 'sacom/v1', '/tax-class/(?P<id>\d+)',
			[
				'methods' => 'DELETE',
				'callback' => [ $this, 'deleteTaxClass' ],
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

	public function createTaxRate( $request ) {

		$json = $request->get_body();
		$vars = json_decode( $json );

		$m = new TaxRateModel();
		$m->taxClassId = $vars->id_tax_class;
		$m->title      = $vars->title;
		$m->country    = $vars->country;
		$m->state      = $vars->state;
		$m->city       = $vars->city;
		$m->zipcode    = $vars->zipcode;
		$m->rate       = $vars->rate;
		$m->compound   = $vars->compound;
		$m->shipping   = $vars->shipping;
		$m->priority   = $vars->priority;
		$obj = $m->save();

		return $obj;

	}

	public function changeTaxRate( $request ) {

		$json = $request->get_body();
		$vars = json_decode( $json );
		$params = $request->get_params();

		$m = new TaxRateModel();
		$m->id         = $params['id'];
		$m->taxClassId = $vars->taxClassId;
		$m->title      = $vars->title;
		$m->country    = $vars->country;
		$m->state      = $vars->state;
		$m->city       = $vars->city;
		$m->zipcode    = $vars->zipcode;
		$m->rate       = $vars->rate;
		$m->compound   = $vars->compound;
		$m->shipping   = $vars->shipping;
		$m->priority   = $vars->priority;
		$obj = $m->save();

		return $obj;

	}

	public function getTaxRateCollection() {

		$m = new TaxRateModel();
		$tax_rate = $m->fetchAll();
		$response = [
			'tax_rate' => $tax_rate
		];
		return $response;

	}

	public function getTaxRate( $request ) {

		$m = new TaxRateModel();
		$tax = $m->fetchOne( $request['id'] );

		if ( !$tax ) {
			return new \WP_Error( 'no_tax', 'No tax with that tax ID.', array( 'status' => 404 ) );
		}

		return $tax;

	}

	public function getTaxClassCollection() {

		$m = new TaxClassModel();
		$taxClasses = $m->fetchAll();
		$response = [
			'tax_class' => $taxClasses
		];
		return $response;

	}

	public function createTaxClass( $request ) {

		$json = $request->get_body();
		$vars = json_decode( $json );

		$m = new TaxClassModel();
		$m->key         = $vars->key;
		$m->title       = $vars->title;
		$m->description = $vars->description;
		$obj = $m->save();

		return $obj;

	}

	public function getTaxClass( $request ) {

		$m = new TaxClassModel();
		$tax = $m->fetchOne( $request['id'] );

		if ( !$tax ) {
			return new \WP_Error( 'no_tax', 'No tax class with that ID.', array( 'status' => 404 ) );
		}

		return $tax;

	}

	public function changeTaxClass( $request ) {

		$json = $request->get_body();
		$vars = json_decode( $json );
		$params = $request->get_params();

		$m = new TaxClassModel();
		$m->id          = $params['id'];
		$m->title       = $vars->title;
		$m->key         = $vars->key;
		$m->description = $vars->description;
		$obj = $m->save();

		return $obj;

	}

	public function deleteTaxClass( $request ) {

		$params = $request->get_params();

		$m = new TaxClassModel();
		$taxClass = $m->fetchOne( $params['id'] );

		if( $taxClass ) {

			$taxClass->delete();
			return $taxClass;

		}

		return new \WP_Error( 'no_tax_class', 'No tax class with that ID.', array( 'status' => 404 ) );

	}

	public function deleteTaxRate( $request ) {

		$params = $request->get_params();

		$m = new TaxRateModel();
		$o = $m->fetchOne( $params['id'] );

		if( $o ) {

			$o->delete();
			return $o;

		}

		return new \WP_Error( 'no_tax_rate', 'No tax rate with that ID.', array( 'status' => 404 ) );

	}

}
