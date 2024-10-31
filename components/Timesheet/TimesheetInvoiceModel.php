<?php

namespace SaberCommerce\Component\Timesheet;

use \SaberCommerce\Component\Invoice\InvoiceModel;
use \SaberCommerce\Component\Invoice\InvoiceLineModel;
use \SaberCommerce\Template;

class TimesheetInvoiceModel extends \SaberCommerce\Model {

	public $timesheetInvoiceId;
	public $timesheetId;
	public $invoiceId;
	public $generatedDate;
	public $table = 'timesheet_invoice';

	public function generate( $timesheetId ) {

		global $wpdb;

		$m = new TimesheetModel();
		$timesheet = $m->fetchOne( $timesheetId );

		$lines = [];
		foreach( $timesheet->entries as $entry ) {

			$line = new InvoiceLineModel();
			$line->memo     = $entry->memo;
			$line->rate     = $timesheet->billableRate;
			$line->quantity = $entry->duration / 60;
			$line->amount   = $timesheet->billableRate * ( $entry->duration / 60 );
			$lines[] = $line;

		}

		$invoice = new InvoiceModel();
		$invoice->accountId = $timesheet->accountId;
		$invoice->title = "Invoice generated" . time();
		$invoice->lines = $lines;
		$invoice->save();

		$result = $wpdb->insert( $this->tableName(), [
			'id_timesheet' => $timesheetId,
			'id_invoice'   => $invoice->invoiceId
		]);

		$this->timesheetInvoiceId = $wpdb->insert_id;

		return $this->timesheetInvoiceId;

	}

	public function fetchByTimesheet( $timesheetId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_timesheet = $timesheetId";
		$row = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_timesheet_invoice DESC" .
			" LIMIT 1"
		);

		if( !empty( $row ) ) {

			$result = $this->load( $row[0] );

		} else {

			$result = false;

		}

		return $result;

	}

	public function load( $row ) {

		$obj                     = new TimesheetInvoiceModel();
		$obj->timesheetInvoiceId = $row->id_timesheet_invoice;
		$obj->timesheetId        = $row->id_timesheet;
		$obj->invoiceId          = $row->id_invoice;
		$obj->generatedDate      = $row->generated_date;

		return $obj;

	}

}
