import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import {
	SelectControl,
	__experimentalNumberControl as NumberControl,
	__experimentalBoxControl as BoxControl,
	Panel,
	PanelBody,
	PanelRow,
	TextControl
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {

	const skuSetter = ( value ) => {

		setAttributes({ sku: value });

	}

	return (

		<div { ...useBlockProps() }>

			<h2>{ __( 'Product Data', 'saber-commerce' ) }</h2>
			<Panel>

				<PanelBody title="Product SKU">
					<PanelRow>

						<TextControl
							label="SKU"
							value={ attributes.sku }
							onChange={ ( value ) => skuSetter( value ) }
						/>

					</PanelRow>
				</PanelBody>

				<PanelBody title="Product Description">
					<PanelRow>

						<RichText
							tagName="div"
							value={ attributes.description }
							onChange={ ( description ) => setAttributes( { description: description } ) }
							placeholder={ __( 'Product description goes here...' ) }
						/>

					</PanelRow>
				</PanelBody>

				<PanelBody title="Prices">
					<PanelRow>

						<TextControl
							label="Price"
							value={ attributes.price }
							onChange={ ( value ) => setAttributes( { price: value } ) }
						/>

					</PanelRow>
				</PanelBody>

			</Panel>

		</div>
	);

}
