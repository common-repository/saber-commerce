import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {

	return (

		<tr { ...useBlockProps() }>
			<td>Two Large Boxes</td>
			<td class="align-center">2</td>
			<td class="align-center">$40.00</td>
			<td class="align-right">$80.00</td>
		</tr>

	);

}
