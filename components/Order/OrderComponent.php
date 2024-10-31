<?php

namespace SaberCommerce\Component\Order;

use SaberCommerce\Template;

class OrderComponent extends \SaberCommerce\Component {

	public function init() {

		$api = new OrderApi();
		$api->init();

		add_filter( 'sacom_dashboard_widget_register', function( $widgets ) {

			$widgets[] = new OrderSummaryDashboardWidget();
			return $widgets;

		});

	}

	public function showInMenu() {

		return true;

	}

	public function menuOrder() {

		return 10;

	}

	public function wpMenuLabel() {

		return __( 'Orders', 'saber-commerce' );

	}

	public function wpAdminSlug() {

		return 'sacom-orders';

	}

	public function adminCallback() {

		print '<sacom-order-editor />';

	}

	public function addDatabaseTables( $ae ) {

		global $wpdb;
		$charsetCollate = $wpdb->get_charset_collate();
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		/* Install order main table. */
		$tableName = $ae->dbPrefix . 'order';
		$sql = "CREATE TABLE $tableName (
			id_order mediumint(9) NOT NULL AUTO_INCREMENT,
			id_account mediumint(9) NOT NULL,
			id_user mediumint(9) NOT NULL,
			id_cart mediumint(9) NOT NULL,
			id_payment mediumint(9) NOT NULL,
			status varchar( 255 ) DEFAULT 'new' NOT NULL,
			created datetime DEFAULT now() NOT NULL,
			updated datetime NOT NULL DEFAULT NOW() ON UPDATE NOW(),
			PRIMARY KEY ( id_order )
		) $charsetCollate;";
		dbDelta( $sql );

	}

	public function activation( $ae ) {

		$this->addDatabaseTables( $ae );

	}

}
