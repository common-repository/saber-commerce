<?php

namespace SaberCommerce\Component\Invoice;

use Dompdf\Dompdf;
use \SaberCommerce\Template;
use \SaberCommerce\Component\Settings\SettingsComponent;

class InvoiceSend {

	// $recipient
	// $sender

	public function send( $invoiceId ) {

		// Do basic email setup.
		$to          = '';
		$subject     = 'Invoice';
		$message     = 'Your invoice is attached.';
		$headers     = 'Content-Type: text/html; charset=UTF-8';
		$attachments = [];

		// Load invoice.
		$m = new InvoiceModel;
		$invoice = $m->fetchOne( $invoiceId );

		// Attach PDF invoice.
		$m = new InvoicePdf();
		$pdfPath = $m->getSavePath( $invoiceId );
		$attachments[] = $pdfPath;

		// Get and verify "to email address", the recipient email.
		$to = $invoice->account->users[0]->wpUserEmail;

		// Send with wp_mail().
		$result = wp_mail(
			$to,
			$subject,
			$message,
			$headers,
			$attachments
		);

		return $result;

	}

}
