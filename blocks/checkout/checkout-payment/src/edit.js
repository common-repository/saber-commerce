import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<h2>
			{ __( 'Checkout Payment', 'saber-commerce' ) }
			</h2>

		</div>
	);
}
