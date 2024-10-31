<?php
/**
 * Plugin Name:       Cart Item Row Block
 * Description:       Dynamic block that renders current cart items inside the cart table body.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            SaberWP
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       saber-commerce
 *
 * @package           saber-commerce
 */

function create_block_cart_item_row_block_init() {

	$result = register_block_type_from_metadata( SABER_COMMERCE_PATH . 'blocks/cart/cart-item-row/block.json',
		[
			'render_callback' => 'sacom_block_render_cart_item_row'
		]
	);

}
add_action( 'init', 'create_block_cart_item_row_block_init' );

function sacom_block_render_cart_item_row() {

	$m = new \SaberCommerce\Component\Cart\CartModel();
	$cart = $m->get();

	foreach( $cart->items as $item ) {

		$c .= '<tr class="wp-block-saber-commerce-cart-item-row">';
		$c .= '<td>';
		$c .= $item->product->title;
		$c .= '</td>';
		$c .= '<td class="align-center">';
		$c .= $item->price;
		$c .= '</td>';
		$c .= '<td class="align-center">';
		$c .= '<input class="scm-cart-item-quantity" type="number" value="' . $item->quantity . '">';
		$c .= '</td>';
		$c .= '<td class="align-right">';
		$c .= $item->subtotal;
		$c .= '</td>';
		$c .= '</tr>';

	}

	return $c;

}
