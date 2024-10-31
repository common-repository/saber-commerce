import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import InspectorControlSet from './inspector-control-set.js';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {

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

	const TEMPLATE = [
		[ 'saber-commerce/catalog-filters', {} ],
		[ 'saber-commerce/catalog-grid', {} ],
	];

	return (
		<div { ...useBlockProps() }>

			<InspectorControlSet
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<InnerBlocks
				template={TEMPLATE}
				templateLock="all"
			/>
		</div>
	);
}
