import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import InspectorControlSet from './inspector-control-set.js';
import { Fragment } from '@wordpress/element';
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

		<Fragment>

			<InspectorControlSet
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>

			<tfoot { ...useBlockProps() }>

				<tr style={styles.main}>
					<td colspan={4}>
						<div className="cart-table-footer-grid">
							<div>
								<button class="btn-secondary btn-disabled" disabled={true}>APPLY COUPON</button>
							</div>
							<div>
								<button class="scm-cart-update-button" style={styles.primaryButton}>
									UPDATE CART
								</button>
							</div>
						</div>
					</td>
				</tr>
			</tfoot>

		</Fragment>

	);
}
