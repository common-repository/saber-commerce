import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {

	const TEMPLATE = [
		[ 'saber-commerce/cart-table', {} ]
	];

	return (
		<div { ...useBlockProps() }>
			<h2>
				{ __( 'Order Summary', 'saber-commerce' ) }
			</h2>
			<InnerBlocks
				template={TEMPLATE}
				templateLock="all"
			/>
		</div>
	);
}
