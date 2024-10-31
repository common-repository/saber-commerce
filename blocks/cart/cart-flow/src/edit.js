import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {

	const TEMPLATE = [
		[ 'saber-commerce/cart-header', {} ],
		[ 'saber-commerce/cart-table', {} ],
		[ 'saber-commerce/cart-totals', {} ],
		[ 'saber-commerce/cart-actions', {} ],
	];

	return (
		<div { ...useBlockProps() }>
			<h2>{ __( 'Cart Flow', 'saber-commerce' ) }</h2>
			<InnerBlocks
				template={TEMPLATE}
				templateLock="all"
			/>
		</div>
	);
}
