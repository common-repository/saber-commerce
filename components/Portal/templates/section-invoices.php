<?php

$m = new \SaberCommerce\Component\Invoice\InvoiceModel;
$accountId = 1;
$r = $m->fetch( $accountId );

?>

<div id="invoices-page" class="container">

	<!-- Breadcrumb section. -->
	<div class="sacom-portal-breadcrumbs">
		<ul>
			<li>Invoices</li>
			<li>Invoice Payment</li>
		</ul>
	</div>

	<!-- Page header. -->
	<div class="row">
		<div class="col-12">
			<h1>Invoices</h1>
		</div>
	</div>

	<!-- Invoices table. -->
	<div id="sacom-invoices-table" class="row">
		<div class="col-12">
			<table class="table">

				<thead>
					<th>Title</th>
					<th>&nbsp;</th>
				</thead>

				<tbody>
					<?php foreach( $r as $t ): ?>
					<tr>
						<td><?php print $t->title; ?></td>
						<td>
							<button class="btn btn-secondary button-invoice-view" data-id="<?php print $t->invoiceId; ?>">View Invoice</button>
							<button class="btn btn-secondary button-invoice-pay" data-id="<?php print $t->invoiceId; ?>">Pay Invoice</button>
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
			<div id="invoice-single-canvas"></div>
		</div>
	</div>
</div>
