<?php

namespace SaberCommerce\Component\Tax;

use \SaberCommerce\Component\Setting\SettingField;
use \SaberCommerce\Component\Setting\SettingModel;

class TaxComponent extends \SaberCommerce\Component {

	public function init() {

		$this->enqueueFrontScripts();
		$this->enqueueAdminScripts();

		$api = new TaxApi();
		$api->init();

		/* Settings. */
		add_filter( 'sacom_setting_page_register', function( $pages ) {

			$page = new \stdClass;
			$page->key       = 'tax';
			$page->title     = __( 'Taxes', 'saber-commerce' );
			$page->menuLabel = __( 'Taxes', 'saber-commerce' );

			// Setting Field tax_enabled.
			$field          = new SettingField();
			$field->type    = 'toggle';
			$field->id      = 'tax_enabled';
			$field->label   = __( 'Tax Enabled', 'saber-commerce' );
			$field->default = 0;
			$field->value = SettingModel::load( 'tax_enabled' );
			$field->choices = [
				[
					'value' => 1,
					'label' => __( 'ENABLED', 'saber-commerce' )
				],
				[
					'value' => 0,
					'label' => __( 'DISABLED', 'saber-commerce' )
				]
			];
			$page->fields[] = $field;

			$field          = new SettingField();
			$field->type    = 'html';
			$field->id      = 'tax_enabled';
			$field->value   = '<div id="sacom-tax-editor"></div>';
			$page->fields[] = $field;

			// Apply a filter to fields
			// @TODO move this page setup and field filtering to payment component because it's for all payment methods...
			$page = apply_filters( 'sacom_payment_settings_page_fields', $page );

			$pages[] = $page;
			return $pages;

		});


	}

	function enqueueFrontScripts() {}

	function enqueueAdminScripts() {

		add_action( 'admin_enqueue_scripts', function() {

			wp_enqueue_script(
				'sacom-tax-script',
				SABER_COMMERCE_URL . 'components/Tax/js/Tax.js',
				['jquery'],
				\SaberCommerce\Plugin::getEnqueueVersion(),
				true
			);

			wp_enqueue_script(
				'sacom-tax-editor-script',
				SABER_COMMERCE_URL . 'components/Tax/react/build/index.js',
				array( 'react', 'react-dom', 'wp-api-fetch', 'wp-element', 'wp-polyfill' ),
				\SaberCommerce\Plugin::getEnqueueVersion(),
				true
			);

			$localizedData = [
				'adminUrl'         => admin_url(),
				'saberCommerceUrl' => SABER_COMMERCE_URL,
				'siteUrl'          => site_url()
			];

			wp_localize_script(
				'sacom-catalog-script',
				'SACOM_CatalogData',
				$localizedData
			);

		});

	}

	public function addDatabaseTables( $ae ) {

		global $wpdb;
		$charsetCollate = $wpdb->get_charset_collate();
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		/* Install tax class table. */
		$tableName = $ae->dbPrefix . 'tax_class';
		$sql = "CREATE TABLE $tableName (
			id_tax_class mediumint( 9 ) NOT NULL AUTO_INCREMENT,
			reference_key varchar( 128 ) NOT NULL,
			title varchar( 255 ) NOT NULL,
			description mediumtext NULL,
			PRIMARY KEY ( id_tax_class )
		) $charsetCollate;";
		dbDelta( $sql );

		/* Install tax rate table. */
		$tableName = $ae->dbPrefix . 'tax_rate';
		$sql = "CREATE TABLE $tableName (
			id_tax_rate mediumint( 9 ) NOT NULL AUTO_INCREMENT,
			id_tax_class varchar( 128 ) NOT NULL,
			title varchar( 128 ) NOT NULL,
			country varchar( 128 ) NULL,
			state varchar( 255 ) NULL,
			city varchar( 255 ) NULL,
			zipcode varchar( 64 ) NULL,
			rate decimal( 10, 2 ) DEFAULT 0.00 NOT NULL,
			compound tinyint( 1 ) NOT NULL,
			shipping tinyint( 1 ) NOT NULL,
			priority mediumint( 9 ),
			priority_order mediumint( 9 ),
			PRIMARY KEY ( id_tax_rate )
		) $charsetCollate;";
		dbDelta( $sql );

	}

	public function activation( $ae ) {

		$this->addDatabaseTables( $ae );

	}

}
