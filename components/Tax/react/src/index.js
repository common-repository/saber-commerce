import TaxEditor from './TaxEditor.js';
const { render, useState } = wp.element;

document.addEventListener( "DOMContentLoaded", function( event ) {

	const el = document.getElementById( 'sacom-tax-editor' );
	if( el ) {

		render( <TaxEditor />, document.getElementById( 'sacom-tax-editor' ) );

	}

});
