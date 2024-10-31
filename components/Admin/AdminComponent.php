<?php

namespace SaberCommerce\Component\Admin;

use \SaberCommerce\Template;
use \SaberCommerce\Component\Workspace\WorkspaceEditor;
use \SaberCommerce\Component\Account\AccountEditor;
use \SaberCommerce\Component\Invoice\InvoiceEditor;
use \SaberCommerce\Component\Payment\PaymentEditor;
use \SaberCommerce\Component\Timesheet\TimesheetEditor;
use \SaberCommerce\Component\Setting\SettingEditor;
use \SaberCommerce\Component\Product\ProductEditor;
use \SaberCommerce\Component\Order\OrderEditor;

class AdminComponent extends \SaberCommerce\Component {

	public function init() {

		/* Admin menu setup. */
		add_action( 'admin_menu', function() {

			add_menu_page(
				'Saber Commerce',
				'Saber Commerce',
				'manage_options',
				'sacom',
				[ $this, 'adminDashboardCallback' ],
				'dashicons-cart',
				'20.73827'
			);

			add_submenu_page(
				'sacom',
				__( 'Dashboard', 'saber-commerce' ),
				__( 'Dashboard', 'saber-commerce' ),
				'manage_options',
				'sacom',
				[ $this, 'adminDashboardCallback' ],
			);

			$components = \SaberCommerce\Plugin::componentDetection();

			$componentsOrdered = array();

			foreach( $components as $componentDefinition ) {

				$c = new $componentDefinition['class']();
				$componentsOrdered[ $c->menuOrder() ] = $c;

			}

			// Sort by menu order (key in array).
			ksort( $componentsOrdered );

			foreach( $componentsOrdered as $c ) {

				if( $c->showInMenu() ) {

					add_submenu_page(
						'sacom',
						$c->wpMenuLabel(),
						$c->wpMenuLabel(),
						'manage_options',
						$c->wpAdminSlug(),
						[ $c, 'adminCallback' ]
					);

				}

			}

		});

		/* Admin scripts setup. */
		add_action( 'admin_enqueue_scripts', function( $adminPage ) {

			switch( $adminPage ) {

				case 'saber-commerce_page_sacom-timesheets':
					$editor = new TimesheetEditor();
					$editor->enqueueEditorScript();
					break;

				case 'saber-commerce_page_sacom-accounts':
					$editor = new AccountEditor();
					$editor->enqueueEditorScript();
					break;

				case 'saber-commerce_page_sacom-workspaces':
					$editor = new WorkspaceEditor();
					$editor->enqueueEditorScript();
					break;

				case 'saber-commerce_page_sacom-invoices':
					$editor = new InvoiceEditor();
					$editor->enqueueEditorScript();
					break;

				case 'saber-commerce_page_sacom-payments':
					$editor = new PaymentEditor();
					$editor->enqueueEditorScript();
					break;

				case 'saber-commerce_page_sacom-setting':
					$editor = new SettingEditor();
					$editor->enqueueEditorScript();
					break;

				// Admin dashboard page.
				case 'toplevel_page_sacom':
					$this->scripts();
					break;

			}

		});

		/* Add AJAX hooks */
		// @TODO Edit this so it only adds hooks on the right pages
		$editor = new TimesheetEditor();
		$editor->init();

		$editor = new InvoiceEditor();
		$editor->init();

		$editor = new AccountEditor();
		$editor->init();

		$editor = new WorkspaceEditor();
		$editor->init();

		$editor = new PaymentEditor();
		$editor->init();

		$editor = new SettingEditor();
		$editor->init();

		$editor = new ProductEditor();
		$editor->init();

		$editor = new OrderEditor();
		$editor->init();

	}

	public function adminDashboardCallback() {

		print '<sacom-dashboard />';

	}

	public function adminPaymentsCallback() {

		print '<sacom-payment-editor />';

	}

	public function adminAccountsCallback() {

		print '<sacom-accounts />';

	}

	public function adminTimesheetsCallback() {

		print '<timesheet-editor />';

	}

	public function adminWorkspacesCallback() {

		print '<sacom-workspace-editor />';

	}

	public function scripts() {

		wp_enqueue_style(
			'sacom-admin-dashboard-styles',
			SABER_COMMERCE_URL . '/components/Admin/css/scm-admin.css',
			[],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			'all'
		);

		wp_enqueue_script(
			'sacom-admin-dashboard-script',
			SABER_COMMERCE_URL . '/components/Admin/js/AdminDashboard.js',
			[ 'wp-util' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			1
		);

		$localizedData = [
			'saberCommerceUrl'     => SABER_COMMERCE_URL,
			'saberCommerceVersion' => SABER_COMMERCE_VERSION,
			'adminUrl'             => admin_url(),
			'widgets'              => $this->loadWidgets(),
			'strings'              => $this->strings()
		];

		wp_localize_script(
			'sacom-admin-dashboard-script',
			'dashboardData',
			$localizedData
		);

	}

	public function strings() {

		return array(
			'version'             => __( 'Version', 'saber-commerce' ),
			'dashboard_uppercase' => __( 'DASHBOARD', 'saber-commerce' ),
			'need_help'           => __( 'Need Help?', 'saber-commerce' ),
			'manage_settings'     => __( 'Manage Settings', 'saber-commerce' ),
			'donate_to_support'   => __( 'Donate to Support Developer', 'saber-commerce' ),
			'open_support_ticket' => __( 'Open Support Ticket', 'saber-commerce' ),
			'share_your_review'   => __( 'Share Your Review', 'saber-commerce' ),
		);

	}

	/**
	  *
	  * Widget Handling.
	  */

	function loadWidgets() {

		$widgets = $this->registerWidgets();
		if( empty( $widgets )) { return []; }

		$data = [];
		foreach( $widgets as $widget ) {

			$data[] = $widget->export();

		}

		return $data;

	}

	function registerWidgets() {

		$widgets = [];
		$widgets = apply_filters( 'sacom_dashboard_widget_register', $widgets );
		return $widgets;

	}

}
