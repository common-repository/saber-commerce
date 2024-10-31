import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save() {

	return (

		<table { ...useBlockProps.save() }>
			<InnerBlocks.Content />
		</table>

	);
}
