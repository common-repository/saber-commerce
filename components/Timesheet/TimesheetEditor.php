<?php

namespace SaberCommerce\Component\Timesheet;

use \SaberCommerce\Component\Account\AccountModel;
use \SaberCommerce\Component\Workspace\WorkspaceModel;

class TimesheetEditor {

	public function init() {

		add_action( 'wp_ajax_sacom_timesheet_save', function() {

			$response  = new \stdClass();
			$post      = sanitize_post( $_POST );
			$timesheet = $post[ 'timesheet' ];

			$obj = new TimesheetModel();

			if( isset( $timesheet['timesheetId'] )) {
				$obj->timesheetId = $timesheet['timesheetId'];
			} else {
				$obj->timesheetId = 0;
			}

			$obj->accountId    = $timesheet['accountId'];
			$obj->workspaceId  = $timesheet['workspaceId'];
			$obj->label        = $timesheet['label'];
			$obj->dateStart    = $timesheet['dateStart'];
			$obj->dateEnd      = $timesheet['dateEnd'];
			$obj->billableRate = $timesheet['billableRate'];
			$response->save    = $obj->save();

			if( $response->save === 0 ) {
				$response->code = 300;
			} else {
				$response->code = 200;
			}

			/* Fetch updated timesheet */
			$model = new TimesheetModel();
			$response->timesheet = $model->fetchOne( $obj->timesheetId );

			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_timesheet_entry_save', function() {

			$response = new \stdClass();

			$post  = sanitize_post( $_POST );
			$entry = $post['entry'];

			if( !isset( $entry['timesheetId'] )) {
				$entry['timesheetId'] = 1;
			}
			$timesheetId = $entry['timesheetId'];

			if( !isset( $entry[ 'timesheetEntryId' ] )) {
				$entry['timesheetEntryId'] = 0;
			}

			$obj                      = new TimesheetEntryModel();
			$obj->timesheetId         = $entry['timesheetId'];
			$obj->timesheetEntryId    = $entry['timesheetEntryId'];
			$obj->memo                = $entry['memo'];
			$obj->timeStart           = $entry['timeStart'];
			$obj->timeEnd             = $entry['timeEnd'];
			$obj->duration            = $entry['duration'];
			$response->rowsUpdated    = $obj->save();
			$response->timesheetEntry = $obj;

			if( $response->rowsUpdated === 0 ) {
				$response->code = 300;
			} else {
				$response->code = 200;
			}

			/* Fetch updated timesheet */
			$model = new TimesheetModel();
			$response->timesheet = $model->fetchOne( $timesheetId );

			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_timesheet_loader', function() {

			$response = new \stdClass();

			$obj = new TimesheetModel();
			$response->objects = $obj->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_timesheet_account_option_loader', function() {

			$response = new \stdClass();

			$obj = new AccountModel();
			$response->accounts = $obj->fetchAll();

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_timesheet_account_workspace_option_loader', function() {

			$response = new \stdClass();

			$accountId = sanitize_text_field( $_POST['accountId'] );

			$obj = new WorkspaceModel();
			$response->workspaces = $obj->fetch( $accountId );

			$response->code = 200;
			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_timesheet_entry_delete', function() {

			$response = new \stdClass();

			$entryId = sanitize_text_field( $_POST['entryId'] );

			$model = new TimesheetEntryModel();
			$obj   = $model->fetchOne( $entryId );
			$timesheetId = $obj->timesheetId;
			$response->result = $obj->delete();
			$response->entryId = $entryId;
			$model = new TimesheetModel();
			$response->timesheet = $model->fetchOne( $timesheetId );

			$response->code = 200;
			wp_send_json_success( $response );

		});

		/*
		 * Invoice Generate
		 * sacom_timesheet_generate_invoice
		 */
		add_action( 'wp_ajax_sacom_timesheet_generate_invoice', function() {

			$response = new \stdClass();
			$post = sanitize_post( $_POST );
			$timesheetId = $post['timesheetId'];

			// Do the invoice generation.
			$m = new TimesheetInvoiceModel();
			$response->timesheetInvoiceId = $m->generate( $timesheetId );

			// Pull timesheet.
			$m = new TimesheetModel();
			$timesheet = $m->fetchOne( $timesheetId );
			$response->timesheet = $timesheet;

			// Generate PDF version of invoice.
			$invoiceId = $timesheet->invoice->invoiceId;
			$invoicePdf = new \SaberCommerce\Component\Invoice\InvoicePdf();
			$invoicePdf->generate( $invoiceId );

			$response->code = 200;
			wp_send_json_success( $response );

 		});

	}

	public function enqueueEditorScript() {

		/* Timesheet Editor styles */
		wp_enqueue_style(
			'sacom-timesheet-editor-styles',
			SABER_COMMERCE_URL . '/components/Timesheet/css/timesheet-editor.css',
			[],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			'all'
		);

		wp_enqueue_script(
			'sacom-timesheet-editor',
			SABER_COMMERCE_URL . 'components/Timesheet/js/TimesheetEditor.js',
			[ 'sacom-editor-base', 'sacom-admin-script', 'sacom-cleave', 'wp-util', 'jquery-ui-tooltip', 'jquery-ui-dialog', 'jquery-ui-datepicker', 'sacom-dayjs' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			1
		);

		$accountModel = new AccountModel();

		$localizedData = [
			'saberCommerceUrl' => SABER_COMMERCE_URL,
			'adminUrl'         => admin_url(),
			'accounts'         => $accountModel->fetchAll(),
			'strings'					 => $this->strings()
		];

		wp_localize_script(
			'sacom-timesheet-editor',
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

	public function renderEditorElement() {

		print '<div id="timesheet-editor"></div>';

	}

}
