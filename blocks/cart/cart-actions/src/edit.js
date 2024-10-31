import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import InspectorControlSet from './inspector-control-set.js';
import { Fragment } from '@wordpress/element';
import './editor.scss';
import {create} from 'jss'
import nested from 'jss-plugin-nested';

export default function Edit( { attributes, setAttributes } ) {

	const styleObj = {

		root: {

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

			'& .scm-checkout-button': {
				"background-color": attributes.checkoutButtonBackgroundColor
			},

			'& .scm-continue-shopping-button': {
				"background-color": attributes.continueShoppingButtonBackgroundColor
			}

		},

	}

	if( JSON.stringify( styleObj ) !== JSON.stringify( attributes.styles.unparsed ) ) {

		const jss = create();
		jss.use( nested() );
		const sheet = jss.createStyleSheet( styleObj );
		const css = sheet.toString();

		console.log( css )

		setAttributes( {
			styles: {
				unparsed: styleObj,
				className: sheet.classes.root,
				css: css
			}
		} );

	}

	const blockProps = useBlockProps( {
		className: 'wp-block-saber-commerce-cart-actions ' + attributes.styles.className,
	} );

	return (

		<Fragment>

			<style>{attributes.styles.css}</style>
			<div { ...blockProps }>

				<InspectorControlSet
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>

				<button class="btn-primary scm-checkout-button">CHECKOUT</button>
				<button class="btn-secondary scm-continue-shopping-button">CONTINUE SHOPPING</button>

			</div>

		</Fragment>

	);

}
