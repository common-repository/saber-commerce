import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType( 'saber-commerce/product-data', {
	edit: Edit,
	save,
	attributes: {
		sku: {
			type: 'string'
		},
		description: {
			type: 'string'
		},
		price: {
			type: 'string'
		}
	}
} );
