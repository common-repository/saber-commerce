import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<h2>
				{ __( 'Order Summary', 'saber-commerce' ) }
			</h2>
			<InnerBlocks.Content />
		</div>
	);
}
