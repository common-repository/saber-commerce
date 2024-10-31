import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<h1>
				{ __( 'ACCOUNT', 'saber-commerce' ) }
			</h1>
			<div class="portal-grid">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
