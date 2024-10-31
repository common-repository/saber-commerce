<!DOCTYPE html>

<html lang="en">

	<head>

		<meta charset="utf-8">
		<title>Invoice</title>

		<style>
			<?php print $css; ?>
		</style>

	</head>

	<body>

		<table id="sacom-invoice" cellspacing="0" cellpadding="0">

			<thead>

				<tr>

					<th id="sacom-invoice-header-left">

						<h1>INVOICE</h1>
						<h4>
							<?php print $memo; ?>
						</h4>

					</th>

					<th id="sacom-invoice-header-right" class="sacom-text-align-right">
						<h4>Amount Due</h4>
						<h2>
							$<?php print $amountDue; ?> (<?php print $currency; ?>)
						</h2>
					</th>

				</tr>

			</thead>

			<tbody>

				<!-- Nested line items table. -->
				<tr>

					<td colspan="2">

						<table id="sacom-invoice-lines-table" cellspacing="0" cellpadding="0">
							<thead>
								<tr>
									<th>Items</th>
									<th>Quantity</th>
									<th class="sacom-text-align-right">Rate</th>
									<th class="sacom-text-align-right">Amount</th>
								</tr>
							</thead>

							<tbody>

								<?php foreach( $lines as $line ) { ?>

									<tr class="sacom-invoice-line-row">

										<td class="sacom-invoice-line-title">
											<?php print $line['title']; ?>
										</td>

										<td class="sacom-text-align-right">
											<?php print $line['quantity']; ?>
										</td>

										<td class="sacom-text-align-right">
											<?php print $line['rate']; ?>
										</td>

										<td class="sacom-invoice-line-amount sacom-text-align-right">
											<?php print $line['amount']; ?>
										</td>
									</tr>

								<?php } ?>

							</tbody>

						</table>
						<!-- ./ Nested line items table. -->

					</td>
				</tr>
				<!-- ./ Nested line items table wrapper. -->

			</tbody>

			<tfoot>

				<tr>
					<td id="sacom-invoice-footer-left">

						<h3>
							<?php print $companyName; ?>
						</h3>

						<div id="sacom-invoice-company-address">
							<h4>
								<?php print $companyAddressLine1; ?>
							</h4>
							<h4>
								<?php print $companyAddressLine2; ?>
							</h4>
							<h4>
								<?php print $companyAddressCountry; ?>
							</h4>
						</div>

					</td>

					<td id="sacom-invoice-payment-container">

						<a id="sacom-invoice-pay-button" href="<?php print $paymentUrl; ?>">Pay Now</a>

					</td>

				</tr>

			</tfoot>

		</table>

	</body>

</html>
