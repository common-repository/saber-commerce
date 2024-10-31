<?php

namespace SaberCommerce\Component\Checkout;

class CheckoutField {

	public $id;
	public $label;

	public function render() {

		print $this->renderMarkup();

	}

	public function renderMarkup() {

		$h = '<div class="sacom-form-row">';
		$h .= '<label for="' . $this->id . '">' . $this->label . '</label>';
		$h .= '<input type="text" id="field_' . $this->id . '" />';
		$h .= '</div>';
		return $h;

	}



}
