<?php

namespace SaberCommerce\Component\Workspace;

class WorkspaceEditor {

	public function init() {

		add_action( 'wp_ajax_sacom_workspace_loader', function() {

			$response = new \stdClass();

			$obj = new WorkspaceModel();
			$response->objects = $obj->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_workspace_save', function() {

			$response = new \stdClass();

			$post  = sanitize_post( $_POST );
			$model = $post['model'];

			$obj = new WorkspaceModel();

			if( isset( $model['workspaceId'] )) {
				$obj->workspaceId = $model['workspaceId'];
			} else {
				$obj->workspaceId = 0;
			}

			$obj->title        = $model['title'];
			$obj->accountId    = $model['accountId'];
			$response->save    = $obj->save();

			if( $response->save === 0 ) {
				$response->code = 300;
			} else {
				$response->code = 200;
			}

			/* Fetch updated model */
			$model = new WorkspaceModel();
			$response->model = $model->fetchOne( $obj->workspaceId );

			wp_send_json_success( $response );

		});

	}

	public function enqueueEditorScript() {

		/* Timesheet Editor styles */
		wp_enqueue_style(
			'sacom-workspace-editor-styles',
			SABER_COMMERCE_URL . '/components/Workspace/css/workspace-editor.css',
			[],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			'all'
		);

		wp_enqueue_script(
			'sacom-workspace-editor',
			SABER_COMMERCE_URL . 'components/Workspace/js/WorkspaceEditor.js',
			[ 'sacom-editor-base', 'sacom-admin-script', 'wp-util', 'jquery-ui-tooltip', 'jquery-ui-dialog', 'jquery-ui-datepicker', 'sacom-dayjs' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			1
		);

		$localizedData = [
			'saberCommerceUrl' => SABER_COMMERCE_URL,
			'wpUsers'          => get_users(),
			'strings'          => $this->strings()
		];

		wp_localize_script(
			'sacom-workspace-editor',
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
