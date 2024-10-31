import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';

registerBlockType( 'saber-commerce/add-to-cart', {
	edit: Edit,
	save,
	attributes: {

	}
});
