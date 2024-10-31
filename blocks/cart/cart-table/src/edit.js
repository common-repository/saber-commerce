import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {

	const TEMPLATE = [
		[ 'saber-commerce/cart-table-header', {
			backgroundColor: 'blue'
		} ],
		[ 'saber-commerce/cart-table-body', {} ],
		[ 'saber-commerce/cart-table-footer', {} ],
	];

	return (

		<table { ...useBlockProps() }>
			<InnerBlocks
				template={TEMPLATE}
				templateLock="all"
			/>
		</table>

	);

}
