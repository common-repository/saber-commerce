import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<button className="scm-checkout-pay-now-button">
				{ __( 'PAY NOW', 'saber-commerce' ) }
			</button>
		</div>
	);
}
