import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {

	const styles = {

		main: {

			// padding
			paddingTop: attributes.padding.top,
			paddingRight: attributes.padding.right,
			paddingBottom: attributes.padding.bottom,
			paddingLeft: attributes.padding.left,

			// margin
			marginTop: attributes.margin.top,
			marginRight: attributes.margin.right,
			marginBottom: attributes.margin.bottom,
			marginLeft: attributes.margin.left,

			// border
			borderStyle: attributes.borderType,
			borderTopWidth: attributes.borderWidth.top,
			borderRightWidth: attributes.borderWidth.right,
			borderBottomWidth: attributes.borderWidth.bottom,
			borderLeftWidth: attributes.borderWidth.left,
			borderColor: attributes.borderColor,

			// typography
			fontFamily: attributes.fontFamily,
			fontSize: attributes.fontSize,
			fontWeight: attributes.fontWeight,

		}

	}

	return (
		<div { ...useBlockProps.save() }>
			<div style={styles.main}>
				<InnerBlocks.Content />
			</div>
		</div>
	);

}
