<?php

namespace SaberCommerce\Component\Tax;

class TaxClassModel extends \SaberCommerce\Model {

	public $id;
	public $key;
	public $title;
	public $description;
	public $table = 'tax_class';

	function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_tax_class DESC"
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
		$where .= " AND id_tax_class = $id";
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
		$where .= " AND reference_key = $key";
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

		$m = new TaxClassModel();
		$m->id          = $row->id_tax_class;
		$m->key         = $row->reference_key;
		$m->title       = $row->title;
		$m->description = $row->description;

		return $m;

	}

	function save() {

		global $wpdb;
		$tableName = $wpdb->prefix . 'sacom_' . $this->table;

		$data = [
			'reference_key' => $this->key,
			'title'         => $this->title,
			'description'   => $this->description
		];

		if( !$this->id ) {

			$result = $wpdb->insert( $tableName, $data );
			$this->id = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $tableName, $data,
				[ 'id_tax_class' => $this->id ]
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
				'id_tax_class' => $this->id
			]
		);

	}

}
