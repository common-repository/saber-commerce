<?php

namespace SaberCommerce\Component\Payment;

class PaymentInvoiceModel extends \SaberCommerce\Model {

	public $paymentInvoiceId = 0;
	public $paymentId        = 0;
	public $invoiceId        = 0;
	public $amount           = 0;
	public $table            = 'payment_invoice';

	public function save() {

		global $wpdb;

		$data = [
			'id_payment'        => $this->paymentId,
			'id_invoice'				=> $this->invoiceId,
			'amount' 					  => $this->amount,
		];

		if( !$this->paymentInvoiceId ) {

			$wpdb->insert( $this->tableName(), $data);
			$this->paymentInvoiceId = $wpdb->insert_id;

		} else {

			$wpdb->update( $this->tableName(), $data,
				[ 'id_payment_invoice' => $this->paymentId ]
			);

		}

	}

	public function fetchAll() {

		global $wpdb;
		$where = '1=1';
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

	public function fetchByInvoice( $invoiceId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_invoice = $invoiceId";
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

	public function fetchByPayment( $paymentId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_payment = $paymentId";
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

	protected function load( $row ) {

		$obj = new PaymentInvoiceModel();
		$obj->paymentInvoiceId = $row->id_payment_invoice;
		$obj->paymentId = $row->id_payment;
		$obj->invoiceId = $row->id_invoice;
		$obj->amount = $row->amount;

		return $obj;

	}

}
