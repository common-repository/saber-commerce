<div class="invoice-single">
<div class="invoice-single">

	<h2>Invoice Single</h2>

	<h4>Title: <?php print $invoice->title; ?></h4>

	<table class="table">

		<thead>
			<th>Item</th>
			<th>Amount</th>
		</thead>

		<tbody>

			<?php

				foreach( $invoice->lines as $line ) :

			?>

				<tr>
					<td><?php print $line->memo; ?></td>
					<td><?php print $line->amount; ?></td>
				</tr>

			<?php endforeach; ?>

		</tbody>

		<tfoot>
			<tr>
				<td>
					<?php print '$' . $invoice->total; ?>
				</td>
			</tr>
		</tfoot>

	</table>

</div>
