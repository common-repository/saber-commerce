<?php

namespace SaberCommerce\Component\Invoice;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Payment\PaymentInvoiceModel;

class InvoiceModel extends \SaberCommerce\Model {

	public $invoiceId;
	public $accountId;
	public $title;
	public $table = 'invoice';

	public function fetch( $accountId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_account = $accountId";
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		foreach( $results as $index => $invoice ) {

			$results[ $index ] = $this->load( $invoice );

		}

		return $results;

	}

	public function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_invoice DESC"
		);

		foreach( $results as $index => $invoice ) {

			$results[ $index ] = $this->load( $invoice );

		}

		return $results;

	}

	/*
	 * Fetch one invoice from database
	 */
	public function fetchOne( $invoiceId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_invoice = $invoiceId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);

		if( empty( $result ) ) {
			return false;
		}

		$this->invoiceId = $invoiceId;
		$invoiceData = $result[0];

		$invoice = $this->load( $invoiceData );
		return $invoice;

	}

	public function fetchLatest() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_invoice DESC" .
			" LIMIT 5"
		);

		foreach( $results as $index => $row ) {

			$results[ $index ] = $this->load( $row );

		}

		return $results;

	}

	public function fetchCount() {

		global $wpdb;
		$results = $wpdb->get_var(
			"SELECT COUNT(*) FROM " .
			$this->tableName()
		);

		return $results;

	}

	/*
	 * Loading function for single invoices
	 */
	public function load( $invoiceData ) {

		$invoice = new InvoiceModel();
		$invoice->title = $invoiceData->title;
		$invoice->invoiceId = $invoiceData->id_invoice;
		$invoice->id        = $invoiceData->id_invoice;
		$invoice->accountId = $invoiceData->id_account;

		$m = new \SaberCommerce\Component\Account\AccountModel();
		$invoice->account = $m->fetchOne( $invoice->accountId );

		// load line items
		$m = new InvoiceLineModel();
		$invoice->lines = $m->fetch( $invoice->invoiceId );

		// Load payment invoice models
		$paymentInvoiceModel = new PaymentInvoiceModel();
		$invoice->payments   = $paymentInvoiceModel->fetchByInvoice( $invoice->invoiceId );

		// Calculate total due.
		$total = 0;
		foreach( $invoice->lines as $line ) {
			$total += $line->amount;
		}
		$numberFormatter = new \NumberFormatter( 'en_US', \NumberFormatter::DECIMAL );
		$numberFormatter->setAttribute( \NumberFormatter::FRACTION_DIGITS, 2 );
		$invoice->total = $numberFormatter->format( $total );

		// Calculate total paid.
		$paid = 0;

		if( !empty( $invoice->payment )) {

			foreach( $invoice->payment as $payment ) {

				$paid += $payment->amount;

			}

		}

		$invoice->paid = $numberFormatter->format( $paid );

		// Add PDF download URL.
		$invoicePdf = new InvoicePdf();
		$invoice->pdfDownloadUrl = $invoicePdf->getSaveUrl( $invoice->invoiceId );

		return $invoice;

	}

	public function save() {

		global $wpdb;
		$tableName = $wpdb->prefix . 'sacom_' . $this->table;

		$data = [
			'id_account'  => $this->accountId,
			'title'       => $this->title,
		];

		if( !$this->invoiceId ) {

			$wpdb->insert( $this->tableName(), $data );
			$this->invoiceId = $wpdb->insert_id;

		} else {

			$wpdb->update( $this->tableName(), $data,
				[ 'id_invoice' => $this->invoiceId ]
			);

		}

		// Add lines.
		if( !empty( $this->lines ) ) {

			foreach( $this->lines as $line ) {

				$m            = new InvoiceLineModel();
				$m->invoiceId = $this->invoiceId;
				$m->memo      = $line->memo;
				$m->rate      = $line->rate;
				$m->quantity  = $line->quantity;
				$m->amount    = $line->amount;
				$m->save();

			}

		}

	}

	public function delete() {

		if( !$this->invoiceId ) {
			return;
		}

		global $wpdb;
		return $wpdb->delete( $this->tableName(), [
				'id_invoice' => $this->invoiceId
			]
		);

	}

	function definition() {

		$def = new \stdClass;
		$def->key = 'invoice';
		$def->fields = $this->fields();
		return $def;

	}

	function fields() {

		$fields = [];

		$f = new \SaberCommerce\Field;
		$f->key = 'id_invoice';
		$f->propertyKey = 'invoiceId';
		$f->label = 'ID';
		$f->portalTableDisplay = 1;
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'id_account';
		$f->propertyKey = 'accountId';
		$f->label = 'Account ID';
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'title';
		$f->propertyKey = 'title';
		$f->label = 'Title';
		$f->portalTableDisplay = 1;
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'total';
		$f->propertyKey = 'total';
		$f->label = 'Total';
		$f->portalTableDisplay = 1;
		$fields[] = $f;

		return $fields;

	}

}
