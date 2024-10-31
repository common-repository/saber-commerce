<?php

namespace SaberCommerce\Component\Account;

class AccountEditor {

	public function init() {

		add_action( 'wp_ajax_sacom_account_loader', function() {

			$response = new \stdClass();

			$obj = new AccountModel();
			$response->objects = $obj->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_account_save', function() {

			$response = new \stdClass();

			$post  = sanitize_post( $_POST );
			$model = sanitize_post( $post['model'] );

			$obj = new AccountModel();

			if( isset( $model['accountId'] )) {
				$obj->accountId = $model['accountId'];
			} else {
				$obj->accountId = 0;
			}

			$obj->title        = $model['title'];
			$obj->wpUserId     = $model['wpUserId'];
			$response->save    = $obj->save();

			if( $response->save === 0 ) {
				$response->code = 300;
			} else {
				$response->code = 200;
			}

			/* Fetch updated model */
			$model = new AccountModel();
			$response->model = $model->fetchOne( $obj->accountId );

			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_account_user_save', function() {

			$response = new \stdClass();

			$post = sanitize_post( $_POST );
			$model = $post['model'];

			$obj = new AccountUserModel();

			if( isset( $model['accountUserId'] )) {
				$obj->accountUserId = $model['accountUserId'];
			} else {
				$obj->accountUserId = 0;
			}

			$obj->accountId = $model['accountId'];
			$obj->wpUserId  = $model['wpUserId'];
			$response->save = $obj->save();

			if( $response->save === 0 ) {
				$response->code = 300;
			} else {
				$response->code = 200;
			}

			/* Fetch updated model */
			$model = new AccountUserModel();
			$response->childModel = $model->fetchOne( $obj->accountUserId );

			$model = new AccountModel();
			$response->parentModel = $model->fetchOne( $obj->accountId );

			wp_send_json_success( $response );

		});


		add_action( 'wp_ajax_sacom_account_user_delete', function() {

			$response = new \stdClass();

			$accountUserId = sanitize_text_field( $_POST['accountUserId'] );

			$model = new AccountUserModel();
			$obj   = $model->fetchOne( $accountUserId );
			$accountId = $obj->accountId;
			$response->result = $obj->delete();
			$response->accountUserId = $accountUserId;
			$model = new AccountModel();
			$response->parentModel = $model->fetchOne( $accountId );

			$response->code = 200;
			wp_send_json_success( $response );

		});


	}

	public function enqueueEditorScript() {

		/* Timesheet Editor styles */
		wp_enqueue_style(
			'sacom-account-editor-styles',
			SABER_COMMERCE_URL . '/components/Account/css/account-editor.css',
			[],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			'all'
		);

		wp_enqueue_script(
			'sacom-account-editor',
			SABER_COMMERCE_URL . 'components/Account/js/AccountEditor.js',
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
			'sacom-account-editor',
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
