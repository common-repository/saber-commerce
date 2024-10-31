<?php

namespace SaberCommerce\Component\Account;

use \SaberCommerce\Template;

class AccountUserModel extends \SaberCommerce\Model {

	public $accountUserId;
	public $accountId;
	public $wpUserId;
	public $table = 'account_user';

	public function fetch( $accountId ) {

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
			" WHERE $where"
		);

		foreach( $results as $index => $row ) {

			$results[ $index ] = $this->load( $row );

		}

		return $results;

	}

	/*
	 * Fetch one account from database
	 */
	public function fetchOne( $accountUserId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_account_user = $accountUserId";
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

		$model = new AccountUserModel();
		$model->id            = $row->id_account_user;
		$model->accountUserId = $row->id_account_user;
		$model->accountId     = $row->id_account;
		$model->wpUserId      = $row->wp_user_id;

		$userData = get_userdata( $model->wpUserId );
		$model->wpUserLabel = $userData->display_name . " (" . $userData->user_email . ")";
		$model->wpUserEmail = $userData->user_email;

		return $model;

	}

	public function save() {

		global $wpdb;
		$tableName = $wpdb->prefix . 'sacom_' . $this->table;

		if( !$this->accountUserId ) {

			$result = $wpdb->insert( $tableName, [
				'id_account' => $this->accountId,
				'wp_user_id' => $this->wpUserId
			]);

			$this->accountUserId = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $tableName,
				[
					'wp_user_id'  => $this->wpUserId
				],
				[ 'id_account_user' => $this->accountUserId ]
			);

		}

		return $result;

	}

	public function delete() {

		if( !$this->accountUserId ) {
			return;
		}

		global $wpdb;
		$wpdb->delete( $this->tableName(), [
				'id_account_user' => $this->accountUserId
			]
		);

	}

	function definition() {

		$def = new \stdClass;
		$def->key = 'user';
		$def->fields = $this->fields();
		return $def;

	}

	function fields() {

		$fields = [];

		$f = new \SaberCommerce\Field;
		$f->key = 'id_account_user';
		$f->propertyKey = 'accountUserId';
		$f->label = 'ID';
		$f->portalTableDisplay = 1;
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'id_account';
		$f->propertyKey = 'accountId';
		$f->label = 'Account ID';
		$fields[] = $f;

		return $fields;

	}

}
