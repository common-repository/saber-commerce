<?php

namespace SaberCommerce\Component\Setting;

class SettingComponent extends \SaberCommerce\Component {

	function init() {

		$api = new SettingApi();
		$api->init();

	}

	public function showInMenu() {

		return true;

	}

	public function menuOrder() {

		return 80;

	}

	public function wpMenuLabel() {

		return __( 'Settings', 'saber-commerce' );

	}

	public function wpAdminSlug() {

		return 'sacom-setting';

	}

	public function adminCallback() {

		print '<sacom-editor-setting />';

	}

	function activation( $ae ) {

		if( !is_dir( $ae->rootDirectoryPath . '/sacom/settings' )) {
			mkdir( $ae->rootDirectoryPath . '/sacom/settings', 0755 );
		}

		$this->parseSettingDefaults();

		if( !SettingModel::fetchAll() ) {

			$this->saveSettingDefaults();

		}

	}

	private function saveSettingDefaults() {

		$savePath = WP_CONTENT_DIR . '/uploads/sacom/settings/default.json';
		$defaultsJson = file_get_contents( $savePath );
		$defaults = json_decode( $defaultsJson );
		$m = new SettingModel();
		$m->save( $defaults );

	}

	private function parseSettingDefaults() {

		$fields = [];
		$pages = apply_filters( 'sacom_setting_page_register', [] );

		error_log( print_r($pages, 1 ));

		foreach( $pages as $page ) {

			if( empty( $page->fields )) { continue; }
			foreach( $page->fields as $field ) {
				$fields[] = $field;
			}

		}

		if( empty( $fields ) ) { return; };

		$defaults = new \stdClass();
		foreach( $fields as $field ) {

			if( isset( $field->default )) {

				$defaults->{ $field->id } = $field->default;

			} else {

				$defaults->{ $field->id } = null;

			}

		}

		error_log( print_r($defaults, 1 ));

		$defaultsJson = json_encode( $defaults );
		$savePath = WP_CONTENT_DIR . '/uploads/sacom/settings/default.json';
		file_put_contents( $savePath, $defaultsJson );

	}

}
