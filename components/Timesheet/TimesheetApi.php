<?php

namespace SaberCommerce\Component\Timesheet;

class TimesheetApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/timesheet',
			[
				'methods' => 'GET',
				'callback' => [ $this, 'routeGetCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/timesheet',
			[
				'methods' => 'POST',
				'callback' => [ $this, 'routePostCreate' ],
			]
		);

		register_rest_route( 'sacom/v1', '/timesheet/(?P<id>\d+)',
			[
				'methods' => 'GET',
				'callback' => [ $this, 'routeGetOne' ],
				'args' => array(
					'id' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_numeric( $param );
						}
					),
				),
			]
		);

		register_rest_route( 'sacom/v1', '/timesheet/(?P<id>\d+)',
			[
				'methods' => 'PUT',
				'callback' => [ $this, 'routePutOne' ],
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

	public function routeGetCollection( $request ) {

		$m = new TimesheetModel();
		$objs = $m->fetchAll();
		return $objs;

	}

	public function routePostCreate( $request ) {

		$params = $request->get_params();

		$m = new TimesheetModel();
		$m->timesheetId = 0;

		$m = $this->setProperty( $m, 'accountId', $params, 'id_account' );
		$m = $this->setProperty( $m, 'workspaceId', $params, 'id_workspace' );
		$m = $this->setProperty( $m, 'label', $params, 'label' );
		$m = $this->setProperty( $m, 'dateStart', $params, 'date_start' );
		$m = $this->setProperty( $m, 'dateEnd', $params, 'date_end' );

		return $m->save();

	}

	public function routeGetOne( $request ) {

		$m = new TimesheetModel();
		$obj = $m->fetchOne( $request['id'] );

		if ( !$obj ) {
			return new \WP_Error(
				'no_object',
				'No timesheet found with the ID provided.',
				array( 'status' => 404 )
			);
		}

		return $obj;

	}

	public function routePutOne( $request ) {

		$params = $request->get_params();

		$m = new TimesheetModel();
		$m = $m->fetchOne( $request['id'] );

		if ( !$m ) {
			return new \WP_Error(
				'no_object',
				'No timesheet found with the ID provided.',
				array( 'status' => 404 )
			);
		}

		$m->timesheetId = $request['id'];
		$m = $this->setProperty( $m, 'accountId', $params, 'id_account' );
		$m = $this->setProperty( $m, 'workspaceId', $params, 'id_workspace' );
		$m = $this->setProperty( $m, 'label', $params, 'label' );
		$m = $this->setProperty( $m, 'dateStart', $params, 'date_start' );
		$m = $this->setProperty( $m, 'dateEnd', $params, 'date_end' );

		return $m->save();

	}

	public function setProperty( $obj, $prop, $array, $key ) {

		if( isset( $array[ $key ] ) ) {
			$obj->{$prop} = $array[ $key ];
		}

		return $obj;

	}

}
