import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

export default function save( { attributes } ) {

	return (

		<Fragment>
			<style>{attributes.styles.css}</style>
			<div { ...useBlockProps.save( { className: 'wp-block-saber-commerce-cart-actions ' + attributes.styles.className } ) }>
				<button class="btn-primary">CHECKOUT</button>
				<button class="btn-secondary scm-continue-shopping-button">CONTINUE SHOPPING</button>
			</div>
		</Fragment>

	);
}
