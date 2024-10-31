<?php

namespace SaberCommerce\Component\Workspace;

use \SaberCommerce\Template;

class WorkspaceModel extends \SaberCommerce\Model {

	public $workspaceId;
	public $accountId;
	public $title;
	public $table = 'workspace';
	public $queryArgs = [];

	public function __construct() {

		$this->queryArgs = [
			'orderColumn'    => 'id_workspace',
			'orderDirection' => 'DESC',
			'limitOffset'    => 0,
			'limitRows'       => 1000
		];

	}

	public function setQueryOrder( $column, $direction = 'ASC' ) {

		$this->queryArgs[ 'orderColumn' ] = $column;
		$this->queryArgs[ 'orderDirection' ] = $direction;

	}

	public function setQueryLimit( $offset, $rows ) {

		$this->queryArgs[ 'limitOffset' ] = $offset;
		$this->queryArgs[ 'limitRows' ] = $rows;

	}

	public function fetch( $accountId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_account = $accountId";
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		foreach( $results as $index => $workspace ) {

			$results[ $index ] = $this->load( $workspace );

		}

		return $results;

	}



	public function fetchAll() {

		$order = 'ORDER BY ' . $this->queryArgs['orderColumn'] . ' ' . $this->queryArgs['orderDirection'];
		$limit = 'LIMIT ' . $this->queryArgs['limitOffset'] . ', ' . $this->queryArgs['limitRows'] . '';

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where " .
			$order . ' ' . $limit
		);

		foreach( $results as $index => $workspace ) {

			$results[ $index ] = $this->load( $workspace );

		}

		return $results;

	}

	/*
	 * Fetch one workspace from database
	 */
	public function fetchOne( $workspaceId ) {

		$this->workspaceId = $workspaceId;

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_workspace = $workspaceId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);
		$row = $result[0];

		$workspace = $this->load( $row );

		return $workspace;

	}

	/*
	 * Loading function for single workspaces
	 */
	public function load( $row ) {

		$workspace = new WorkspaceModel();
		$workspace->id          = $row->id_workspace;
		$workspace->workspaceId = $row->id_workspace;
		$workspace->accountId   = $row->id_account;
		$workspace->title       = $row->title;
		return $workspace;

	}

	public function save() {

		if( !$this->accountId ) {
			return;
		}

		global $wpdb;
		$tableName = $wpdb->prefix . 'sacom_' . $this->table;

		$data = [
			'id_account'   => $this->accountId,
			'id_workspace' => $this->workspaceId,
			'title'        => $this->title,
		];

		if( !$this->workspaceId ) {

			$wpdb->insert( $tableName, $data );

		} else {

			$wpdb->update( $tableName, $data,
				[ 'id_workspace' => $this->workspaceId ]
			);

		}

	}

	public function delete() {

		if( !$this->workspaceId ) {
			return;
		}

		global $wpdb;
		$wpdb->delete( $this->tableName(), [
				'id_workspace' => $this->workspaceId
			]
		);

	}

	function definition() {

		$def = new \stdClass;
		$def->key = 'workspace';
		$def->fields = $this->fields();
		return $def;

	}

	function fields() {

		$fields = [];

		$f = new \SaberCommerce\Field;
		$f->key = 'id_workspace';
		$f->propertyKey = 'workspaceId';
		$f->label = 'Workspace ID';
		$f->portalTableDisplay = 1;
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'id_account';
		$f->propertyKey = 'accountId';
		$f->label = 'Account ID';
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'title';
		$f->propertyKey = 'title';
		$f->label = 'Title';
		$f->portalTableDisplay = 2;
		$fields[] = $f;

		return $fields;

	}

}
