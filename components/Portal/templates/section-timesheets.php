<?php

$m = new \SaberCommerce\Component\Timesheet\TimesheetModel;
$accountId = 17;
$r = $m->fetch( $accountId );

?>

<div class="container">
	<div class="row">
		<div class="col-12">
			<h1>Timesheets</h1>
			<table class="table">

				<thead>
					<th>Label</th>
					<th>Workspace</th>
					<th>Time Period</th>
					<th>Hours Tracked</th>
					<th>Billable Rate</th>
					<th>Billable Total</th>
				</thead>

				<tbody>
					<?php foreach( $r as $t ): ?>
					<tr>
						<td><?php print $t->label; ?></td>
						<td><?php print $t->id_workspace; ?></td>
						<td><?php print $t->date_start; ?> to <?php print $t->date_end; ?></td>
						<td><?php print $t->totals->hours; ?></td>
						<td><?php print $t->billable_rate; ?></td>
						<td><?php print '$' . $t->totals->billable; ?></td>
						<td>
							<button class="btn btn-secondary button-timesheet-view" data-timesheet="<?php print $t->id_timesheet; ?>">View Timesheet</button>
						</td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	</div>
</div>

<div class="container">
	<div class="row">
		<div class="col-12">
			<div id="timesheet-single-canvas"></div>
		</div>
	</div>
</div>
