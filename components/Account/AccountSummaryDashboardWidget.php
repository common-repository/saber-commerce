<?php

namespace SaberCommerce\Component\Account;

class AccountSummaryDashboardWidget extends \SaberCommerce\Component\Admin\SummaryWidget {

	function headingText() {

		return __( 'ACCOUNTS SUMMARY', 'saber-commerce' );

	}

	function headingIcon() {

		return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-shield" class="svg-inline--fa fa-user-shield fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M622.3 271.1l-115.2-45c-4.1-1.6-12.6-3.7-22.2 0l-115.2 45c-10.7 4.2-17.7 14-17.7 24.9 0 111.6 68.7 188.8 132.9 213.9 9.6 3.7 18 1.6 22.2 0C558.4 489.9 640 420.5 640 296c0-10.9-7-20.7-17.7-24.9zM496 462.4V273.3l95.5 37.3c-5.6 87.1-60.9 135.4-95.5 151.8zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm96 40c0-2.5.8-4.8 1.1-7.2-2.5-.1-4.9-.8-7.5-.8h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c6.8 0 13.3-1.5 19.2-4-54-42.9-99.2-116.7-99.2-212z"></path></svg>';

	}

	function statLabel() {

		return __( 'Total Accounts', 'saber-commerce' );

	}

	function statNumber() {

		$m = new AccountModel;
		return $m->fetchCount();

	}

	function latestHeading() {

		return __( 'New Accounts', 'saber-commerce' );

	}

	function latestList() {

		$m = new AccountModel;
		return $m->fetchLatest();

	}

	function buttonLabel() {

		return __( 'Open New Account', 'saber-commerce' );

	}

	function buttonUrl() {

		return '?page=sacom-accounts';

	}

	function adminItemPath() {

		return 'accounts';

	}

	function idField() {

		return 'accountId';

	}

	function titleField() {

		return 'title';

	}

}
