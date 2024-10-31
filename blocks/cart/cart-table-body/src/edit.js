import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import InspectorControlSet from './inspector-control-set.js';
import { Fragment } from '@wordpress/element';
import './editor.scss';
import jss from 'jss';

export default function Edit( { attributes, setAttributes } ) {

	const styleObj = {

		attributeStyles: {

			// padding
			"padding-top": attributes.padding.top,
			"padding-right": attributes.padding.right,
			"padding-bottom": attributes.padding.bottom,
			"padding-left": attributes.padding.left,

			// margin
			"margin-top": attributes.margin.top,
			"margin-right": attributes.margin.right,
			"margin-bottom": attributes.margin.bottom,
			"margin-left": attributes.margin.left,

			// border
			"border-style": attributes.borderType,
			"border-top-width": attributes.borderWidth.top,
			"border-right-width": attributes.borderWidth.right,
			"border-bottom-width": attributes.borderWidth.bottom,
			"border-left-width": attributes.borderWidth.left,
			"border-color": attributes.borderColor,

			// typography
			"font-family": attributes.fontFamily,
			"font-size": attributes.fontSize,
			"font-weight": attributes.fontWeight,

		}

	}

	if( JSON.stringify( styleObj ) !== JSON.stringify( attributes.styles.unparsed ) ) {

		const sheet = jss.createStyleSheet( styleObj, { generateId: () => { return 'wp-block-saber-commerce-cart-table-body' } } );
		const css = sheet.toString();

		setAttributes( {
			styles: {
				unparsed: styleObj,
				css: css
			}
		} );

	}

	const TEMPLATE = [
		[ 'saber-commerce/cart-item-row', {} ],
	];

	return (

		<Fragment>

			<InspectorControlSet
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<style>{attributes.styles.css}</style>
			<tbody { ...useBlockProps() }>
				<InnerBlocks
					template={TEMPLATE}
					templateLock="all"
				/>
			</tbody>

		</Fragment>

	);
}
