<?php

namespace SaberCommerce\Component\Catalog;

use SaberCommerce\Template;

class CatalogComponent extends \SaberCommerce\Component {

	public function init() {

		$this->enqueueFrontScripts();

	}

	function enqueueFrontScripts() {

		add_action( 'wp_enqueue_scripts', function() {

			/* Invoice Editor styles */
			wp_enqueue_style(
				'sacom-catalog-front',
				SABER_COMMERCE_URL . '/components/Catalog/css/front-catalog.css',
				[],
				\SaberCommerce\Plugin::getEnqueueVersion(),
				'all'
			);

		});

	}

}
