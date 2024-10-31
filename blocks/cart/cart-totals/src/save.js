import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save() {

	return (

		<div { ...useBlockProps.save() }>
			<h2>Cart Totals</h2>
			<div>Subtotal... $93.23</div>
		</div>

	);
	
}
