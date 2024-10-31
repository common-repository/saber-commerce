import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import InspectorControlSet from './inspector-control-set.js';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {

	return (

		<div { ...useBlockProps() }>

			[[[ INSPECTOR_CONTROLS ]]]

			<div style={styles.main}>Styled Div</div>

		</div>

	);

}
