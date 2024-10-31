import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType( 'saber-commerce/cart-item-row', {
	edit: Edit,
	save,
} );
