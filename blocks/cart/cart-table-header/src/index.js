import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType( 'saber-commerce/cart-table-header', {
	edit: Edit,
	save,
	attributes: {
		padding: {
			type: 'object',
			default: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		},
		margin: {
			type: 'object',
			default: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		},
		borderType: {
			type: 'string',
			default: 'none'
		},
		borderWidth: {
			type: 'object',
			default: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		},
		borderColor: {
			type: 'string',
			default: '#777'
		},
		fontSize: {
			type: 'string'
		},
		fontWeight: {
			type: 'string'
		},
		fontFamily: {
			type: 'string'
		}
	}
} );
