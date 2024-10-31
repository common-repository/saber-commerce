<?php

namespace SaberCommerce\Component\Invoice;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Account\AccountModel;
use \SaberCommerce\Component\Workspace\WorkspaceModel;

class InvoiceEditor {

	public function init() {

		add_action( 'wp_ajax_sacom_invoice_save', function() {

			$response = new \stdClass();

			$post  = sanitize_post( $_POST );
			$model = $post['model'];

			$obj            = new InvoiceModel();
			$obj->invoiceId = $model['invoiceId'];
			$obj->accountId = $model['accountId'];
			$obj->title     = $model['title'];
			$obj->save();

			$m = new InvoiceModel();
			$obj = $m->fetchOne( $obj->invoiceId );

			$response->model = $obj;
			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_invoice_line_save', function() {

			$response = new \stdClass();

			$post  = sanitize_post( $_POST );
			$model = $post['model'];

			/* Handle no parent object */
			if( $model['invoiceId'] == 0 ) {

				$obj = new InvoiceModel();
				$obj->title = '';
				$obj->accountId = 0;
				$obj->save();
				$invoiceId = $obj->invoiceId;

			} else {

				$invoiceId = $model['invoiceId'];

			}

			if( isset( $model['invoiceLineId'] )) {

				$invoiceLineId = $model['invoiceLineId'];

			} else {

				$invoiceLineId = 0;

			}

			$obj                = new InvoiceLineModel();
			$obj->invoiceLineId = $invoiceLineId;
			$obj->invoiceId     = $invoiceId;
			$obj->memo          = $model['memo'];
			$obj->rate          = $model['rate'];
			$obj->quantity      = $model['quantity'];
			$obj->amount        = $model['amount'];
			$obj->save();
			$response->childModel = $obj;

			$m = new InvoiceModel();
			$response->parentModel = $m->fetchOne( $obj->invoiceId );

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


		add_action( 'wp_ajax_sacom_invoice_loader', function() {

			$response = new \stdClass();

			$model  = new InvoiceModel();
			$response->objects = $model->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_invoice_delete', function() {

			$response = new \stdClass();

			$invoiceId = sanitize_text_field( $_POST[ 'invoiceId' ] );

			$model  = new InvoiceModel();
			$invoice = $model->fetchOne( $invoiceId );
			$response->result = $invoice->delete();
			$response->invoice = $invoice;

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_invoice_line_delete', function() {

			$response = new \stdClass();

			$invoiceLineId = sanitize_text_field( $_POST['invoiceLineId'] );

			$model = new InvoiceLineModel();
			$obj   = $model->fetchOne( $invoiceLineId );
			$invoiceId = $obj->invoiceId;
			$response->result = $obj->delete();
			$model = new InvoiceModel();
			$response->parentModel = $model->fetchOne( $invoiceId );

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_invoice_account_option_loader', function() {

			$response = new \stdClass();

			$obj = new AccountModel();
			$response->accounts = $obj->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_invoice_pdf', function() {

			$response = new \stdClass();

			// Parse invoiceId.
			$post = sanitize_post( $_POST );
			$invoiceData = $post['invoice'];
			$invoiceId = $invoiceData['invoiceId'];

			$invoicePdf = new InvoicePdf();
			$response->pdfUrl = $invoicePdf->generate( $invoiceId );

			$response->code = 200;
			wp_send_json_success( $response );

		});


		/*
		 *
		 * Invoice Send
		 * wp_ajax: sacom_invoice_send
		 *
		 */
		add_action( 'wp_ajax_sacom_invoice_send', function() {

			$response = new \stdClass();
			$post = sanitize_post( $_POST );
			$invoiceId = $post['invoiceId'];

			$invoiceSend = new InvoiceSend();
			$response->result = $invoiceSend->send( $invoiceId );

			$response->code = 200;
			wp_send_json_success( $response );

		});

	}

	public function enqueueEditorScript() {

		/* Invoice Editor styles */
		wp_enqueue_style(
			'sacom-invoice-editor-styles',
			SABER_COMMERCE_URL . '/components/Invoice/css/invoice-editor.css',
			[],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			'all'
		);

		wp_enqueue_script(
			'sacom-invoice-editor',
			SABER_COMMERCE_URL . 'components/Invoice/js/InvoiceEditor.js',
			[ 'sacom-editor-base', 'sacom-admin-script', 'sacom-cleave', 'wp-util', 'jquery-ui-tooltip', 'jquery-ui-dialog', 'jquery-ui-datepicker', 'sacom-dayjs' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			1
		);

		$localizedData = [
			'adminUrl'         => admin_url(),
			'saberCommerceUrl' => SABER_COMMERCE_URL,
			'strings'          => $this->strings()
		];

		wp_localize_script(
			'sacom-invoice-editor',
			'editorData',
			$localizedData
		);

	}

	function strings() {

		return [
			'add_new'             => __( 'Add New', 'saber-commerce' ),
			'view_all'            => __( 'View All', 'saber-commerce' ),
			'dashboard_uppercase' => __( 'DASHBOARD', 'saber-commerce' ),
		];

	}

}
