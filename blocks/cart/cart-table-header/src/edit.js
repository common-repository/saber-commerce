import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	return (
		<thead { ...useBlockProps() }>
			<tr>
				<th>Product</th>
				<th class="align-center">Price</th>
				<th class="align-center">Quantity</th>
				<th class="align-right">Subtotal</th>
			</tr>
		</thead>
	);
}
