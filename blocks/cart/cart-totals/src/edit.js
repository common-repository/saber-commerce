import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {

	return (

		<div { ...useBlockProps() }>
			<h2>Cart Totals</h2>
			<div>Subtotal... $93.23</div>
		</div>

	);

}
