<?php

namespace SaberCommerce\Component\Cart;
use \SaberCommerce\Component\Invoice\InvoiceModel;
use \Delight\Random\Random;

class CartModel extends \SaberCommerce\Model {

	public $cartId;
	public $referenceType;
	public $referenceId;
	public $items = [];
	public $status;
	public $table = 'cart';

	public function save() {

		global $wpdb;

		$data = [
			'reference_type' => $this->referenceType,
			'reference_id'   => $this->referenceId,
		];

		if( !$this->referenceId ) {
			return false;
		}

		if( !$this->cartId ) {

			$wpdb->insert( $this->tableName(), $data);
			$this->cartId = $wpdb->insert_id;

		} else {

			$wpdb->update( $this->tableName(), $data,
				[ 'id_cart' => $this->cartId ]
			);

		}

		/* Create and save the CartItemModel(s) */
		$this->createCartItemModels();

	}

	private function createCartItemModels() {

		if( empty( $this->items )) {
			return false;
		}

		// Call save on each cart item.
		// Items must be fully formed objects.
		foreach( $this->items as $item ) {

			$item->save();

		}

	}

	public function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_cart DESC"
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

	public function get() {

		$userId = get_current_user_id();

		if( isset( $_COOKIE[ 'sacom_cart' ] ) ) {

			$cookieCartHash = $_COOKIE[ 'sacom_cart' ];

		} else {

			$cookieCartHash = false;

		}

		if( !$userId && !$cookieCartHash ) {

			$cart = $this->makeCart( $userId );

			if( $cart->referenceType === 'cookie' ) {

				$_COOKIE[ 'sacom_cart' ] = $cart->referenceId;
				$result = setcookie( 'sacom_cart', $cart->referenceId, time() + 60*60*24*7 );

			}

			return $cart;

		}

		if( $userId ) {

			$referenceType = 'user';
			$referenceId   = $userId;

		} elseif( $cookieCartHash ) {

			$referenceType = 'cookie';
			$referenceId   = $cookieCartHash;

		}

		global $wpdb;
		$where = '1=1';
		$where .= " AND reference_type = '$referenceType'";
		$where .= " AND reference_id = '$referenceId'";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		if( empty( $result )) {

			$cart = $this->makeCart( $userId );

			if( $cart->referenceType === 'cookie' ) {

				$_COOKIE[ 'sacom_cart' ] = $cart->referenceId;
				$result = setcookie( 'sacom_cart', $cart->referenceId, time() + 60*60*24*7 );

			}

		} else {

			$cart = $this->load( $result[0] );

		}

		return $cart;

	}

	public function makeCart( $userId ) {

		$cart = new CartModel();

		if( $userId >= 1 ) {

			$cart->referenceType = 'user';
			$cart->referenceId   = $userId;

		} else {

			$cart->referenceType = 'cookie';
			$cart->referenceId   = Random::hexUppercaseString( 32 );

		}

		$cart->save();

		return $cart;

	}

	public function fetch( $referenceType, $referenceId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND reference_type = '$referenceType'";
		$where .= " AND reference_id = '$referenceId'";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		if( empty( $result )) {
			return false;
		}

		$obj = $this->load( $result[0] );
		return $obj;

	}

	public function fetchOne( $cartId ) {

		$this->cartId = $cartId;

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_cart = $cartId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);

		$cart = $this->load( $result[0] );
		return $cart;

	}

	public function fetchLatest() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_cart DESC" .
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
	 * Set cart status "locked" to prevent any future editing.
	 */
	function lock() {

		$this->status = 'locked';
		$this->save();

	}

	protected function load( $row ) {

		$obj                 = new CartModel();
		$obj->cartId         = $row->id_cart;
		$obj->referenceType  = $row->reference_type;
		$obj->referenceId    = $row->reference_id;
		$obj->created        = $row->created;

		// Load cart item models
		$cartItemModel = new CartItemModel();
		$obj->items = $cartItemModel->fetch( $row->id_cart );

		// Set totals using totals calculation methods.
		if( empty( $obj->items )) {
			$obj = $this->setTotalsEmpty( $obj );
		} else {
			$obj = $this->setTotalsFromCartItems( $obj, $obj->items );
		}
		// end setting of totals.

		return $obj;

	}

	/*
	 * Set Totals From Cart Items
	 * @private
	 */
	private function setTotalsFromCartItems( $obj, $items ) {

		$obj->totals = new \stdClass;
		$subtotal = 0;
		foreach( $items as $item ) {

			$subtotal += $item->subtotal;

		}

		$obj->totals->subtotal = $subtotal;
		$obj->totals->taxes    = 0.00;
		$obj->totals->total    = $obj->totals->subtotal + $obj->totals->taxes;
		return $obj;

	}

	/*
	 * Set Totals Empty
	 * @private
	 */
	// This functions acts on the loading object and returns it after setting totals.
	// Called only when cart loaded has exactly 0 items.
	private function setTotalsEmpty( $obj ) {

		$obj->totals = new \stdClass;
		$obj->totals->subtotal = 0.00;
		$obj->totals->taxes    = 0.00;
		$obj->totals->total    = 0.00;
		return $obj;

	}

}
