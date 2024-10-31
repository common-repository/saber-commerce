<?php

namespace SaberCommerce\Component\Order;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Account\AccountModel;
use \SaberCommerce\Component\Workspace\WorkspaceModel;

class OrderEditor {

	public function init() {

		/* Selectively include editor script. */
		add_action( 'admin_enqueue_scripts', function( $adminPage ) {

			if( $adminPage === 'saber-commerce_page_sacom-orders' ) {

				$this->enqueueEditorScript();

			}

		});

		add_action( 'wp_ajax_sacom_order_save', function() {

			$response = new \stdClass();

			$post  = sanitize_post( $_POST );
			$model = $post['model'];

			$obj            = new OrderModel();
			$obj->orderId = $model['orderId'];
			$obj->accountId = $model['accountId'];
			$obj->title     = $model['title'];
			$obj->save();

			$m = new OrderModel();
			$obj = $m->fetchOne( $obj->orderId );

			$response->model = $obj;
			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_order_line_save', function() {

			$response = new \stdClass();

			$post  = sanitize_post( $_POST );
			$model = $post['model'];

			/* Handle no parent object */
			if( $model['orderId'] == 0 ) {

				$obj = new OrderModel();
				$obj->title = '';
				$obj->accountId = 0;
				$obj->save();
				$orderId = $obj->orderId;

			} else {

				$orderId = $model['orderId'];

			}

			if( isset( $model['orderLineId'] )) {

				$orderLineId = $model['orderLineId'];

			} else {

				$orderLineId = 0;

			}

			$obj                = new OrderLineModel();
			$obj->orderLineId = $orderLineId;
			$obj->orderId     = $orderId;
			$obj->memo          = $model['memo'];
			$obj->rate          = $model['rate'];
			$obj->quantity      = $model['quantity'];
			$obj->amount        = $model['amount'];
			$obj->save();
			$response->childModel = $obj;

			$m = new OrderModel();
			$response->parentModel = $m->fetchOne( $obj->orderId );

			$response->code = 200;
			wp_send_json_success( $response );

		});


		add_action( 'wp_ajax_sacom_account_load', function() {

			$response = new \stdClass();

			$model  = new AccountModel();
			$response->models = $model->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});


		add_action( 'wp_ajax_sacom_order_loader', function() {

			$response = new \stdClass();

			$model  = new OrderModel();
			$response->objects = $model->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_order_delete', function() {

			$response = new \stdClass();

			$orderId = sanitize_text_field( $_POST[ 'orderId' ] );

			$model  = new OrderModel();
			$order = $model->fetchOne( $orderId );
			$response->result = $order->delete();
			$response->order = $order;

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_order_line_delete', function() {

			$response = new \stdClass();

			$orderLineId = sanitize_text_field( $_POST['orderLineId'] );

			$model = new OrderLineModel();
			$obj   = $model->fetchOne( $orderLineId );
			$orderId = $obj->orderId;
			$response->result = $obj->delete();
			$model = new OrderModel();
			$response->parentModel = $model->fetchOne( $orderId );

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_order_account_option_loader', function() {

			$response = new \stdClass();

			$obj = new AccountModel();
			$response->accounts = $obj->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_order_pdf', function() {

			$response = new \stdClass();

			// Parse orderId.
			$post = sanitize_post( $_POST );
			$orderData = $post['order'];
			$orderId = $orderData['orderId'];

			$orderPdf = new OrderPdf();
			$response->pdfUrl = $orderPdf->generate( $orderId );

			$response->code = 200;
			wp_send_json_success( $response );

		});


		/*
		 *
		 * Order Send
		 * wp_ajax: sacom_order_send
		 *
		 */
		add_action( 'wp_ajax_sacom_order_send', function() {

			$response = new \stdClass();
			$post = sanitize_post( $_POST );
			$orderId = $post['orderId'];

			$orderSend = new OrderSend();
			$response->result = $orderSend->send( $orderId );

			$response->code = 200;
			wp_send_json_success( $response );

		});

	}

	public function enqueueEditorScript() {

		/* Order Editor styles */
		wp_enqueue_style(
			'sacom-order-editor-styles',
			SABER_COMMERCE_URL . '/components/Order/css/order-editor.css',
			[],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			'all'
		);

		wp_enqueue_script(
			'sacom-order-editor',
			SABER_COMMERCE_URL . 'components/Order/js/OrderEditor.js',
			[ 'sacom-editor', 'sacom-editor-base', 'sacom-admin-script', 'sacom-cleave', 'wp-util', 'jquery-ui-tooltip', 'jquery-ui-dialog', 'jquery-ui-datepicker', 'sacom-dayjs' ],
			\SaberCommerce\Plugin::getEnqueueVersion()
		);

		$localizedData = [
			'adminUrl'         => admin_url(),
			'saberCommerceUrl' => SABER_COMMERCE_URL,
			'fields'           => $this->fields(),
			'strings'          => $this->strings()
		];

		wp_localize_script(
			'sacom-order-editor',
			'editorData',
			$localizedData
		);

	}

	public function fields() {

		$fields = [];

		// Title field.
		$m        = new OrderField();
		$m->id    = 'title';
		$m->label = 'Title';
		$m->placeholder = 'Enter the product title.';
		$fields[] = $m;

		// Price field.
		$m        = new OrderField();
		$m->id    = 'price';
		$m->label = 'Price';
		$m->placeholder = '0.00';
		$fields[] = $m;

		// SKU field.
		$m        = new OrderField();
		$m->id    = 'sku';
		$m->label = 'SKU';
		$m->placeholder = 'Enter a unique product identifier (SKU).';
		$fields[] = $m;

		// Main image field.
		$m        = new OrderField();
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
			'orders_uppercase'    => __( 'ORDERS', 'saber-commerce' ),
		];

	}

}
