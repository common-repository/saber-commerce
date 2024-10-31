<?php

namespace SaberCommerce\Component\Setting;

class SettingModel extends \SaberCommerce\Model {

	public static function fetchOne( $id ) {

		$m = new SettingModel;
		return $m->load( $id );


	}

	public static function fetchAll() {

		$m = new SettingModel;
		return $m->loadAll();

	}

	public static function load( $key ) {

		$m = new SettingModel;
		return $m->loadAll()->{ $key };

	}

	private function loadAll() {

		return get_option( 'sacom_setting' );

	}

	function save( $settings ) {

		update_option( 'sacom_setting', $settings );

	}


}
