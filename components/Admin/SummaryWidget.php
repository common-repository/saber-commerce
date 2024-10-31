<?php

namespace SaberCommerce\Component\Admin;

abstract class SummaryWidget extends DashboardWidget {

	function type() {

		return 'summary';

	}

	abstract function headingText();
	abstract function headingIcon();
	abstract function statLabel();
	abstract function statNumber();
	abstract function latestHeading();
	abstract function latestList();
	abstract function buttonLabel();
	abstract function buttonUrl();
	abstract function adminItemPath();
	abstract function idField();
	abstract function titleField();

	function export() {

		$d = new \stdClass();

		$d->type          = $this->type();
		$d->headingText   = $this->headingText();
		$d->headingIcon   = $this->headingIcon();
		$d->statLabel     = $this->statLabel();
		$d->statNumber    = $this->statNumber();
		$d->latestHeading = $this->latestHeading();
		$d->latestList    = $this->latestList();
		$d->buttonLabel   = $this->buttonLabel();
		$d->buttonUrl     = $this->buttonUrl();
		$d->adminItemPath = $this->adminItemPath();
		$d->idField       = $this->idField();
		$d->titleField    = $this->titleField();

		return $d;

	}

}
