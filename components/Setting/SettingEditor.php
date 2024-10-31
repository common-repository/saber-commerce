<?php

namespace SaberCommerce\Component\Setting;

class SettingEditor {

	public function init() {

		add_action( 'wp_ajax_sacom_setting_save', function() {

			$response = new \stdClass();

			$post               = sanitize_post( $_POST );
			$values             = $post['values'];
			$valuesObj          = json_decode( json_encode( $values ) );

			$m = new SettingModel();
			$response->result   = $m->save( $valuesObj );

			$response->setting = get_option( 'sacom_setting' );

			wp_send_json_success( $response );

		});

		add_action( 'wp_ajax_sacom_setting_load', function() {

			$response = new \stdClass();

			$response->setting = get_option( 'sacom_setting' );

			wp_send_json_success( $response );

		});

		$this->useJsModules();

	}

	function useJsModules() {

		add_filter( 'script_loader_tag', function( $tag, $handle, $src ) {

			if ( 'sacom-setting-editor' !== $handle ) {
				return $tag;
			}

			// change the script tag by adding type="module" and return it.
			$tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
			return $tag;

		}, 10, 3 );

	}

	public function enqueueEditorScript() {

		/* Timesheet Editor styles */
		wp_enqueue_style(
			'sacom-setting-editor-styles',
			SABER_COMMERCE_URL . '/components/setting/css/settings-editor.css',
			[],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			'all'
		);

		wp_enqueue_script(
			'sacom-setting-editor',
			SABER_COMMERCE_URL . 'components/setting/js/settingEditor.js',
			[ 'sacom-editor-base', 'sacom-admin-script', 'wp-util', 'jquery-ui-tooltip', 'jquery-ui-dialog', 'jquery-ui-datepicker', 'sacom-dayjs' ],
			\SaberCommerce\Plugin::getEnqueueVersion(),
			1
		);

		$localizedData = [
			'saberCommerceUrl' => SABER_COMMERCE_URL,
			'settings'         => get_option( 'sacom_setting' ),
			'pages'            => $this->settingPages(),
			'fields'           => $this->settingFields(),
			'strings'          => $this->strings()
		];

		wp_localize_script(
			'sacom-setting-editor',
			'editorData',
			$localizedData
		);

	}

	function settingPages() {

		$pages = [];
		$pages = apply_filters( 'sacom_setting_page_register', $pages );
		return $pages;

	}

	function settingFields() {

		$fields = [];
		$pages = [];
		$pages = apply_filters( 'sacom_setting_page_register', $pages );
		foreach( $pages as $page ) {

			if( !empty( $page->fields )) {

				foreach( $page->fields as $field ) {

					$fields[] = $field;

				}

			}

		}

		return $fields;

	}

	function strings() {

		return [

			'add_new'             => __('Add New', 'saber-commerce' ),
			'view_all'            => __('View All', 'saber-commerce' ),
			'dashboard_uppercase' => __('DASHBOARD', 'saber-commerce' ),
			'settings_uppercase'  => __('SETTINGS', 'saber-commerce' ),
			'save_uppercase'      => __('SAVE', 'saber-commerce' ),

		];

	}

}
