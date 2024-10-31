import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {

	const TEMPLATE = [
		[ 'saber-commerce/portal-section-dashboard', {} ],
	];

	return (
		<div { ...useBlockProps() }>
			<div class="scm-portal-body-container">
				<InnerBlocks
					template={TEMPLATE}
					templateLock="all"
				/>
			</div>
		</div>
	);
}
