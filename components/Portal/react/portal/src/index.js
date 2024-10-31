import Portal from './Portal.js';
const { render, useState } = wp.element;

document.addEventListener( "DOMContentLoaded", function( event ) {

	const el = document.getElementById( 'sacom-portal' );

	console.log( SACOM_PortalData );

	if( el ) {

		render( <Portal />, el );

	}

});
