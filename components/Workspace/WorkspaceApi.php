<?php

namespace SaberCommerce\Component\Workspace;

class WorkspaceApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/workspace',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getWorkspaceCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/workspace/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getWorkspace' ],
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

	public function getWorkspaceCollection() {

		$m = new WorkspaceModel();
		$workspaces = $m->fetchAll();
		$response = [
			'workspaces' => $workspaces
		];
		return $response;

	}

	public function getWorkspace( $request ) {

		$m = new WorkspaceModel();
		$workspace = $m->fetchOne( $request['id'] );

		if ( !$workspace ) {
			return new \WP_Error( 'no_workspace', 'No workspace with that workspace ID.', array( 'status' => 404 ) );
		}

		return $workspace;

	}

}
