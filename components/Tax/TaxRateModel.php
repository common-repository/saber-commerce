<?php

namespace SaberCommerce\Component\Tax;

class TaxRateModel extends \SaberCommerce\Model {

	public $id;
	public $taxClassId;
	public $title;
	public $country;
	public $state;
	public $zipcode;
	public $city;
	public $rate;
	public $priority;
	public $priorityOrder;
	public $compound;
	public $shipping;
	public $table = 'tax_rate';

	function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_tax_rate DESC"
		);

		foreach( $results as $index => $row ) {

			$results[ $index ] = $this->load( $row );

		}

		return $results;

	}

	function fetchOne( $id ) {

		$this->id = $id;

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_tax_rate = $id";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);

		if( empty( $result )) {
			return false;
		}

		$row = $result[0];
		$obj = $this->load( $row );
		return $obj;

	}

	function fetchByKey( $key ) {

		$this->key = $key;

		global $wpdb;
		$where = '1=1';
		$where .= " AND key = $key";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);

		if( empty( $result )) {
			return false;
		}

		$row = $result[0];
		$obj = $this->load( $row );
		return $obj;

	}

	function load( $row ) {

		$m = new TaxRateModel();
		$m->id            = $row->id_tax_rate;
		$m->taxClassId    = $row->id_tax_class;
		$m->title         = $row->title;
		$m->country       = $row->country;
		$m->state         = $row->state;
		$m->zipcode       = $row->zipcode;
		$m->priority      = $row->priority;
		$m->priorityOrder = $row->priority_order;
		$m->compound      = $row->compound;
		$m->shipping      = $row->shipping;

		return $m;

	}

	function save() {

		global $wpdb;

		$data = [
			'id_tax_class'   => $this->taxClassId,
			'title'          => $this->title,
			'country'        => $this->country,
			'state'          => $this->state,
			'city'           => $this->city,
			'zipcode'        => $this->zipcode,
			'rate'           => $this->rate,
			'compound'       => $this->compound,
			'shipping'       => $this->shipping,
			'priority'       => $this->priority,
			'priority_order' => $this->priorityOrder
		];

		if( $data['id_tax_class'] === null ) {

			$data['id_tax_class'] = 0;

		}

		if( $data['compound'] === null ) {

			$data['compound'] = 0;

		}

		if( $data['shipping'] === null ) {

			$data['shipping'] = 0;

		}

		if( !$this->id ) {

			$result = $wpdb->insert( $this->tableName(), $data );
			$this->id = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $this->tableName(), $data,
				[ 'id_tax_rate' => $this->id ]
			);

		}

		return $result;

	}

	function delete() {

		if( !$this->id ) {
			return;
		}

		global $wpdb;
		$wpdb->delete( $this->tableName(), [
				'id_tax_rate' => $this->id
			]
		);

	}

}
