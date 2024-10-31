import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';


export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<h2>{ __( 'Cart Flow', 'saber-commerce' ) }</h2>
			<div>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
