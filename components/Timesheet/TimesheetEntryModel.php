<?php

namespace SaberCommerce\Component\Timesheet;

class TimesheetEntryModel extends \SaberCommerce\Model {

	public $timesheetEntryId;
	public $timesheetId;
	public $memo;
	public $timeStart;
	public $timeEnd;
	public $duration;
	public $table = 'timesheet_entry';

	public function fetch( $timesheetId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_timesheet = $timesheetId";
		$rows = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		$objs = [];
		foreach( $rows as $row ) {
			$objs[] = $this->load( $row );
		}

		return $objs;

	}

	public function fetchOne( $timesheetEntryId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_timesheet_entry =  $timesheetEntryId";
		$rows = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);


		$obj = $this->load( $rows[0] );

		return $obj;

	}

	public function load( $row ) {

		$obj                   = new TimesheetEntryModel();
		$obj->timesheetEntryId = $row->id_timesheet_entry;
		$obj->timesheetId      = $row->id_timesheet;
		$obj->memo             = $row->memo;
		$obj->timeStart        = $row->time_start;
		$obj->timeEnd          = $row->time_end;
		$obj->duration         = $row->duration;

		return $obj;

	}

	public function save() {

		if( !$this->timesheetId ) {
			return;
		}

		global $wpdb;

		$data = [
			'id_timesheet' => $this->timesheetId,
			'memo'         => $this->memo,
			'time_start'   => $this->timeStart,
			'time_end'     => $this->timeEnd,
			'duration'     => $this->duration
		];

		if( !$this->timesheetEntryId ) {

			$result = $wpdb->insert( $this->tableName(), $data);
			$this->timesheetEntryId = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $this->tableName(), $data,
				[ 'id_timesheet_entry' => $this->timesheetEntryId ]
			);

		}

		return $result;

	}

	public function delete() {

		if( !$this->timesheetEntryId ) {
			return;
		}

		global $wpdb;
		$result = $wpdb->delete( $this->tableName(), [
				'id_timesheet_entry' => $this->timesheetEntryId
			]
		);

		return $result;

	}

}
