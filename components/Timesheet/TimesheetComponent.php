<?php

namespace SaberCommerce\Component\Timesheet;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Account\AccountUserModel;
use \SaberCommerce\Component\Portal\PortalSectionModel;

class TimesheetComponent extends \SaberCommerce\Component {

	public function init() {

		add_action('wp_enqueue_scripts', [$this, 'addScripts']);

		add_action('wp_ajax_sacom_login_form_process', [$this, 'loginFormProcess']);

		$api = new TimesheetApi();
		$api->init();

		add_filter( 'sacom_dashboard_widget_register', function( $widgets ) {

			$widgets[] = new TimesheetSummaryDashboardWidget();
			return $widgets;

		});

		add_filter( 'sacom_portal_section_register', function( $sections, $user ) {

			$section = new PortalSectionModel();
			$section->key = 'timesheet';
			$section->title = "Timesheets";
			$section->position = 3.0;

			$section->routes = array(
				array(
					'route'    => '/timesheet/',
					'callback' => 'MODEL_COLLECTION',
				),
				array(
					'route'    => '/timesheet/[id]/',
					'callback' => 'MODEL_SINGLE',
				),
			);

			// Fetch model definition.
			$m = new TimesheetModel;
			$models = $m->fetchAll();
			$section->data = [
				'modelDefinition' => $m->definition()
			];

			// Fetch all models if account.
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

		return 40;

	}

	public function wpMenuLabel() {

		return __( 'Timesheets', 'saber-commerce' );

	}

	public function wpAdminSlug() {

		return 'sacom-timesheets';

	}

	public function adminCallback() {

		print '<timesheet-editor />';

	}

	public function addScripts() {

		wp_enqueue_script(
			'sacom-login-form-script',
			SABER_COMMERCE_URL . '/components/Account/js/login-form.js',
			[ 'jquery', 'wp-util' ],
			'1.0.0',
			true
		);

	}

	public function activation( $ae ) {

		global $wpdb;
		$charsetCollate = $wpdb->get_charset_collate();
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		/* Install Timesheet Table */
		$tableName = $ae->dbPrefix . 'timesheet';
		$sql = "CREATE TABLE $tableName (
			id_timesheet mediumint( 9 ) AUTO_INCREMENT,
			id_account mediumint( 9 ) DEFAULT 0,
			id_workspace mediumint( 9 ) DEFAULT 0,
			label tinytext,
			date_start datetime DEFAULT '0000-00-00 00:00:00',
			date_end datetime DEFAULT '0000-00-00 00:00:00',
			billable_rate decimal( 10, 2 ) DEFAULT 0.00,
			PRIMARY KEY (id_timesheet)
		) $charsetCollate;";
		dbDelta( $sql );

		/* Install sacom_timesheet Entry Table */
		$tableName = $ae->dbPrefix . 'timesheet_entry';
		$sql = "CREATE TABLE $tableName (
			id_timesheet_entry mediumint(9) NOT NULL AUTO_INCREMENT,
			id_timesheet mediumint(9) NOT NULL,
			memo tinytext NOT NULL,
			time_start datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
			time_end datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
			duration tinyint(4) NOT NULL,
			PRIMARY KEY (id_timesheet_entry)
		) $charsetCollate;";

		dbDelta( $sql );

		/* Install sacom_timesheet_invoice table. */
		$tableName = $ae->dbPrefix . 'timesheet_invoice';
		$sql = "CREATE TABLE $tableName (
			id_timesheet_invoice mediumint(9) NOT NULL AUTO_INCREMENT,
			id_timesheet mediumint(9) NOT NULL,
			id_invoice mediumint(9) NOT NULL,
			generated_date datetime DEFAULT now() NOT NULL,
			PRIMARY KEY (id_timesheet_invoice)
		) $charsetCollate;";

		dbDelta( $sql );

	}


}
