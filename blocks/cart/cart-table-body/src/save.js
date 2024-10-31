import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

export default function save( { attributes } ) {

	return (

		<Fragment>
			<style>{attributes.styles.css}</style>
			<tbody { ...useBlockProps.save() }>
				<InnerBlocks.Content />
			</tbody>
		</Fragment>

	);
}
