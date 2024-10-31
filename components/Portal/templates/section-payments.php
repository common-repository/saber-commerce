<?php

$m = new \SaberCommerce\Component\Payment\PaymentModel;
$accountId = '0';
$r = $m->fetch( $accountId );

?>


<div id="portal-section-payments" class="sacom-portal-section">

	<h1>Payments</h1>

	<!-- Payments table. -->
	<div id="sacom-payments-table" class="row">
		<div class="col-12">
			<table class="table">

				<thead>
					<th>Memo</th>
					<th>&nbsp;</th>
				</thead>

				<tbody>
					<?php foreach( $r as $t ): ?>
					<tr>
						<td><?php print $t->memo; ?></td>
						<td>
							<button class="btn btn-secondary button-payment-view" data-id="<?php print $t->id_payment; ?>">View Payment</button>
						</td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	</div>
</div>


</div>
