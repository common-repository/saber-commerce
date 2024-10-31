<?php

function saber_commerce_sku_block_init() {
	register_block_type_from_metadata( SABER_COMMERCE_PATH . 'blocks/product/sku/block.json',
		array(
			'render_callback' => 'saber_commerce_sku_block_render'
		)
	);
}
add_action( 'init', 'saber_commerce_sku_block_init' );

function saber_commerce_sku_block_render( $attributes, $content ) {


	//var_dump( $attributes );

	return "F9382-20399";

}
