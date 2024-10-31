<?php

namespace SaberCommerce\Component\Payment;
use \SaberCommerce\Component\Invoice\InvoiceModel;

class PaymentModel extends \SaberCommerce\Model {

	public $paymentId;
	public $memo;
	public $invoices = [];
	public $invoiceModels = [];
	public $table = 'payment';

	public function save() {

		global $wpdb;

		$data = [
			'id_payment_method' => 49,
			'memo' 							=> $this->memo,
		];

		if( !$this->paymentId ) {

			$wpdb->insert( $this->tableName(), $data);
			$this->paymentId = $wpdb->insert_id;

		} else {

			$wpdb->update( $this->tableName(), $data,
				[ 'id_payment' => $this->paymentId ]
			);

		}

		/* Create and save the PaymentInvoiceModel(s) */
		$this->createPaymentInvoiceModels();

	}

	private function createPaymentInvoiceModels() {

		if( empty( $this->invoices )) {
			return false;
		}

		foreach( $this->invoices as $invoiceId ) {

			$invoiceModel = new InvoiceModel();
			$invoice = $invoiceModel->fetchOne( $invoiceId );

			$pim                   = new PaymentInvoiceModel();
			$pim->paymentId        = $this->paymentId;
			$pim->invoiceId        = $invoice->invoiceId;
			$pim->amount           = $invoice->total;

			$pim->save();
			$this->invoiceModels[] = $pim;

		}

	}

	public function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_payment DESC"
		);

		if( empty( $result )) {
			return [];
		}

		$objs = [];
		foreach( $result as $row ) {
			$objs[] = $this->load( $row );
		}

		return $objs;

	}

	public function fetch( $accountId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_account = $accountId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		if( empty( $result )) {
			return [];
		}

		$objs = [];
		foreach( $result as $row ) {
			$objs[] = $this->load( $row );
		}

		return $objs;

	}

	public function fetchOne( $paymentId ) {

		$this->paymentId = $paymentId;

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_payment = $paymentId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);

		$payment = $this->load( $result[0] );
		return $payment;

	}

	public function fetchLatest() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_payment DESC" .
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

	protected function load( $row ) {

		$obj                          = new PaymentModel();
		$obj->id                      = $row->id_payment;
		$obj->paymentId               = $row->id_payment;
		$obj->accountId               = $row->id_account;
		$obj->paymentMethod           = $row->payment_method;
		$obj->paymentMethodReference  = $row->payment_method_reference;
		$obj->memo                    = $row->memo;
		$obj->amount                  = $row->amount;
		$obj->created                 = $row->created;

		// Load payment invoice models
		$paymentInvoiceModel = new PaymentInvoiceModel();
		$obj->paymentInvoices = $paymentInvoiceModel->fetchByPayment( $row->id_payment );

		return $obj;

	}

	function definition() {

		$def = new \stdClass;
		$def->key = 'payment';
		$def->fields = $this->fields();
		return $def;

	}

	function fields() {

		$fields = [];

		$f = new \SaberCommerce\Field;
		$f->key = 'id_payment';
		$f->propertyKey = 'paymentId';
		$f->label = 'ID';
		$f->portalTableDisplay = 1;
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'id_account';
		$f->propertyKey = 'accountId';
		$f->label = 'Account ID';
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'memo';
		$f->propertyKey = 'memo';
		$f->label = 'Memo';
		$f->portalTableDisplay = 1;
		$fields[] = $f;

		return $fields;

	}

}
