<?php

namespace SaberCommerce\Component\Product;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Account\AccountModel;

class ProductEditor {

	public function init() {

		/* Selectively include editor script. */
		add_action( 'admin_enqueue_scripts', function( $adminPage ) {

			if( $adminPage === 'saber-commerce_page_sacom-products' ) {

				$this->enqueueEditorScript();

			}

		});

		add_action( 'wp_ajax_sacom_product_save', function() {

			$response = new \stdClass();

			$post  = sanitize_post( $_POST );
			$model = $post['product'];

			$obj            = new ProductModel();
			$obj->productId = $model['productId'];
			$obj->title     = $model['title'];
			$obj->price     = $model['price'];
			$obj->sku       = $model['sku'];
			$obj->mainImage = $model['mainImage'];
			$obj->save();

			$m = new ProductModel();
			$obj = $m->fetchOne( $obj->productId );

			$response->model = $obj;
			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_product_loader', function() {

			$response = new \stdClass();

			$model  = new ProductModel();
			$response->objects = $model->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_product_delete', function() {

			$response = new \stdClass();

			$productId = sanitize_text_field( $_POST[ 'productId' ] );

			$model  = new ProductModel();
			$product = $model->fetchOne( $productId );
			$response->result = $product->delete();
			$response->product = $product;

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_product_line_delete', function() {

			$response = new \stdClass();

			$productLineId = sanitize_text_field( $_POST['productLineId'] );

			$model = new ProductLineModel();
			$obj   = $model->fetchOne( $productLineId );
			$productId = $obj->productId;
			$response->result = $obj->delete();
			$model = new ProductModel();
			$response->parentModel = $model->fetchOne( $productId );

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_product_account_option_loader', function() {

			$response = new \stdClass();

			$obj = new AccountModel();
			$response->accounts = $obj->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_product_pdf', function() {

			$response = new \stdClass();

			// Parse productId.
			$post = sanitize_post( $_POST );
			$productData = $post['product'];
			$productId = $productData['productId'];

			$productPdf = new ProductPdf();
			$response->pdfUrl = $productPdf->generate( $productId );

			$response->code = 200;
			wp_send_json_success( $response );

		});


		/*
		 *
		 * Product Send
		 * wp_ajax: sacom_product_send
		 *
		 */
		add_action( 'wp_ajax_sacom_product_send', function() {

			$response = new \stdClass();
			$post = sanitize_post( $_POST );
			$productId = $post['productId'];

			$productSend = new ProductSend();
			$response->result = $productSend->send( $productId );

			$response->code = 200;
			wp_send_json_success( $response );

		});

	}

	public function enqueueEditorScript() {

		/* Product Editor styles */
		wp_enqueue_style(
			'sacom-product-editor-styles',
			SABER_COMMERCE_URL . 'components/Product/css/product-editor.css',
			[],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			'all'
		);

		wp_enqueue_script(
			'sacom-product-editor',
			SABER_COMMERCE_URL . 'components/Product/js/ProductEditor.js',
			[ 'sacom-editor-base', 'sacom-admin-script', 'sacom-cleave', 'wp-util', 'jquery-ui-tooltip', 'jquery-ui-dialog', 'jquery-ui-datepicker', 'sacom-dayjs' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			1
		);

		wp_enqueue_script(
			'sacom-react-index',
			SABER_COMMERCE_URL . '/build/index.js',
			[ 'wp-api-fetch', 'wp-element', 'wp-polyfill', 'sacom-product-editor' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			true
		);

		$localizedData = [
			'adminUrl'         => admin_url(),
			'saberCommerceUrl' => SABER_COMMERCE_URL,
			'fields'           => $this->fields(),
			'strings'          => $this->strings()
		];

		wp_localize_script(
			'sacom-product-editor',
			'editorData',
			$localizedData
		);

		// Add support WP Media scripts.
		wp_enqueue_media();

	}

	public function fields() {

		$fields = [];

		// Title field.
		$m        = new ProductField();
		$m->id    = 'title';
		$m->label = 'Title';
		$m->placeholder = 'Enter the product title.';
		$fields[] = $m;

		// Price field.
		$m        = new ProductField();
		$m->id    = 'price';
		$m->label = 'Price';
		$m->placeholder = '0.00';
		$fields[] = $m;

		// SKU field.
		$m        = new ProductField();
		$m->id    = 'sku';
		$m->label = 'SKU';
		$m->placeholder = 'Enter a unique product identifier (SKU).';
		$fields[] = $m;

		// Main image field.
		$m        = new ProductField();
		$m->type  = 'image';
		$m->id    = 'main_image';
		$m->label = 'Main Image';
		$m->placeholder = 'Select or upload a main image.';
		$fields[] = $m;

		$fields = apply_filters( 'sacom_product_fields', $fields );
		return $fields;

	}

	function strings() {

		return [
			'add_new'             => __( 'Add New', 'saber-commerce' ),
			'view_all'            => __( 'View All', 'saber-commerce' ),
			'dashboard_uppercase' => __( 'DASHBOARD', 'saber-commerce' ),
		];

	}

}
