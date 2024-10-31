import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {

	const TEMPLATE = [
		[ 'saber-commerce/checkout-billing-form', {} ],
		[ 'saber-commerce/checkout-order-summary', {} ],
		[ 'saber-commerce/checkout-payment', {} ],
		[ 'saber-commerce/checkout-action-buttons', {} ],
	];

	return (

		<div { ...useBlockProps() }>

			<div>

				<InnerBlocks
					template={TEMPLATE}
					templateLock="all"
				/>

			</div>

		</div>

	);

}
