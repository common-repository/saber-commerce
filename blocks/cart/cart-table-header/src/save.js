import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<thead { ...useBlockProps.save() }>
			<tr>
				<th>Product</th>
				<th class="align-center">Price</th>
				<th class="align-center">Quantity</th>
				<th class="align-right">Subtotal</th>
			</tr>
		</thead>
	);
}
