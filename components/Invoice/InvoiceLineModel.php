<?php

namespace SaberCommerce\Component\Invoice;

class InvoiceLineModel extends \SaberCommerce\Model {

	public $invoiceLineId;
	public $invoiceId;
	public $memo;
	public $rate;
	public $quantity;
	public $amount;
	public $table = 'invoice_line';

	public function fetch( $invoiceId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_invoice = $invoiceId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		$objs = [];
		foreach( $result as $row ) {
			$objs[] = $this->load( $row );
		}

		return $objs;

	}

	public function fetchOne( $invoiceLineId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_invoice_line = $invoiceLineId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		if( empty( $result )) {
			return false;
		}

		$row = $result[0];
		$obj = $this->load( $row );
		return $obj;

	}

	public function save() {

		if( !$this->invoiceId ) {
			return;
		}

		global $wpdb;

		$data = [
			'id_invoice'  => $this->invoiceId,
			'memo'        => $this->memo,
			'rate'        => $this->rate,
			'quantity'    => $this->quantity,
			'amount'      => $this->amount
		];

		if( !$this->invoiceLineId ) {

			$result = $wpdb->insert( $this->tableName(), $data);
			$this->invoiceLineId = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $this->tableName(), $data,
				[ 'id_invoice_line' => $this->invoiceLineId ]
			);

		}

		return $result;

	}

	public function delete() {

		if( !$this->invoiceLineId ) {
			return;
		}

		global $wpdb;
		$wpdb->delete( $this->tableName(), [
				'id_invoice_line' => $this->invoiceLineId
			]
		);

	}

	public function load( $row ) {

		$obj                = new InvoiceLineModel();
		$obj->invoiceLineId = $row->id_invoice_line;
		$obj->invoiceId     = $row->id_invoice;
		$obj->memo          = $row->memo;
		$obj->rate          = $row->rate;
		$obj->quantity      = $row->quantity;
		$obj->amount        = $row->amount;

		return $obj;

	}

}
