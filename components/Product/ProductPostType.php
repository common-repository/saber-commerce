<?php

namespace SaberCommerce\Component\Product;

class ProductPostType extends \SaberCommerce\PostType {

	function key() {

		return 'product';

	}

	function nameSingular() {

		return 'Product';

	}

	function namePlural() {

		return 'Products';

	}

	function rewrite() {

		return [
			'slug' => 'product'
		];

	}

	function template() {

		return array(
			array( 'saber-commerce/product-data' ),
			array( 'saber-commerce/product-sku' ),
			array( 'saber-commerce/product-add-to-cart' ),
		);

	}

	function templateLock() {

		return false;

	}

	function showInMenu() { return true; }

	function supports() {

		return array(
			'title', 'editor', 'thumbnail'
		);

	}

}
