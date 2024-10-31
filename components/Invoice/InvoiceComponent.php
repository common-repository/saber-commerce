<?php

namespace SaberCommerce\Component\Invoice;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Account\AccountUserModel;
use \SaberCommerce\Component\Portal\PortalSectionModel;

class InvoiceComponent extends \SaberCommerce\Component {

	public function init() {

		add_action( 'wp_ajax_sacom_login_form_process', [ $this, 'loginFormProcess' ] );

		$api = new InvoiceApi();
		$api->init();

		add_filter( 'sacom_dashboard_widget_register', function( $widgets ) {

			$widgets[] = new InvoiceSummaryDashboardWidget();
			return $widgets;

		});

		add_filter( 'sacom_portal_section_register', function( $sections, $user ) {

			$section = new PortalSectionModel();
			$section->key = 'invoice';
			$section->title = "Invoices";
			$section->position = 2.0;

			$section->routes = array(
				array(
					'route'    => '/invoice/',
					'callback' => 'MODEL_COLLECTION',
				),
				array(
					'route'    => '/invoice/[id]/',
					'callback' => 'MODEL_SINGLE',
				),
			);

			// Fetch all models.
			$m = new InvoiceModel;
			$section->data = [
				'modelDefinition' => $m->definition()
			];

			if( $user->ID > 0 ) {

				$aum = new AccountUserModel;
				$currentAccountUser = $aum->fetchOne( $user->ID );
				$models = $m->fetch( $currentAccountUser->accountId );
				$section->data['models'] = $models;

			} else {

				$section->data['models'] = [];

			}

			$sections[] = $section;
			return $sections;

		}, 10, 2 );

	}

	public function showInMenu() {

		return true;

	}

	public function menuOrder() {

		return 20;

	}

	public function wpMenuLabel() {

		return __( 'Invoices', 'saber-commerce' );

	}

	public function wpAdminSlug() {

		return 'sacom-invoices';

	}

	public function adminCallback() {

		print '<sacom-invoice-editor />';

	}

	public function activation( $ae ) {

		global $wpdb;
		$charsetCollate = $wpdb->get_charset_collate();
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		/* Install Invoice Table */
		$tableName = $ae->dbPrefix . 'invoice';
		$sql = "CREATE TABLE $tableName (
			id_invoice mediumint(9) NOT NULL AUTO_INCREMENT,
			id_account mediumint(9) NOT NULL,
			title tinytext NOT NULL,
			PRIMARY KEY (id_invoice)
		) $charsetCollate;";
		dbDelta( $sql );

		/* Install Invoice Line Table */
		$tableName = $ae->dbPrefix . 'invoice_line';
		$sql = "CREATE TABLE $tableName (
			id_invoice_line mediumint(9) NOT NULL AUTO_INCREMENT,
			id_invoice mediumint(9) NOT NULL,
			memo tinytext NOT NULL,
			rate decimal( 10, 2 ) NOT NULL DEFAULT 1,
			quantity decimal( 10, 2 ) NOT NULL DEFAULT 1,
			amount decimal( 10, 2 ) NOT NULL,
			PRIMARY KEY (id_invoice_line)
		) $charsetCollate;";
		dbDelta( $sql );

		if( !is_dir( $ae->rootDirectoryPath . '/sacom/invoices' )) {
			mkdir( $ae->rootDirectoryPath . '/sacom/invoices', 0755 );
		}

	}


}
