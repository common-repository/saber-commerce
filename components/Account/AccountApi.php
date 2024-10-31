<?php

namespace SaberCommerce\Component\Account;

class AccountApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/account',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getAccountCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/account/login',
			[
				'methods' => 'POST',
				'callback' => [ $this, 'accountLogin' ],
			]
		);

		register_rest_route( 'sacom/v1', '/account/logout',
			[
				'methods' => 'POST',
				'callback' => [ $this, 'accountLogout' ],
			]
		);

		register_rest_route( 'sacom/v1', '/account/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getAccount' ],
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

	public function getAccountCollection() {

		$m = new AccountModel();
		$accounts = $m->fetchAll();
		$response = [
			'accounts' => $accounts
		];
		return $response;

	}

	function accountLogin( $request ) {

		$response = new \stdClass;

		$params = $request->get_params();
		$response->params = $params['values'];
		$username = $response->params['username'];
		$password = $response->params['password'];

		if ( is_user_logged_in() ) {

			wp_logout();

		}

		$response->user = wp_signon(
			array(
				'user_login'    => $username,
				'user_password' => $password
			)
		);

		if ( is_a( $response->user, 'WP_User' ) ) {

			wp_set_current_user( $response->user->ID, $response->user->user_login );

			/* Get portal data. */
			$portal = new \SaberCommerce\Component\Portal\PortalComponent;
			$response->portalData = $portal->getPortalData();

			if ( is_user_logged_in() ) {

				$response->success = 1;
				return $response;

			}

		}

		$response->success = 0;
		return $response;

	}

	function accountLogout( $request ) {

		if ( is_user_logged_in() ) {

			wp_logout();

		}

		return 1;

	}

	public function getAccount( $request ) {

		$m = new AccountModel();
		$account = $m->fetchOne( $request['id'] );

		if ( !$account ) {
			return new \WP_Error( 'no_account', 'No account with that account ID.', array( 'status' => 404 ) );
		}

		return $account;

	}

}
