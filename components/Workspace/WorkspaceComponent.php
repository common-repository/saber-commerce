<?php

namespace SaberCommerce\Component\Workspace;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Account\AccountUserModel;
use \SaberCommerce\Component\Portal\PortalSectionModel;

class WorkspaceComponent extends \SaberCommerce\Component {

	public function init() {

		$this->addShortcodes();

		add_action('wp_enqueue_scripts', [$this, 'addScripts']);

		add_action('wp_ajax_sacom_login_form_process', [$this, 'loginFormProcess']);

		$api = new WorkspaceApi();
		$api->init();

		add_filter( 'sacom_portal_section_register', function( $sections, $user ) {

			$section = new PortalSectionModel();
			$section->key = 'workspace';
			$section->title = "Workspaces";
			$section->position = 5.0;

			$section->routes = array(
				array(
					'route'    => '/workspace/',
					'callback' => 'MODEL_COLLECTION',
				),
				array(
					'route'    => '/workspace/[id]/',
					'callback' => 'MODEL_SINGLE',
				)
			);

			// Set model definition.
			$m = new WorkspaceModel;
			$section->data = [
				'modelDefinition' => $m->definition(),
			];

			// Add models if account set.
			$section->data['models'] = [];

			if( $user->ID > 0 ) {

				$aum = new AccountUserModel;
				$currentAccountUser = $aum->fetchOne( $user->ID );
				$models = $m->fetch( $currentAccountUser->accountId );
				$section->data['models'] = $models;

			}

			$sections[] = $section;
			return $sections;

		}, 10, 2 );

	}

	public function showInMenu() {

		return true;

	}

	public function menuOrder() {

		return 70;

	}

	public function wpMenuLabel() {

		return __( 'Workspaces', 'saber-commerce' );

	}

	public function wpAdminSlug() {

		return 'sacom-workspaces';

	}

	public function adminCallback() {

		print '<sacom-workspace-editor />';

	}

	public function addShortcodes() {

		add_shortcode('saber_commerce_account_register', function() {

			$template = new Template();
			$template->path = 'components/Account/templates/';
			$template->name = 'register_form';
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

		/* Install Workspace Table */
		$tableName = $ae->dbPrefix . 'workspace';
		$sql = "CREATE TABLE $tableName (
			id_workspace mediumint(9) NOT NULL AUTO_INCREMENT,
			id_account mediumint(9) NOT NULL,
			title tinytext NOT NULL,
			PRIMARY KEY (id_workspace)
		) $charsetCollate;";
		dbDelta( $sql );

	}

}
