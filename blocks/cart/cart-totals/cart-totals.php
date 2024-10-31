<?php
/**
 * Plugin Name:       Cart Totals Block
 * Description:       Cart totals block for the Saber Commerce cart.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       saber-commerce
 *
 * @package           saber-commerce
 */

function create_block_cart_totals_block_init() {

	$result = register_block_type_from_metadata( SABER_COMMERCE_PATH . 'blocks/cart/cart-totals/block.json',
		[
			'render_callback' => 'sacom_block_render_cart_totals'
		]
	);

}

add_action( 'init', 'create_block_cart_totals_block_init' );

function sacom_block_render_cart_totals() {

	$m = new \SaberCommerce\Component\Cart\CartModel();
	$cart = $m->get();

	$c = '';
	$c .= '<div class="wp-block-saber-commerce-cart-totals">';
	$c .= '<table>';
	$c .= '<tr>';
	$c .= '<td>';
	$c .= 'Subtotal';
	$c .= '</td>';
	$c .= '<td>';
	$c .= '$' . $cart->totals->subtotal;
	$c .= '</td>';
	$c .= '</tr>';
	$c .= '<tr>';
	$c .= '<td>';
	$c .= 'Taxes';
	$c .= '</td>';
	$c .= '<td>';
	$c .= '$0.00';
	$c .= '</td>';
	$c .= '</tr>';
	$c .= '<tr>';
	$c .= '<td>';
	$c .= 'Grand Total';
	$c .= '</td>';
	$c .= '<td>';
	$c .= '$' . $cart->totals->total;
	$c .= '</td>';
	$c .= '</tr>';
	$c .= '</table>';
	$c .= '</div>';
	return $c;

}
