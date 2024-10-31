<?php

namespace SaberCommerce\Component\Account;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Portal\PortalSectionModel;

class AccountComponent extends \SaberCommerce\Component {

	public function init() {

		$this->addShortcodes();

		add_action('wp_enqueue_scripts', [$this, 'addScripts']);

		add_action('wp_ajax_sacom_login_form_process', [$this, 'loginFormProcess']);

		$api = new AccountApi();
		$api->init();

		add_filter( 'sacom_dashboard_widget_register', function( $widgets ) {

			$widgets[] = new AccountSummaryDashboardWidget();
			return $widgets;

		});

		add_filter( 'sacom_portal_section_register', function( $sections, $user ) {

			$section = new PortalSectionModel();
			$section->key = 'user';
			$section->title = "Users";
			$section->position = 6.0;

			// Add model definition.
			$m = new AccountUserModel;
			$section->data = [
				'modelDefinition' => $m->definition()
			];

			if( $user->ID > 0 ) {

				$currentAccountUser = $m->fetchOne( $user->ID );
				$models = $m->fetch( $currentAccountUser->accountId );
				$section->data['models'] = $models;

			} else {

				$section->data['models'] = [];

			}

			$section->routes = array(
				array(
					'route'    => '/login/',
					'callback' => 'renderLogin'
				),
				array(
					'route'    => '/user/',
					'callback' => 'MODEL_COLLECTION',
				),
				array(
					'route'    => '/user/[id]/',
					'callback' => 'MODEL_SINGLE',
				),
				array(
					'route'    => '/profile/',
					'callback' => 'renderProfile',
				),
			);

			$sections[] = $section;
			return $sections;

		}, 10, 2 );

	}

	public function showInMenu() {

		return true;

	}

	public function menuOrder() {

		return 60;

	}

	public function wpMenuLabel() {

		return __( 'Accounts', 'saber-commerce' );

	}

	public function wpAdminSlug() {

		return 'sacom-accounts';

	}

	public function adminCallback() {

		print '<sacom-accounts />';

	}

	public function loginFormProcess() {

		// send response
		$response = new \stdClass();
		$response->code = 200;
		wp_send_json_success( $response );

	}

	public function addShortcodes() {

		add_shortcode('saber_commerce_account_register', function() {

			$template = new Template();
			$template->path = 'components/Account/templates/';
			$template->name = 'register_form';
			return $template->get();

		});

		add_shortcode('saber_commerce_account_login', function() {

			$template = new Template();
			$template->path = 'components/Account/templates/';
			$template->name = 'login_form';
			return $template->get();

		});


	}

	public function addScripts() {

		wp_enqueue_script(
			'sacom-login-form-script',
			SABER_COMMERCE_URL . '/components/Account/js/login-form.js',
			['jquery', 'wp-util'],
			'1.0.0',
			true
		);

	}

	public function activation( $ae ) {

		global $wpdb;
		$charsetCollate = $wpdb->get_charset_collate();
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		/* Install account table */
		$tableName = $ae->dbPrefix . 'account';
		$sql = "CREATE TABLE $tableName (
			id_account mediumint(9) NOT NULL AUTO_INCREMENT,
			wp_user_id mediumint(9) NOT NULL,
			title tinytext NOT NULL,
			PRIMARY KEY (id_account)
		) $charsetCollate;";
		dbDelta( $sql );

		/* Install account user table */
		$tableName = $ae->dbPrefix . 'account_user';
		$sql = "CREATE TABLE $tableName (
			id_account_user mediumint(9) NOT NULL AUTO_INCREMENT,
			id_account mediumint(9) NOT NULL,
			wp_user_id mediumint(9) NOT NULL,
			PRIMARY KEY (id_account_user)
		) $charsetCollate;";
		dbDelta( $sql );

		return true;

	}



}
