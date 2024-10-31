import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {

	const ALLOWED_BLOCKS = [
		'saber-commerce/catalog-grid-item-template'
	];

	const TEMPLATE = [
		[ 'saber-commerce/catalog-grid-item-template', {} ],
	];

	return (
		<div { ...useBlockProps() }>
			<InnerBlocks
				allowedBlocks={ALLOWED_BLOCKS}
				template={TEMPLATE}
				templateLock="all"
			/>
		</div>
	);
}
