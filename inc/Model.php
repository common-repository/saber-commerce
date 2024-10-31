<?php

namespace SaberCommerce;

class Model {

	public $queryArgs = [];

	public function setQueryOrder( $column, $direction = 'ASC' ) {

		$this->queryArgs[ 'orderColumn' ] = $column;
		$this->queryArgs[ 'orderDirection' ] = $direction;

	}

	public function setQueryLimit( $offset, $rows ) {

		$this->queryArgs[ 'limitOffset' ] = $offset;
		$this->queryArgs[ 'limitRows' ] = $rows;

	}

	public function tableName() {

		global $wpdb;
		return $wpdb->prefix . 'sacom_' . $this->table;

	}

}
