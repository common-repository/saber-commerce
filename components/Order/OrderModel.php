<?php

namespace SaberCommerce\Component\Order;

use \SaberCommerce\Template;

class OrderModel extends \SaberCommerce\Model {

	public $orderId;
	public $userId;
	public $created;
	public $updated;
	public $table = 'order';

	public function fetch() {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_order = $orderId";
		$tss = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		foreach( $tss as $index => $order ) {

			$tss[ $index ] = $this->load( $order );

		}

		return $tss;

	}

	/* Cart conversion to Order. */
	public function makeOrderFromCart( $cart ) {

		$order = new OrderModel();
		$order->cart = $cart;

		// Build order from cart model.


		// Build order items from cart items.

		$order->save();
		return $order;

	}

	public function generateOrderNumber() {



	}

	public function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_order DESC"
		);

		foreach( $results as $index => $row ) {

			$results[ $index ] = $this->load( $row );

		}

		return $results;

	}

	public function fetchLatest() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_order DESC" .
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
	 * Fetch one order from database
	 */
	public function fetchOne( $orderId ) {

		$this->orderId = $orderId;

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_order = $orderId";
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

	/*
	 * Loading function for single orders
	 */
	public function load( $row ) {

		$order = new OrderModel();
		$order->orderId   = $row->id_order;

		$order->cartId = $row->id_cart;

		if( $order->cartId > 0 ) {

			$m = new \SaberCommerce\Component\Cart\CartModel();
			$order->cart = $m->fetchOne( $order->cartId );

		}

		/* Load user. */
		$order->userId = $row->id_user;
		$order->userData = get_userdata( $order->userId );

		$order->paymentId = $row->id_payment;

		if( $order->paymentId > 0 ) {

			$m = new \SaberCommerce\Component\Payment\PaymentModel();
			$order->payment = $m->fetchOne( $order->paymentId );

		} else {

			$order->payment = false;

		}

		$order->status    = $row->status;
		$order->created   = $row->created;
		$order->updated   = $row->updated;
		return $order;

	}

	public function save() {

		global $wpdb;
		$tableName = $wpdb->prefix . 'sacom_' . $this->table;

		$data = [
			'id_cart' => $this->cart->cartId
		];

		if( !$this->orderId ) {

			$result = $wpdb->insert( $tableName, $data );
			$this->orderId = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $tableName, $data,
				[ 'id_order' => $this->orderId ]
			);

		}

		return $result;

	}

	public function delete() {

		if( !$this->orderId ) {
			return;
		}

		global $wpdb;
		$wpdb->delete( $this->tableName(), [
				'id_order' => $this->orderId
			]
		);

	}

	/* Test if the current object is valid. */
	public function isValid() {

		return false;

	}

}
