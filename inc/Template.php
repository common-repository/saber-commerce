<?php

namespace SaberCommerce;

class Template {

	public $data = [];
	public $path;
	public $name;
	public $fullPath;

	public function __construct() {

		$this->path = 'templates/';

	}

	public function get() {

		if( is_array( $this->data ) && !empty( $this->data )) {
			extract( $this->data );
		}

		ob_start();

		if( $this->fullPath ) {

			require( $this->fullPath );

		} else {

			require( SABER_COMMERCE_PATH . $this->path . $this->name . '.php' );

		}

		$content = ob_get_contents();
		ob_end_clean();
		return $content;

	}

	public function render() {

		print $this->get();

	}

	function setFullPath( $path ) {

		$this->fullPath = $path;

	}

}
