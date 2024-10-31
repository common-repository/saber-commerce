<?php

namespace SaberCommerce\Component\Timesheet;

use \SaberCommerce\Template;

class TimesheetModel extends \SaberCommerce\Model {

	public $timesheetId;
	public $accountId;
	public $workspaceId;
	public $label;
	public $dateStart;
	public $dateEnd;
	public $billableRate;
	public $table = 'timesheet';

	public function fetch( $accountId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_account = $accountId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		$objs = [];
		foreach( $result as $index => $timesheetData ) {

			$objs[ $index ] = $this->load( $timesheetData );

		}

		return $objs;

	}

	public function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_timesheet DESC"
		);

		$objs = [];
		foreach( $result as $index => $row ) {

			$objs[ $index ] = $this->load( $row );

		}

		return $objs;

	}

	/*
	 * Fetch one timesheet from database
	 */
	public function fetchOne( $timesheetId ) {

		$this->timesheetId = $timesheetId;

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_timesheet = $timesheetId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);

		if( empty( $result ) ) {

			return false;

		}

		$timesheetData = $result[0];
		$timesheet = $this->load( $timesheetData );
		return $timesheet;

	}

	public function fetchLatest() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_timesheet DESC" .
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
	 * Loading function for single timesheets
	 */
	public function load( $timesheetData ) {

		$timesheet = new TimesheetModel();
		$timesheet->id           = $timesheetData->id_timesheet;
		$timesheet->timesheetId  = $timesheetData->id_timesheet;
		$timesheet->accountId    = $timesheetData->id_account;
		$timesheet->workspaceId  = $timesheetData->id_workspace;
		$timesheet->label        = $timesheetData->label;
		$timesheet->dateStart    = $timesheetData->date_start;
		$timesheet->dateEnd      = $timesheetData->date_end;
		$timesheet->billableRate = $timesheetData->billable_rate;

		/* Add account */
		$m = new \SaberCommerce\Component\Account\AccountModel();
		$timesheet->account = $m->fetchOne( $timesheet->accountId );

		/* Add workspace */
		if( $timesheet->workspaceId > 0 ) {

			$m = new \SaberCommerce\Component\Workspace\WorkspaceModel();
			$timesheet->workspace = $m->fetchOne( $timesheet->workspaceId );

		} else {

			$timesheet->workspace = false;

		}

		// Add generated invoice.
		$m = new TimesheetInvoiceModel();
		$timesheetInvoice = $m->fetchByTimesheet( $timesheet->timesheetId );
		if( $timesheetInvoice ) {

			$timesheet->invoice = $timesheetInvoice;

		} else {

			$timesheet->invoice = false;

		}

		$tsem = new TimesheetEntryModel();
		$timesheet->entries = $tsem->fetch( $timesheet->timesheetId );

		/* calculate totals */
		$timesheet->totals = new \stdClass;
		$timesheet->totals->minutes = 0;
		$timesheet->totals->hours   = 0;

		if( !empty( $timesheet->entries ) ) {
			foreach( $timesheet->entries as $e ) {
				$timesheet->totals->minutes += $e->duration;
			}
			$timesheet->totals->hours = round( $timesheet->totals->minutes / 60, 2 );
		}

		/* load billable rate */
		if( !$timesheetData->billable_rate ) {
			// fetch billable rate from workspace
			$timesheet->billableRate = 40;
		}

		$timesheet->totals->billable = round( $timesheet->totals->hours * $timesheet->billableRate, 2 );

		return $timesheet;

	}

	public function save() {

		global $wpdb;

		$data = array(
			'id_account'    => $this->accountId,
			'id_workspace'  => $this->workspaceId,
			'label'         => $this->label,
			'billable_rate' => $this->billableRate
		);

		if( isset( $this->dateStart ) ) {
			$data[ 'date_start' ] = $this->dateStart;
		}

		if( isset( $this->dateEnd ) ) {
			$data[ 'date_end' ] = $this->dateEnd;
		}

		if( !$this->timesheetId ) {

			$result = $wpdb->insert( $this->tableName(), $data );

			$this->timesheetId = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $this->tableName(), $data,
				[ 'id_timesheet' => $this->timesheetId ]
			);

		}

		return $result;

	}

	public function delete() {

		if( !$this->timesheetId ) {
			return;
		}

		global $wpdb;
		$wpdb->delete( $this->tableName(), [
				'id_timesheet' => $this->timesheetId
			]
		);

	}

	function definition() {

		$def = new \stdClass;
		$def->key = 'timesheet';
		$def->fields = $this->fields();
		return $def;

	}

	function fields() {

		$fields = [];

		$f = new \SaberCommerce\Field;
		$f->key = 'id_timesheet';
		$f->propertyKey = 'timesheetId';
		$f->label = 'ID';
		$f->portalTableDisplay = 1;
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'id_account';
		$f->propertyKey = 'accountId';
		$f->label = 'Account ID';
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'label';
		$f->propertyKey = 'label';
		$f->label = 'Label';
		$f->portalTableDisplay = 1;
		$fields[] = $f;

		$f = new \SaberCommerce\Field;
		$f->key = 'total';
		$f->propertyKey = 'total';
		$f->label = 'Total';
		$fields[] = $f;

		return $fields;

	}

}
