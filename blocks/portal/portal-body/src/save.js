import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<div class="scm-portal-body-container">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
