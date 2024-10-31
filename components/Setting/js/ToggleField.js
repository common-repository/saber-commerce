export default class ToggleField {

	render( options ) {

		// Use default value if no value passed.

		console.log( options )

		if( options.value === undefined || options.value === null ) {

			console.log('undefined...')

			options.value = options.default;
		}

		console.log( options.value )

		const el = document.createElement( 'div' );
		el.className = 'sacom-setting-toggle';

		// Loop over choices.
		jQuery.each( options.choices, function( index, choice ) {

			const choiceEl = document.createElement( 'div' );
			choiceEl.setAttribute( 'data-value', choice.value );

			if( choice.value == options.value ) {
				choiceEl.className = 'toggle-option selected';
			} else {
				choiceEl.className = 'toggle-option';
			}

			choiceEl.innerHTML = choice.label;
			el.appendChild( choiceEl );

		});

		// Value storage hidden input.
		const inputEl = document.createElement( 'input' );
		inputEl.id = options.id;
		inputEl.type = 'hidden';
		inputEl.value = options.value;
		el.appendChild( inputEl );

		return el;

	}

	events() {

		jQuery( document ).on( 'click', '.sacom-setting-toggle > div.toggle-option', function() {

			let toggleOptionEl = jQuery( this );
			let toggleEl = toggleOptionEl.parents( '.sacom-setting-toggle' );
			let currentValue = toggleOptionEl.attr( 'data-value' );
			toggleEl.find( '.selected' ).removeClass( 'selected' );
			toggleOptionEl.addClass( 'selected' );
			toggleEl.find('input').val( currentValue );

		});

	}

}
