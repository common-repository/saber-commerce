<?php

namespace SaberCommerce\Component\Portal;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Account\AccountModel;
use \SaberCommerce\Component\Account\AccountUserModel;
use \SaberCommerce\Component\Timesheet\TimesheetModel;
use \SaberCommerce\Component\Invoice\InvoiceModel;

class PortalComponent extends \SaberCommerce\Component {

	public function init() {

		$this->addShortcodes();

		add_action('wp_enqueue_scripts', [$this, 'addScripts']);
		add_action('wp_enqueue_scripts', [$this, 'addStyles']);

		add_action('wp_ajax_sacom_portal_section_load', [$this, 'sectionLoad']);
		add_action('wp_ajax_sacom_portal_timesheet_load', [$this, 'timesheetLoad']);
		add_action('wp_ajax_sacom_portal_invoice_load', [$this, 'invoiceLoad']);
		add_action('wp_ajax_sacom_portal_checkout_load', [$this, 'checkoutLoad']);

		add_filter( 'sacom_portal_section_register', function( $sections ) {

			$section = new PortalSectionModel();
			$section->key = 'dashboard';
			$section->title = "Dashboard";
			$section->position = 1.0;

			$section->routes = array(
				array(
					'route'    => '/default/',
					'callback' => 'renderSplash'
				),
				array(
					'route'    => '/dashboard/',
					'callback' => 'renderDashboard'
				),
				array(
					'route'    => '/invalid/',
					'callback' => 'renderInvalidRoute'
				),
			);

			$sections[] = $section;
			return $sections;

		});


	}

	public function checkoutLoad() {

		$post      = sanitize_post( $_POST );
		$invoiceId = $post['invoice'];

		// open response
		$response = new \stdClass();
		$response->code = 200;

		$user = wp_get_current_user();

		$m = new InvoiceModel();
		$response->invoice = $m->fetchOne( $invoiceId );
		$response->user = $user;

		// load checkout template
		$template = new Template();
		$template->path = 'components/Portal/templates/';
		$template->name = 'checkout';
		$template->data['invoice'] = $response->invoice;
		$response->template = $template->get();

		// send response
		wp_send_json_success( $response );

	}

	public function addShortcodes() {

		add_shortcode('sacom_portal', function() {

			$template = new Template();
			$template->path = 'components/Portal/templates/';
			$template->name = 'main';
			return $template->get();

		});

	}

	public function addStyles() {

		wp_enqueue_style(
			'sacom-portal-style',
			SABER_COMMERCE_URL . '/components/Portal/css/portal.css',
			[],
			time()
	  );

	}

	public function addScripts() {

		wp_enqueue_script(
			'sacom-portal-react-script',
			SABER_COMMERCE_URL . 'components/Portal/react/portal/build/index.js',
			array( 'react', 'react-dom', 'wp-api-fetch', 'wp-element', 'wp-polyfill' ),
			\SaberCommerce\Plugin::getEnqueueVersion(),
			true
		);

		$localizedData = [
			'data' => $this->getPortalData(),
		];

		wp_localize_script(
			'sacom-portal-react-script',
			'SACOM_PortalData',
			$localizedData
		);

	}

	function getPortalData() {

		$data = new \stdClass;

		/* Add Current User Data */
		$data->user = wp_get_current_user();

		$data->sections = [];
		$data->sections = apply_filters( 'sacom_portal_section_register', $data->sections, $data->user );

		$data->sectionsObject = new \stdClass;
		foreach( $data->sections as $section ) {
			$data->sectionsObject->{ $section->key } = $section;
		}

		// Load additional account data.
		if( $data->user->ID > 0 ) {

			$data->user->profileImage = 'http://www.gravatar.com/avatar/' . md5( $data->user->data->user_email ) . '?s=120';

			// Add AccountUserModel.
			$aum = new AccountUserModel;
			$currentAccountUser = $aum->fetchOne( $data->user->ID );
			$data->accountUser = $currentAccountUser;

			// Add Account.
			$am = new AccountModel;
			$currentAccount = $am->fetchOne( $currentAccountUser->accountId );
			$data->account = $currentAccount;

		} else {

			$data->user->profileImage = false;

		}

		return $data;

	}

	public function activation( $ae ) {

		// Add portal page at /account.
		$slug = 'account';

		$page = [
			'post_type'    => 'page',
			'post_title'   => 'Account',
			'post_author'  => 1,
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_content' => '[sacom_portal]'
		];

		if( !get_page_by_path( $slug ) ) {

			$pageId = wp_insert_post( $page );

		}

	}

}
