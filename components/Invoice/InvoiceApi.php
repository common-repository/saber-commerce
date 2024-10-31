<?php

namespace SaberCommerce\Component\Invoice;

class InvoiceApi extends \WP_REST_Controller {

	public function init() {

		add_action( 'rest_api_init', [ $this, 'registerRoutes' ] );

	}

	public function registerRoutes() {

		register_rest_route( 'sacom/v1', '/invoice',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getInvoiceCollection' ],
			]
		);

		register_rest_route( 'sacom/v1', '/invoice/(?P<id>\d+)',
			[
				'methods' => \WP_REST_Server::READABLE,
				'callback' => [ $this, 'getInvoice' ],
				'args' => array(
					'id' => array(
						'validate_callback' => function($param, $request, $key) {
							return is_numeric( $param );
						}
					),
				),
			]
		);

	}

	public function getInvoiceCollection() {

		$m = new InvoiceModel();
		$invoices = $m->fetchAll();
		$response = [
			'invoices' => $invoices
		];
		return $response;

	}

	public function getInvoice( $request ) {

		$m = new InvoiceModel();
		$invoice = $m->fetchOne( $request['id'] );

		if ( !$invoice ) {
			return new \WP_Error( 'no_invoice', 'No invoice with that invoice ID.', array( 'status' => 404 ) );
		}

		return $invoice;

	}

}
