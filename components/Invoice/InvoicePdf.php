<?php

namespace SaberCommerce\Component\Invoice;

use Dompdf\Dompdf;
use \SaberCommerce\Template;
use \SaberCommerce\Component\Setting\SettingModel;

class InvoicePdf {

	public $invoice;

	public function generate( $invoiceId ) {

		$m = new InvoiceModel();
		$invoice = $m->fetchOne( $invoiceId );
		$this->invoice = $invoice;

		$css = $this->getCss();
		$html = $this->makeHtml( $invoice, $css );

		$dompdf = new Dompdf();

		$options = $dompdf->getOptions();
		$options->setDefaultFont( 'Courier' );
		$options->setIsHtml5ParserEnabled( true );
		$dompdf->setOptions( $options );

		$dompdf->loadHtml( $html );
		$dompdf->setPaper( 'A4', 'landscape' );
		$dompdf->render();
		$output = $dompdf->output();

		$savePath = $this->getSavePath( $invoice->invoiceId );
		file_put_contents( $savePath, $output );

		return $html;
		// return $this->getSaveUrl( $invoiceId );

	}

	public function makeHtml( $invoice, $css ) {

		// Get settings.
		$settings = SettingModel::fetchAll();

		$template = new Template();
		$template->path = 'components/Invoice/templates/bluewave/';
		$template->name = 'invoice';

		$template->data = array(
			'css'                   => $css,
			'amountDue'             => $invoice->total,
			'currency'              => $settings['currency_display_text'],
			'memo'                  => $invoice->title,
			'companyName'           => $settings['company_name'],
			'companyAddressLine1'   => $settings['address_line_1'],
			'companyAddressLine2'   => $settings['address_line_2'],
			'companyAddressCountry' => $settings['address_country'],
			'lines'                 => $this->makeInvoiceLineData( $invoice ),
			'paymentUrl'            => $this->paymentUrl()
		);

		$markup =  $template->get();
		return $markup;

	}

	public function paymentUrl() {

		return site_url() . '/dashboard/#invoice/pay/' . $this->invoice->invoiceId . '/';

	}

	public function makeInvoiceLineData( $invoice ) {

		$lines = [];

		foreach( $invoice->lines as $invoiceLine ) {

			$line = [];
			$line['title']    = $invoiceLine->memo;
			$line['quantity'] = '1.0';
			$line['rate']     = $invoiceLine->amount;
			$line['amount']   = $invoiceLine->amount;
			$lines[]          = $line;

		}

		/*

			array(
				'title'    => 'PPC advertising.',
				'quantity' => '1.4',
				'rate'     => '92.00',
				'amount'   => '$211.32'
			),

		*/

		return $lines;

	}

	public function getCss() {

		ob_start();
		require( SABER_COMMERCE_PATH . 'components/Invoice/templates/bluewave/invoice.css' );
		$content = ob_get_contents();
		ob_end_clean();
		return $content;

	}

	public function getSavePath( $invoiceId ) {

		$uploadDir = wp_upload_dir();
		return  $uploadDir['basedir'] . '/sacom/invoices/invoice-' . $invoiceId . '.pdf';

	}

	public function getSaveUrl( $invoiceId ) {

		$uploadDir = wp_upload_dir();
		return $uploadDir['baseurl'] . '/sacom/invoices/invoice-' . $invoiceId . '.pdf';

	}

}
