import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {

	const TEMPLATE = [
		[ 'saber-commerce/product-title', {} ],
	];

	return (
		<div { ...useBlockProps() }>
			<InnerBlocks
				template={TEMPLATE}
				templateLock={false}
				renderAppender={ InnerBlocks.ButtonBlockAppender }
			/>
		</div>
	);
}
