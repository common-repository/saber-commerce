<div class="timesheet-single">

	<h2>Timesheet Single</h2>

	<h4>Date Start: <?php print $timesheet->date_start; ?></h4>
	<h4>Workspace <?php print $timesheet->id_workspace; ?></h4>

	<table class="table">

		<thead>
			<th>Memo</th>
			<th>Start Time</th>
			<th>End Time</th>
			<th>Duration</th>
		</thead>

		<tbody>

			<?php

				foreach( $timesheet->entries as $e ) :

			?>

				<tr>
					<td><?php print $e->memo; ?></td>
					<td><?php print $e->time_start; ?></td>
					<td><?php print $e->time_end; ?></td>
					<td><?php print $e->duration; ?></td>
				</tr>

			<?php endforeach; ?>

		</tbody>

		<tfoot>
			<tr>
				<td>
					<?php print $timesheet->totals->hours . ' hours.'; ?>
				</td>
			</tr>
			<tr>
				<td>
					<?php print '$' . $timesheet->billable_rate . ' per hour.'; ?>
				</td>
			</tr>
			<tr>
				<td>
					<?php print '$' . $timesheet->totals->billable . ' billable.'; ?>
				</td>
			</tr>
		</tfoot>

	</table>

</div>
