<?php

namespace SaberCommerce\Component\Cart;

use \SaberCommerce\Component\Product\ProductModel;

class CartItemModel extends \SaberCommerce\Model {

	public $cartItemId;
	public $cartId;
	public $objectType;
	public $objectId;
	public $quantity;
	public $price;
	public $subtotal;
	public $table = 'cart_item';

	public function save() {

		global $wpdb;

		$data = [
			'id_cart'     => $this->cartId,
			'object_type' => $this->objectType,
			'object_id'   => $this->objectId,
			'quantity'    => $this->quantity,
			'price'       => $this->price,
			'subtotal'    => $this->subtotal
		];

		if( !$this->cartItemId ) {

			$result = $wpdb->insert( $this->tableName(), $data);
			$this->cartItemId = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $this->tableName(), $data,
				[ 'id_cart_item' => $this->cartItemId ]
			);

		}

		return $result;

	}

	public function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_cart_item DESC"
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

	public function fetch( $cartId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_cart = $cartId";
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

	public function fetchOne( $cartItemId ) {

		$this->cartItemId = $cartItemId;

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_cart_item = $cartItemId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);

		$cartItem = $this->load( $result[0] );
		return $cartItem;

	}

	public function fetchLatest() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_cart_item DESC" .
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

	public function delete() {

		if( !$this->cartItemId ) {
			return;
		}

		global $wpdb;
		return $wpdb->delete( $this->tableName(), [
				'id_cart_item' => $this->cartItemId
			]
		);

	}

	protected function load( $row ) {

		$obj             = new CartItemModel();
		$obj->cartItemId = $row->id_cart_item;
		$obj->cartId     = $row->id_cart;
		$obj->objectType = $row->object_type;
		$obj->objectId   = $row->object_id;

		if( $obj->objectType === 'product' ) {

			$m = new ProductModel();
			$obj->product = $m->fetchOne( $obj->objectId );

		}


		$obj->quantity   = $row->quantity;
		$obj->price      = $row->price;
		$obj->subtotal   = $row->subtotal;
		$obj->created    = $row->created;

		return $obj;

	}

}
