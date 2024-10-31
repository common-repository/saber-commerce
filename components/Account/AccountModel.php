<?php

namespace SaberCommerce\Component\Account;

use \SaberCommerce\Template;

class AccountModel extends \SaberCommerce\Model {

	public $accountId;
	public $wpUserId;
	public $title;
	public $table = 'account';

	public function fetch() {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_account = $accountId";
		$tss = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		foreach( $tss as $index => $account ) {

			$tss[ $index ] = $this->load( $account );

		}

		return $tss;

	}

	public function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_account DESC"
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
			" ORDER BY id_account DESC" .
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
	 * Fetch one account from database
	 */
	public function fetchOne( $accountId ) {

		$this->accountId = $accountId;

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_account = $accountId";
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
	 * Loading function for single accounts
	 */
	public function load( $row ) {

		$account = new AccountModel();
		$account->accountId = $row->id_account;
		$account->title     = $row->title;

		$obj = new AccountUserModel();
		$account->users = $obj->fetch( $account->accountId );

		return $account;

	}

	public function save() {

		global $wpdb;
		$tableName = $wpdb->prefix . 'sacom_' . $this->table;

		if( !$this->accountId ) {

			$result = $wpdb->insert( $tableName, [
				'wp_user_id'  => $this->wpUserId,
				'title'       => $this->title,
			]);

			$this->accountId = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $tableName,
				[
					'wp_user_id'  => $this->wpUserId,
					'title'       => $this->title,
				],
				[ 'id_account' => $this->accountId ]
			);

		}

		return $result;

	}

	public function delete() {

		if( !$this->accountId ) {
			return;
		}

		global $wpdb;
		$wpdb->delete( $this->tableName(), [
				'id_account' => $this->accountId
			]
		);

	}

}
