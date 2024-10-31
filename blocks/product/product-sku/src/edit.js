import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	SelectControl,
	__experimentalNumberControl as NumberControl,
	__experimentalBoxControl as BoxControl,
	PanelBody,
	PanelRow,
	TextControl
} from '@wordpress/components';
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

	return (

		<div { ...useBlockProps() }>

			<InspectorControlSet
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<h5 style={styles.main}>SKU-0001-0001</h5>

		</div>

	);
}
