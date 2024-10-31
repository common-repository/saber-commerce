<?php

namespace SaberCommerce\Component\Payment;

use \SaberCommerce\Component\Setting\SettingModel;

class PaymentMethod {

	public function getTitle() {}

	function isEnabled() {

		return SettingModel::load( $this->getKey() . '_enabled' );

	}

}
