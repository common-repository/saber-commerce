<?php

namespace SaberCommerce;

class Component {

	public function init() {}

	public function activation( $activationEnvironment ) {}

	public function deactivation() {}

	/* Override to show in WP Menu. */
	public function showInMenu() {

		return false;

	}

	/* Override to render tag for editors in admin. */
	public function adminCallback() {

		print '<sacom-editor />';

	}

	public function menuOrder() {

		return 50;

	}

}
