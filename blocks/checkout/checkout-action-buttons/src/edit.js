import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			<button className="scm-checkout-pay-now-button">
				{ __( 'PAY NOW', 'saber-commerce' ) }
			</button>
		</div>
	);
}
