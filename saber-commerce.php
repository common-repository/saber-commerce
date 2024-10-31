<?php

/**
 *
 * Plugin Name: Saber Commerce
 * Plugin URI: https://wordpress.org/plugins/saber-commerce/
 * Description: Better eCommerce software for WordPress.
 * Version: 1.4.2
 * Author: SaberWP
 * Author URI: https://saberwp.com/
 * Text Domain: saber-commerce
 * License: GPL3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 *
 */

namespace SaberCommerce;

use \SaberCommerce\Component\Setting\SettingField;
use \SaberCommerce\Component\Setting\SettingModel;

define( 'SABER_COMMERCE_PLUGIN_NAME', 'Saber Commerce' );
define( 'SABER_COMMERCE_VERSION', '1.4.2' );
define( 'SABER_COMMERCE_PATH', plugin_dir_path(__FILE__) );
define( 'SABER_COMMERCE_URL', plugin_dir_url(__FILE__) );
define( 'SABER_COMMERCE_DEV_MODE', 0 );
define( 'SABER_COMMERCE_TEXT_DOMAIN', 'saber-commerce' );

class Plugin {

	public function __construct() {

		// Load textdomain to enable translation files.
		add_action( 'init', function() {

			/* Testing... */
			add_filter( 'wp_is_application_passwords_available', '__return_true' );

			load_plugin_textdomain( 'saber-commerce', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );

		});

		require SABER_COMMERCE_PATH . '/vendor/autoload.php';
		require SABER_COMMERCE_PATH . '/inc/BlockUtils.php';

		$this->registerAutoloader();

		$components = $this->componentDetection();
		foreach( $components as $component ) {

			$this->componentLoad( $component );

		}

		add_action( 'admin_enqueue_scripts', [ $this, 'adminScripts'] );

		$this->registerGeneralSettings();

		/* Provide multisite support. */
		add_action( 'wp_initialize_site', array( $this, 'multisiteInstallRoutine'), 99 );

		/* Load the Gutenberg blocks. */
		$this->loadBlocks();

	}

	public function adminScripts() {

		wp_enqueue_script(
			'sacom-cleave',
			SABER_COMMERCE_URL . 'js/cleave.js',
			['jquery'],
			'1.6.0',
			true
		);

		wp_enqueue_script(
			'sacom-dayjs',
			SABER_COMMERCE_URL . 'js/dayjs.min.js',
			[ 'jquery' ],
			'1.8.21',
			true
		);

		wp_enqueue_script(
			'sacom-select2',
			SABER_COMMERCE_URL . 'js/select2.min.js',
			[],
			'4.1.0',
			1
		);

		wp_enqueue_style(
			'sacom-select2',
			SABER_COMMERCE_URL . 'css/select2.min.css',
			[],
			'4.1.0',
			'all'
		);

		/* jQuery UI theme - black tie */
		wp_enqueue_style(
			'jquery-ui-theme-black-tie',
			SABER_COMMERCE_URL . 'css/jquery-ui-theme-black-tie.css',
			[],
			'1.12.1',
			'all'
		);

		wp_enqueue_script(
			'sacom-admin-script',
			SABER_COMMERCE_URL . 'js/admin.js',
			[ 'jquery-ui-datepicker' ],
			'8.8.8',
			1
		);

		wp_enqueue_script(
			'sacom-editor-base',
			SABER_COMMERCE_URL . 'js/EditorBase.js',
			[ 'jquery' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			1
		);

		wp_enqueue_script(
			'sacom-editor',
			SABER_COMMERCE_URL . 'js/Editor.js',
			[],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			1
		);

		wp_enqueue_script(
			'sacom-react-index',
			SABER_COMMERCE_URL . '/build/index.js',
			[ 'wp-api-fetch', 'wp-element', 'wp-polyfill', 'sacom-admin-dashboard-script' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			true
		);

		add_filter( 'script_loader_tag', function( $tag, $handle, $src ) {

			if ( 'sacom-editor' !== $handle && 'sacom-order-editor' !== $handle ) {
				return $tag;
			}

			// change the script tag by adding type="module" and return it.
			$tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
			return $tag;

		}, 10, 3 );

		wp_enqueue_style(
			'sacom-admin-styles',
			SABER_COMMERCE_URL . 'css/admin.css',
			[],
			'8.8.8',
			'all'
		);

		/* Include React */
		//wp_enqueue_script( 'react' );
		//wp_enqueue_script( 'react-dom' );

	}

	public function registerAutoloader() {

		spl_autoload_register( [$this, 'autoload'] );

	}

	public function autoload( $className ) {

		// Avoid loading our extensions.
		// Extensions share the root \SaberCommerce\ namespace, but they are responsible for their own loading.
		if( substr( $className, 0, 17 ) == 'SaberCommerce\Ext' ) {

			return false;

		}

		// Load from /component
		if( substr( $className, 0, 24 ) == 'SaberCommerce\Component\\' ) {

			$classFileName = str_replace( 'SaberCommerce\Component\\', '', $className );
			$classFileName = str_replace( '\\', '/', $classFileName );
			require( SABER_COMMERCE_PATH . 'components/' . $classFileName . '.php' );
			return;

		}

		// Load from /inc
		if( substr( $className, 0, 13 ) == 'SaberCommerce' ) {

			$classFileName = str_replace( 'SaberCommerce\\', '', $className );
			$classFileName = str_replace( '\\', '/', $classFileName );
			require( SABER_COMMERCE_PATH . 'inc/' . $classFileName . '.php' );
			return;

		}


	}

	/*
	 * Function getEnqueueVersion()
	 *
	 * Enables using Plugin::getEnqueueVersion() to produce unique version numbers for enqueuing when in dev mode.
	 * This avoids browsers caching our JS/CSS during dev work.
	 *
	 */
	public static function getEnqueueVersion() {

		if( SABER_COMMERCE_DEV_MODE === true ) {
			return time();
		}

		return SABER_COMMERCE_VERSION;

	}

	public static function componentDetection() {

		$objects = scandir( SABER_COMMERCE_PATH . 'components' );
		$components = [];

		foreach( $objects as $object ) {

			if( $object == '.' || $object === '..' ) {
				continue;
			}

			$componentDefinition = [
				'type'  => 'core',
				'name'  => $object,
				'class' => '\SaberCommerce\Component\\' . $object . '\\' . $object . 'Component',
			];

			$components[] = $componentDefinition;

		}

		$components = apply_filters( 'sacom_component_list', $components );

		return $components;

	}

	public function componentValidate() {
		return true;
	}

	public function componentLoad( $componentDefinition ) {

		$c = new $componentDefinition['class']();
		$c->init();

	}

	function registerGeneralSettings() {

		add_filter( 'sacom_setting_page_register', function( $pages ) {

			$page            = new \stdClass;
			$page->key       = 'general';
			$page->title     = __( 'General Settings', 'saber-commerce' );
			$page->menuLabel = __( 'General Settings', 'saber-commerce' );

			// Setting Field stripe_test_publishable_key.
			$field        = new SettingField();
			$field->type  = 'text';
			$field->id    = 'company_name';
			$field->label = __( 'Company Name', 'saber-commerce' );
			$field->value = SettingModel::load( 'company_name' );
			$page->fields[] = $field;

			// Setting Field address_line_1.
			$field        = new SettingField();
			$field->type  = 'text';
			$field->id    = 'address_line_1';
			$field->label = __( 'Address Line 1', 'saber-commerce' );
			$field->value = SettingModel::load( 'address_line_1' );
			$page->fields[] = $field;

			// Setting Field address_line_2.
			$field        = new SettingField();
			$field->type  = 'text';
			$field->id    = 'address_line_2';
			$field->label = __( 'Address Line 2', 'saber-commerce' );
			$field->value = SettingModel::load( 'address_line_2' );
			$page->fields[] = $field;

			// Setting Field city.
			$field        = new SettingField();
			$field->type  = 'text';
			$field->id    = 'address_city';
			$field->label = __( 'City', 'saber-commerce' );
			$field->value = SettingModel::load( 'address_city' );
			$page->fields[] = $field;

			// Setting Field address_state_province.
			$field        = new SettingField();
			$field->type  = 'text';
			$field->id    = 'address_state_province';
			$field->label = __( 'State/Province', 'saber-commerce' );
			$field->value = SettingModel::load( 'address_state_province' );
			$page->fields[] = $field;

			// Setting Field country.
			$field        = new SettingField();
			$field->type  = 'text';
			$field->id    = 'address_country';
			$field->label = __( 'Country', 'saber-commerce' );
			$field->value = SettingModel::load( 'address_country' );
			$page->fields[] = $field;

			// Setting Field country.
			$field        = new SettingField();
			$field->type  = 'text';
			$field->id    = 'address_zip_postal';
			$field->label = __( 'Zip/Postal Code', 'saber-commerce' );
			$field->value = SettingModel::load( 'address_zip_postal' );
			$page->fields[] = $field;

			// Currency display code.
			$field          = new SettingField();
			$field->type    = 'text';
			$field->id      = 'currency_display_text';
			$field->label   = __( 'Currency Display Text', 'saber-commerce' );
			$field->default = 'USD';
			$field->value   = SettingModel::load( 'currency_display_text' );
			$page->fields[] = $field;

			$pages[] = $page;

			return $pages;

		});

	}

	public static function componentActivation( $componentDefinition, $activationEnvironment ) {

		$c = new $componentDefinition['class']();
		$c->activation( $activationEnvironment );

	}

	/* $ae ActivationEnvironment Object. */
	public static function rootFileDirectoryExistsMake( $ae ) {

		if( !is_dir( $ae->rootDirectoryPath )) {

			mkdir( $ae->rootDirectoryPath, 0755 );

		}

		if( !is_dir( $ae->rootDirectoryPath . '/sacom' )) {

			mkdir( $ae->rootDirectoryPath . '/sacom', 0755 );

		}

		return 1;

	}

	public static function activation() {

		// Make ActivationEnvironment object.
		global $wpdb;
		$activationEnvironment = new ActivationEnvironment();
		$activationEnvironment->setRootDirectoryPath( WP_CONTENT_DIR . '/uploads' );
		$activationEnvironment->setDbTablePrefix( $wpdb->prefix . 'sacom_' );

		// Test for or make SACOM upload root directory.
		$rootFileDirectory = self::rootFileDirectoryExistsMake( $activationEnvironment );

		if( !$rootFileDirectory ) {

			return new \WP_Error( 'activation_fail', __( "During activation the root directory could not be created. Check that your /uploads/ directory is writeable by PHP.", "saber-commerce" ) );

		}

		/* Root directory exists. We can now proceed with component activation routines. */

		$components = self::componentDetection();

		if( empty( $components )) {

			// This is an unlikely event because there are many default components.
			// If $components is empty, it probably means a filter failed to return components properly.
			return new \WP_Error( 'activation_fail', __( "No Saber Commerce components were detected during activation. This is most likely caused by a malfunctioning filter in an extension.", "saber-commerce" ) );

		}

		// Call activation method on each component detected.
		foreach( $components as $component ) {

			$activationResult = self::componentActivation( $component, $activationEnvironment );

			// @TODO Check for component level activation error.

		}

	}

	public static function multisiteActivation( $site ) {

		$blogId = $site->blog_id;

		// Make ActivationEnvironment object.
		global $wpdb;
		$activationEnvironment = new ActivationEnvironment();
		$activationEnvironment->setRootDirectoryPath( WP_CONTENT_DIR . '/uploads/sites/' . $blogId );
		$activationEnvironment->setDbTablePrefix( $wpdb->prefix . $blogId . '_sacom_' );
		$activationEnvironment->multisite = $site;

		// Test for or make SACOM upload root directory.
		$rootFileDirectory = self::rootFileDirectoryExistsMake( $activationEnvironment );

		if( !$rootFileDirectory ) {

			return new \WP_Error( 'activation_fail', __( "During activation the root directory could not be created. Check that your /uploads/ directory is writeable by PHP.", "saber-commerce" ) );

		}

		/* Root directory exists. We can now proceed with component activation routines. */

		$components = self::componentDetection();

		if( empty( $components )) {

			// This is an unlikely event because there are many default components.
			// If $components is empty, it probably means a filter failed to return components properly.
			return new \WP_Error( 'activation_fail', __( "No Saber Commerce components were detected during activation. This is most likely caused by a malfunctioning filter in an extension.", "saber-commerce" ) );

		}

		// Switch to blog context to support page insertion.
		switch_to_blog( $blogId );

		// Call activation method on each component detected.
		foreach( $components as $component ) {

			$activationResult = self::componentActivation( $component, $activationEnvironment );

			// @TODO Check for component level activation error.

		}

		// Switch out of blog context.
		restore_current_blog();

	}

	public static function deactivation() {

	}

	// @TODO see https://shibashake.com/wordpress-theme/write-a-plugin-for-wordpress-multi-site
	public function multisiteInstallRoutine( \WP_Site $site ) {

		self::multisiteActivation( $site );

	}

	function loadBlocks() {

		// Cart Blocks.
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart/cart.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart-actions/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart-header/cart-header.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart-item-row/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart-table/cart-table.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart-table-header/cart-table-header.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart-table-footer/cart-table-footer.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart-table-body/cart-table-body.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart-totals/cart-totals.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/cart/cart-flow/cart-flow.php' );

		/* Product Blocks */
		require_once( SABER_COMMERCE_PATH . '/blocks/product/product-data/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/product/product-title/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/product/product-sku/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/product/product-image/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/product/product-add-to-cart/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/product/product-description/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/product/product-price/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/product/product-single/block.php' );

		/* Catalog blocks. */
		require_once( SABER_COMMERCE_PATH . '/blocks/catalog/catalog/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/catalog/catalog-grid/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/catalog/catalog-grid-item-template/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/catalog/catalog-filters/block.php' );

		/* Checkout blocks. */
		require_once( SABER_COMMERCE_PATH . '/blocks/checkout/checkout/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/checkout/checkout-billing-form/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/checkout/checkout-order-summary/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/checkout/checkout-action-buttons/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/checkout/checkout-payment/block.php' );

		/* Portal blocks. */
		require_once( SABER_COMMERCE_PATH . '/blocks/portal/portal/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/portal/portal-menu/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/portal/portal-body/block.php' );
		require_once( SABER_COMMERCE_PATH . '/blocks/portal/portal-section-dashboard/block.php' );

	}

}

new Plugin();

/*
 * Activation and deactivation hooks
 */
register_activation_hook(__FILE__, '\SaberCommerce\Plugin::activation');
register_deactivation_hook(__FILE__, '\SaberCommerce\Plugin::deactivation');
