import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	SelectControl,
	__experimentalNumberControl as NumberControl,
	__experimentalBoxControl as BoxControl,
	Panel,
	PanelBody,
	PanelRow,
	TabPanel,
	TextControl,
	ColorPicker,
	FontSizePicker
} from '@wordpress/components';

export default function InspectorControlSet( { attributes, setAttributes } ) {

	const onSelect = ( tabName ) => {
		console.log( 'Selecting tab', tabName );
	};

	const showTab = ( tab ) => {

		switch( tab.name ) {

			case 'tab_layout':
				return(
					<PanelBody title="Padding & Margin" initialOpen={ false }>

						<PanelRow>

							<BoxControl
								label="Padding"
								values={ attributes.padding }
								onChange={ ( value ) => setAttributes({ padding: value }) }
							/>

						</PanelRow>

						<PanelRow>

							<BoxControl
								label="Margin"
								values={ attributes.margin }
								onChange={ ( value ) => setAttributes({ margin: value }) }
							/>

						</PanelRow>

					</PanelBody>
				);
				break;

			case 'tab_style':

				return(

					<Fragment>

						<PanelBody title="Border" initialOpen={ false }>

							<PanelRow>

								<SelectControl
									label="Border Type"
									value={ attributes.borderType }
									options={ [
											{ label: 'None', value: 'none' },
											{ label: 'Solid', value: 'solid' },
											{ label: 'Dotted', value: 'dotted' },
											{ label: 'Dashed', value: 'dashed' },
									] }
									onChange={ ( value ) => setAttributes({ borderType: value }) }
								/>

							</PanelRow>

							<PanelRow>

								<BoxControl
									label="Border Width"
									values={ attributes.borderWidth }
									onChange={ ( value ) => setAttributes({ borderWidth: value }) }
								/>

							</PanelRow>

							<PanelRow>

							<ColorPicker
								color={ attributes.borderColor }
								onChangeComplete={ ( value ) => setAttributes({ borderColor: value.hex }) }
								disableAlpha
							/>

							</PanelRow>

						</PanelBody>

						<PanelBody title="Typography" initialOpen={ false }>

							<PanelRow>

								<SelectControl
									label="Font Family"
									value={ attributes.fontFamily }
									options={ [
										{ label: 'Inter', value: 'Inter' },
										{ label: 'Sans-Serif', value: 'sans-serif' },
										{ label: 'Serif', value: 'serif' }
									] }
									onChange={ ( value ) => setAttributes({ fontWeight: value }) }
								/>

							</PanelRow>

							<PanelRow>

								<FontSizePicker
									fontSizes={ fontSizes }
									value={ attributes.fontSize }
									fallbackFontSize={ fallbackFontSize }
									onChange={ ( value ) => setAttributes({ fontSize: value }) }
								/>

							</PanelRow>

							<PanelRow>

								<SelectControl
									label="Font Weight"
									value={ attributes.fontWeight }
									options={ [
											{ label: '400', value: '400' },
											{ label: '500', value: '500' },
											{ label: '600', value: '600' }
									] }
									onChange={ ( value ) => setAttributes({ fontWeight: value }) }
								/>

							</PanelRow>

						</PanelBody>

					</Fragment>

				);
				break;

			case 'tab_advanced':

				return(

					<PanelBody title="Z Index" initialOpen={ false }>

						<PanelRow>

							<TextControl
								label="Custom Z Index"
								value={ attributes.zindex }
								onChange={ ( value ) => setAttributes({ zindex: value }) }
							/>

						</PanelRow>

					</PanelBody>

				);

				break;

		}
	}

		const fontSizes = [
	    {
	        name: __( 'Small' ),
	        slug: 'small',
	        size: 12,
	    },
	    {
	        name: __( 'Big' ),
	        slug: 'big',
	        size: 26,
	    },
	];
	const fallbackFontSize = 16;

	return(

		<InspectorControls key="setting" position="1">

			<TabPanel
				className="my-tab-panel"
				activeClass="active-tab"
				onSelect={ onSelect }
				tabs={ [
					{
						name: 'tab_layout',
						title: 'Layout',
						className: 'tab-layout',
					},
					{
							name: 'tab_style',
							title: 'Style',
							className: 'tab-style',
					},
					{
							name: 'tab_advanced',
							title: 'Advanced',
							className: 'tab-advanced',
					},
				]}
				children={ showTab }
			/>

		</InspectorControls>

	);

}
