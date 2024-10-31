import CartReport from './CartReport.js';

const { render, useState } = wp.element;

const el = document.getElementById( 'react-app' );

if( el ) {

	render( <CartReport />, document.getElementById( 'react-app' ) );

}
