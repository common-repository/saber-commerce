<?php

/*
 * ActivationEnvironment Class
 *
 * @namespace \SaberCommerce\ActivationEnvironment
 *
 * This class was added to provide multisite support.
 * During activation of the plugin this object directs components to either setup the base install (non-multisite) or to do the setup of a child site in a multisite network.
 *
 */

namespace SaberCommerce;

class ActivationEnvironment {

	public $rootDirectoryPath;
	public $dbPrefix;
	public $multisite = false;

	function setRootDirectoryPath( $path ) {

		$this->rootDirectoryPath = $path;

	}

	function setDbTablePrefix( $dbPrefix ) {

		$this->dbPrefix = $dbPrefix;

	}

	function setMultisite( $multisite ) {

		$this->multisite = $multisite;

	}



}
