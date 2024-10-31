<?php

namespace SaberCommerce\Component\Product;

class ProductField extends \SaberCommerce\Field {

	public $id;
	public $label;
	public $placeholder;

	public function render() {

		print $this->renderMarkup();

	}

	public function renderMarkup() {

		$h = '<div class="sacom-form-row">';
		$h .= '<label for="' . $this->id . '">' . $this->label . '</label>';
		$h .= '<input type="text" id="field_' . $this->id . '" placeholder="' . $this->placeholder . '" />';
		$h .= '</div>';
		return $h;

	}


}
