<?php

namespace SaberCommerce\Component\Product;

use SaberCommerce\Template;

class ProductComponent extends \SaberCommerce\Component {

	public function init() {

		$this->shortcodes();
		$this->enqueueFrontScripts();

		$api = new ProductApi();
		$api->init();

		add_filter( 'sacom_dashboard_widget_register', function( $widgets ) {

			$widgets[] = new ProductSummaryDashboardWidget();
			return $widgets;

		});

		add_action( 'init', function() {

			$cpt = new ProductPostType();
			$cpt->register();

			/* Register product category. */
			register_taxonomy( 'sacom_product_category', 'sacom_product', array(
				'labels' => array(
					'name' => 'Product Categories',
					'singular_name' => 'Product Category'
				),
				'public' => 1,
				'show_in_rest' => 1,
				'hierarchical' => 1
			));

		});

		add_filter( 'single_template', function( $template ) {

			// Test for FSE.
			return $template;

			global $post;

			if( $post->post_type !== 'sacom_product' ) {

				return $template;

			}

			// Load product and globalize for template.
			$productId = get_post_meta( $post->ID, 'sacom_data_id', 1 );
			$m = new ProductModel();
			$product = $m->fetchOne( $productId );
			$GLOBALS['product'] = $product;

			// Support template overrides.
			$templateOverridePath = locate_template( 'sacom/product/single.php' );

			if( $templateOverridePath ) {

				$templateOverridePathSecure = ( 0 === strpos( realpath( $templateOverridePath ), realpath( STYLESHEETPATH ) ) || 0 === strpos( realpath( $templateOverridePath ), realpath( TEMPLATEPATH ) ) || 0 === strpos( realpath( $templateOverridePath ), realpath( ABSPATH . WPINC . '/theme-compat/' ) ));

				if( $templateOverridePathSecure ) {

					return $templateOverridePath;

				}

			}

			$defaultTemplatePath = SABER_COMMERCE_PATH . '/components/Product/templates/single.php';
			return $defaultTemplatePath;

		});

		/* Save product post filter. */
		add_action( 'save_post_sacom_product', function( $postId, $post ) {

			$blocks = parse_blocks( $post->post_content );
			$m = new ProductModel();
			$p = $m->fetchByPostId( $postId );
			if( !$p ) {

				$m->wpPostId = $postId;
				$m->title = $post->post_title;
				$m->save();

				$p = $m;

			}

			foreach( $blocks as $block ) {

				if( $block['blockName'] === 'saber-commerce/product-data' ) {

					$sku = $block['attrs']['sku'];
					$p->sku = $sku;

					$description = $block['attrs']['description'];
					$p->description = $description;

					$price = $block['attrs']['price'];
					$p->price = $price;

				}

			}

			// Save product data model.
			$p->title = $post->post_title;
			$p->save();

		}, 10, 2 );

	}

	function enqueueFrontScripts() {

		add_action( 'wp_enqueue_scripts', function() {

			wp_enqueue_script(
				'sacom-catalog-script',
				SABER_COMMERCE_URL . 'components/Product/js/Catalog.js',
				['jquery'],
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

	public function shortcodes() {

		add_shortcode( 'sacom_shop', function() {

			$m = new ProductModel();
			$products = $m->fetchAll();
			return $this->getShopMarkup( $products );

		});

	}

	public function getShopMarkup( $products ) {

		$template = new Template();
		$template->path = 'components/Product/templates/';
		$template->name = 'shop';
		$template->data = [
			'products' => $products
		];

		return $template->get();

	}

	public function showInMenu() {

		return true;

	}

	public function menuOrder() {

		return 55;

	}

	public function wpMenuLabel() {

		return __( 'Products', 'saber-commerce' );

	}

	public function wpAdminSlug() {

		return 'sacom-products';

	}

	public function adminCallback() {

		print '<sacom-product-editor />';

	}

	public function addDatabaseTables( $ae ) {

		global $wpdb;
		$charsetCollate = $wpdb->get_charset_collate();
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

		/* Install product table. */
		$tableName = $ae->dbPrefix . 'product';
		$sql = "CREATE TABLE $tableName (
			id_product mediumint( 9 ) NOT NULL AUTO_INCREMENT,
			wp_post_id mediumint( 9 ) NOT NULL,
			title varchar( 255 ),
			description text,
			price decimal( 10, 2 ) DEFAULT '0.00' NOT NULL,
			sku varchar( 255 ),
			main_image varchar( 128 ),
			created datetime DEFAULT now() NOT NULL,
			PRIMARY KEY ( id_product )
		) $charsetCollate;";
		dbDelta( $sql );

	}

	public function addShopPage() {

		// Add shop page at /shop.
		$slug = 'shop';

		$page = [
			'post_type'    => 'page',
			'post_title'   => 'Shop',
			'post_author'  => 1,
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_content' => '[sacom_shop]'
		];

		if( !get_page_by_path( $slug ) ) {

			$pageId = wp_insert_post( $page );

		}

	}

	public function activation( $ae ) {

		$this->addDatabaseTables( $ae );
		$this->addShopPage( $ae );

	}

}
