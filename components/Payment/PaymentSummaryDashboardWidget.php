<?php

namespace SaberCommerce\Component\Payment;

class PaymentSummaryDashboardWidget extends \SaberCommerce\Component\Admin\SummaryWidget {

	function headingText() {

		return __( 'PAYMENTS SUMMARY', 'saber-commerce' );

	}

	function headingIcon() {

		return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="wallet" class="svg-inline--fa fa-wallet fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"></path></svg>';

	}

	function statLabel() {

		return __( 'Total Payments', 'saber-commerce' );

	}

	function statNumber() {

		$m = new PaymentModel;
		return $m->fetchCount();

	}

	function latestHeading() {

		return __( 'New Payments', 'saber-commerce' );

	}

	function latestList() {

		$m = new PaymentModel;
		return $m->fetchLatest();

	}

	function buttonLabel() {

		return __( 'View Payments', 'saber-commerce' );

	}

	function buttonUrl() {

		return '?page=sacom-payments';

	}

	function adminItemPath() {

		return 'payments';

	}

	function idField() {

		return 'paymentId';

	}

	function titleField() {

		return 'memo';

	}

}
