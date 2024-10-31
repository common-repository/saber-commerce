<?php

namespace SaberCommerce\Component\Setting;

class SettingApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/setting',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getSettingCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/setting/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getSetting' ],
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

	public function getSettingCollection() {

		$m = new SettingModel();
		$settings = $m->fetchAll();
		$response = [
			'settings' => $settings
		];
		return $response;

	}

	public function getSetting( $request ) {

		$m = new SettingModel();
		$setting = $m->fetchOne( $request['id'] );

		if ( !$setting ) {
			return new \WP_Error( 'no_setting', 'No setting with that setting ID.', array( 'status' => 404 ) );
		}

		return $setting;

	}

}
