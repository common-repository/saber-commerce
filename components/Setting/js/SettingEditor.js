import Editor from '../../../js/Editor.js';
import SettingsMenu from './SettingsMenu.js';
import ToggleField from './ToggleField.js';

class SACOM_SettingEditor {

	constructor() {

		this.editor      = new Editor();
		this.rootElement = 'sacom-editor-setting';

		this.data = {
			settings: {}
		}

	}

	init() {

		this.renderPageHeader();
		this.renderGrid();
		this.renderMenu();
		this.renderAlerts();
		this.renderPages();
		this.renderSaveButton();
		this.settingMenuClickHandlers();
		this.saveButtonClickEvent();

		/* Init toggle field events. */
		const toggle = new ToggleField();
		toggle.events();

		/* Open the general settings tab default. */
		jQuery( '#sacom-sidenav_item_general' ).click();

	}

	renderSaveButton() {

		const saveButtonEl = document.createElement( 'button' );
		saveButtonEl.className = 'sacom-save-button';
		saveButtonEl.innerHTML = editorData.strings.save_uppercase;
		const parentEl = document.querySelector( '#sacom-setting-grid-second' ).appendChild( saveButtonEl );

	}

	saveButtonClickEvent() {

		jQuery( document ).on( 'click', '.sacom-save-button', function() {

			console.log( editorData );

			var vals = {}

			editorData.fields.forEach( function( field ) {

				vals[ field.id ] = jQuery( '#' + field.id ).val();

			});


			// Parse setting values.
			/* var vals = {
				stripe_enabled: jQuery( '#stripe_enabled' ).val(),
				stripe_mode: jQuery( '#stripe_mode' ).val(),
				stripe_test_publishable_key: jQuery( '#stripe_test_publishable_key' ).val(),
				stripe_test_secret_key: jQuery( '#stripe_test_secret_key' ).val(),
				stripe_live_publishable_key: jQuery( '#stripe_live_publishable_key' ).val(),
				stripe_live_secret_key: jQuery( '#stripe_live_secret_key' ).val(),
				timesheets_show_in_menu: jQuery( '#timesheets_show_in_menu' ).val(),
				invoices_show_in_menu: jQuery( '#invoices_show_in_menu' ).val(),
				company_name: jQuery( '#company_name' ).val(),
				address_line_1: jQuery( '#address_line_1' ).val(),
				address_line_2: jQuery( '#address_line_2' ).val(),
				address_city: jQuery( '#address_city' ).val(),
				address_state_province: jQuery( '#address_state_province' ).val(),
				address_country: jQuery( '#address_country' ).val(),
				address_zip_postal: jQuery( '#address_zip_postal' ).val(),
				currency_display_text: jQuery( '#currency_display_text' ).val(),
			}; */

			console.log( vals )

			// Scroll user up.
			jQuery( window ).scrollTop( 0 );

			// Show loading gif.
			var loaderImagePath = editorData.saberCommerceUrl + 'img/loading.gif';
			var loader = '<img style="max-width: 100%;" src="' + loaderImagePath + '"/>';
			jQuery( '#sacom-editor-alerts' ).html( loader );

			// Do save request.

			let data = {
				values: vals
			};

			wp.ajax.post( 'sacom_setting_save', data ).done( function( response ) {

				// Update stashed setting.
				SACOM_EditorInstance.data.settings = response.setting;

				// Show message.
				if( response.result === true ) {

					var message = '<div>';
					message += 'Changes saved successfully.';
					message += '</div>';


				} else {

					var message = '<div>';
					message += 'No changes were saved.';
					message += '</div>';

				}

				jQuery( '#sacom-editor-alerts' ).html( message );

			});

		});

	}

	settingMenuClickHandlers() {

		jQuery( document ).on( 'click', '.sacom-sidenav li', function() {

			let menuEl = jQuery( '.sacom-sidenav' );
			let currentItemEl = jQuery( this );

			// Set active class.
			menuEl.find( 'li.active' ).removeClass( 'active' );
			currentItemEl.addClass( 'active' );

			// Show the current target page.
			let target = currentItemEl.data( 'target' );
			jQuery( '.sacom-setting-page' ).hide();
			jQuery( '#sacom-settings-page-' + target ).show();

		});

	}

	renderMenu() {

		const el = document.createElement( 'ul' );
		el.className = 'sacom-sidenav';
		var menuEl = document.querySelector( '#sacom-setting-grid-first' ).appendChild( el );

		editorData.pages.forEach( function( page, index ) {

			var itemEl = document.createElement( 'li' );
			itemEl.id = 'sacom-sidenav_item_' + page.key;
			itemEl.innerHTML = page.menuLabel;
			itemEl.setAttribute( 'data-target', page.key );
			menuEl.appendChild( itemEl );

		});

		/* Add taxonomy management links. */
		var itemEl = document.createElement( 'li' );
		itemEl.innerHTML = 'Product Categories';
		menuEl.appendChild( itemEl );

	}

	renderAlerts() {

		const el = document.createElement( 'div' );
		el.id = 'sacom-editor-alerts';
		var menuEl = document.querySelector( '#sacom-setting-grid-first' ).appendChild( el );

	}

	renderPages() {

		editorData.pages.forEach( function( page, index ) {

			SACOM_EditorInstance.renderPage( page );

		});

	}

	renderPage( page ) {

		const pageWrapEl = document.createElement( 'div' );
		pageWrapEl.id = 'sacom-settings-page-' + page.key;
		pageWrapEl.className = 'sacom-setting-page';
		const parentEl = document.querySelector( '#sacom-setting-grid-second' ).appendChild( pageWrapEl );

		page.fields.forEach( field => {

			this.renderField( field, parentEl );

		});

	}

	renderField( field, parentEl ) {

		if( field.type === 'toggle' ) {

			// Add label.
			const labelEl = document.createElement( 'label' );
			labelEl.innerHTML = field.label;
			parentEl.appendChild( labelEl );

			// Make field.
			const toggleEl = this.makeFieldToggle( field );
			parentEl.appendChild( toggleEl );

			return;

		}

		if( field.type === 'text' ) {

			const fieldEl = document.createElement( 'div' );

			const labelEl = document.createElement( 'label' );
			labelEl.innerHTML = field.label;
			fieldEl.appendChild( labelEl );

			const inputEl = document.createElement( 'input' );
			inputEl.id = field.id;
			fieldEl.appendChild( inputEl );

			if( field.value ) {

				inputEl.value = field.value;

			}

			parentEl.appendChild( fieldEl );

		}

		if( field.type === 'html' ) {

			const fieldEl = document.createElement( 'div' );
			fieldEl.innerHTML = field.value;
			parentEl.appendChild( fieldEl );

		}

	}

	makeFieldToggle( field ) {

		const toggle = new ToggleField();

		var options = {
			id: field.id,
			label: field.label,
			value: field.value,
			default: field.default,
			choices: field.choices
		}

		const toggleField = toggle.render( options );
		return toggleField;

	}

	getRootElement() {

		return document.querySelector( this.getRootElementName() );

	}

	getRootElementName() {

		return this.rootElement;

	}

	renderGrid() {

		const gridEl = document.createElement('div');
		gridEl.id = 'sacom-setting-grid';

		const firstColEl = document.createElement('div');
		firstColEl.id = 'sacom-setting-grid-first';
		gridEl.appendChild( firstColEl );

		const secondColEl = document.createElement('div');
		secondColEl.id = 'sacom-setting-grid-second';
		gridEl.appendChild( secondColEl );

		this.getRootElement().appendChild( gridEl );

	}

	pageHeader() {

		const el = document.createElement('div');
		el.id = 'sacom-page-header';
		return el;

	}

	logo() {

		const el = document.createElement('div');
		el.id = 'sacom-header-logo';
		el.innerHTML = '<svg width="256" height="97" viewBox="0 0 256 97" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M88.476 68.434C85.624 68.434 83.0613 67.938 80.788 66.946C78.556 65.9127 76.7993 64.5073 75.518 62.73C74.2367 60.9113 73.5753 58.824 73.534 56.468H79.548C79.7547 58.4933 80.5813 60.2087 82.028 61.614C83.516 62.978 85.6653 63.66 88.476 63.66C91.1627 63.66 93.2707 62.9987 94.8 61.676C96.3707 60.312 97.156 58.576 97.156 56.468C97.156 54.8147 96.7013 53.4713 95.792 52.438C94.8827 51.4047 93.746 50.6193 92.382 50.082C91.018 49.5447 89.1787 48.966 86.864 48.346C84.012 47.602 81.718 46.858 79.982 46.114C78.2873 45.37 76.82 44.2127 75.58 42.642C74.3813 41.03 73.782 38.8807 73.782 36.194C73.782 33.838 74.3813 31.7507 75.58 29.932C76.7787 28.1133 78.4527 26.708 80.602 25.716C82.7927 24.724 85.2933 24.228 88.104 24.228C92.1547 24.228 95.4613 25.2407 98.024 27.266C100.628 29.2913 102.095 31.978 102.426 35.326H96.226C96.0193 33.6727 95.1513 32.226 93.622 30.986C92.0927 29.7047 90.0673 29.064 87.546 29.064C85.19 29.064 83.268 29.684 81.78 30.924C80.292 32.1227 79.548 33.8173 79.548 36.008C79.548 37.5787 79.982 38.86 80.85 39.852C81.7593 40.844 82.8547 41.6087 84.136 42.146C85.4587 42.642 87.298 43.2207 89.654 43.882C92.506 44.6673 94.8 45.4527 96.536 46.238C98.272 46.982 99.76 48.16 101 49.772C102.24 51.3427 102.86 53.492 102.86 56.22C102.86 58.328 102.302 60.312 101.186 62.172C100.07 64.032 98.4167 65.5407 96.226 66.698C94.0353 67.8553 91.452 68.434 88.476 68.434ZM136.707 58.39H117.859L114.387 68H108.435L124.059 25.034H130.569L146.131 68H140.179L136.707 58.39ZM135.095 53.802L127.283 31.978L119.471 53.802H135.095ZM174.578 45.742C176.149 45.99 177.575 46.6307 178.856 47.664C180.179 48.6973 181.212 49.9787 181.956 51.508C182.741 53.0373 183.134 54.67 183.134 56.406C183.134 58.5967 182.576 60.5807 181.46 62.358C180.344 64.094 178.711 65.4787 176.562 66.512C174.454 67.504 171.953 68 169.06 68H152.94V24.786H168.44C171.375 24.786 173.875 25.282 175.942 26.274C178.009 27.2247 179.559 28.5267 180.592 30.18C181.625 31.8333 182.142 33.6933 182.142 35.76C182.142 38.3227 181.439 40.4513 180.034 42.146C178.67 43.7993 176.851 44.998 174.578 45.742ZM158.582 43.448H168.068C170.713 43.448 172.759 42.828 174.206 41.588C175.653 40.348 176.376 38.6327 176.376 36.442C176.376 34.2513 175.653 32.536 174.206 31.296C172.759 30.056 170.672 29.436 167.944 29.436H158.582V43.448ZM168.564 63.35C171.375 63.35 173.565 62.6887 175.136 61.366C176.707 60.0433 177.492 58.204 177.492 55.848C177.492 53.4507 176.665 51.57 175.012 50.206C173.359 48.8007 171.147 48.098 168.378 48.098H158.582V63.35H168.564ZM196.605 29.374V43.82H212.353V48.47H196.605V63.35H214.213V68H190.963V24.724H214.213V29.374H196.605ZM245.505 68L235.213 50.33H228.393V68H222.751V24.786H236.701C239.966 24.786 242.715 25.344 244.947 26.46C247.22 27.576 248.915 29.0847 250.031 30.986C251.147 32.8873 251.705 35.0573 251.705 37.496C251.705 40.472 250.837 43.0967 249.101 45.37C247.406 47.6433 244.843 49.152 241.413 49.896L252.263 68H245.505ZM228.393 45.804H236.701C239.759 45.804 242.053 45.06 243.583 43.572C245.112 42.0427 245.877 40.0173 245.877 37.496C245.877 34.9333 245.112 32.9493 243.583 31.544C242.095 30.1387 239.801 29.436 236.701 29.436H228.393V45.804Z" fill="#716C53"/><path d="M115.946 80.322C115.946 78.826 116.283 77.484 116.958 76.296C117.633 75.0933 118.549 74.1547 119.708 73.48C120.881 72.8053 122.179 72.468 123.602 72.468C125.274 72.468 126.733 72.8713 127.98 73.678C129.227 74.4847 130.136 75.6287 130.708 77.11H128.31C127.885 76.186 127.269 75.4747 126.462 74.976C125.67 74.4773 124.717 74.228 123.602 74.228C122.531 74.228 121.571 74.4773 120.72 74.976C119.869 75.4747 119.202 76.186 118.718 77.11C118.234 78.0193 117.992 79.09 117.992 80.322C117.992 81.5393 118.234 82.61 118.718 83.534C119.202 84.4433 119.869 85.1473 120.72 85.646C121.571 86.1447 122.531 86.394 123.602 86.394C124.717 86.394 125.67 86.152 126.462 85.668C127.269 85.1693 127.885 84.458 128.31 83.534H130.708C130.136 85.0007 129.227 86.1373 127.98 86.944C126.733 87.736 125.274 88.132 123.602 88.132C122.179 88.132 120.881 87.802 119.708 87.142C118.549 86.4673 117.633 85.536 116.958 84.348C116.283 83.16 115.946 81.818 115.946 80.322ZM142.84 88.154C141.417 88.154 140.119 87.824 138.946 87.164C137.773 86.4893 136.841 85.558 136.152 84.37C135.477 83.1673 135.14 81.818 135.14 80.322C135.14 78.826 135.477 77.484 136.152 76.296C136.841 75.0933 137.773 74.162 138.946 73.502C140.119 72.8273 141.417 72.49 142.84 72.49C144.277 72.49 145.583 72.8273 146.756 73.502C147.929 74.162 148.853 75.086 149.528 76.274C150.203 77.462 150.54 78.8113 150.54 80.322C150.54 81.8327 150.203 83.182 149.528 84.37C148.853 85.558 147.929 86.4893 146.756 87.164C145.583 87.824 144.277 88.154 142.84 88.154ZM142.84 86.416C143.911 86.416 144.871 86.1667 145.722 85.668C146.587 85.1693 147.262 84.458 147.746 83.534C148.245 82.61 148.494 81.5393 148.494 80.322C148.494 79.09 148.245 78.0193 147.746 77.11C147.262 76.186 146.595 75.4747 145.744 74.976C144.893 74.4773 143.925 74.228 142.84 74.228C141.755 74.228 140.787 74.4773 139.936 74.976C139.085 75.4747 138.411 76.186 137.912 77.11C137.428 78.0193 137.186 79.09 137.186 80.322C137.186 81.5393 137.428 82.61 137.912 83.534C138.411 84.458 139.085 85.1693 139.936 85.668C140.801 86.1667 141.769 86.416 142.84 86.416ZM170.937 72.776V88H168.935V76.648L163.875 88H162.467L157.385 76.626V88H155.383V72.776H157.539L163.171 85.36L168.803 72.776H170.937ZM192.086 72.776V88H190.084V76.648L185.024 88H183.616L178.534 76.626V88H176.532V72.776H178.688L184.32 85.36L189.952 72.776H192.086ZM199.684 74.294V79.42H205.272V81.07H199.684V86.35H205.932V88H197.682V72.644H205.932V74.294H199.684ZM219.235 88L215.583 81.73H213.163V88H211.161V72.666H216.111C217.269 72.666 218.245 72.864 219.037 73.26C219.843 73.656 220.445 74.1913 220.841 74.866C221.237 75.5407 221.435 76.3107 221.435 77.176C221.435 78.232 221.127 79.1633 220.511 79.97C219.909 80.7767 219 81.312 217.783 81.576L221.633 88H219.235ZM213.163 80.124H216.111C217.196 80.124 218.01 79.86 218.553 79.332C219.095 78.7893 219.367 78.0707 219.367 77.176C219.367 76.2667 219.095 75.5627 218.553 75.064C218.025 74.5653 217.211 74.316 216.111 74.316H213.163V80.124ZM225.998 80.322C225.998 78.826 226.335 77.484 227.01 76.296C227.684 75.0933 228.601 74.1547 229.76 73.48C230.933 72.8053 232.231 72.468 233.654 72.468C235.326 72.468 236.785 72.8713 238.032 73.678C239.278 74.4847 240.188 75.6287 240.76 77.11H238.362C237.936 76.186 237.32 75.4747 236.514 74.976C235.722 74.4773 234.768 74.228 233.654 74.228C232.583 74.228 231.622 74.4773 230.772 74.976C229.921 75.4747 229.254 76.186 228.77 77.11C228.286 78.0193 228.044 79.09 228.044 80.322C228.044 81.5393 228.286 82.61 228.77 83.534C229.254 84.4433 229.921 85.1473 230.772 85.646C231.622 86.1447 232.583 86.394 233.654 86.394C234.768 86.394 235.722 86.152 236.514 85.668C237.32 85.1693 237.936 84.458 238.362 83.534H240.76C240.188 85.0007 239.278 86.1373 238.032 86.944C236.785 87.736 235.326 88.132 233.654 88.132C232.231 88.132 230.933 87.802 229.76 87.142C228.601 86.4673 227.684 85.536 227.01 84.348C226.335 83.16 225.998 81.818 225.998 80.322ZM247.942 74.294V79.42H253.53V81.07H247.942V86.35H254.19V88H245.94V72.644H254.19V74.294H247.942Z" fill="#BDBDBD"/><path d="M54.4375 43.7083C47.5002 43.7083 41.875 49.3335 41.875 56.2708C41.875 63.2081 47.5002 68.8333 54.4375 68.8333C61.3748 68.8333 67 63.2081 67 56.2708C67 49.3335 61.3748 43.7083 54.4375 43.7083ZM53.1282 61.8095L48.4159 57.2395L50.3589 55.2937L53.1254 57.9179L59.0326 51.8628L60.9756 53.8058L53.1282 61.8095ZM11.1667 54.875H25.125V57.6667H11.1667V54.875ZM33.5 52.0833H11.1667V49.2917H33.5V52.0833ZM37.6931 63.25H6.97917C6.20867 63.25 5.58333 62.6247 5.58333 61.8542V43.7083H41.3725C44.6778 40.2746 49.3064 38.125 54.4375 38.125C56.9109 38.125 59.2643 38.6247 61.4167 39.5236V29.75C61.4167 26.668 58.9153 24.1667 55.8333 24.1667H5.58333C2.50133 24.1667 0 26.668 0 29.75V63.25C0 66.332 2.50133 68.8333 5.58333 68.8333H41.3725C39.8287 67.2253 38.5641 65.341 37.6931 63.25ZM5.58333 31.1458C5.58333 30.3753 6.20867 29.75 6.97917 29.75H54.4375C55.208 29.75 55.8333 30.3753 55.8333 31.1458V35.3333H5.58333V31.1458Z" fill="#2271B1"/></svg>';
		return el;

	}

	subheader() {

		const el = document.createElement('div');
		el.id = 'sacom-page-subheader';
		return el;

	}

	breadcrumbs() {

		const el = document.createElement('div');
		el.className = 'sacom-breadcrumbs';
		el.innerHTML = '<a href="admin.php?page=sacom">';
		el.innerHTML += editorData.strings.dashboard_uppercase;
		el.innerHTML += '</a>';
		el.innerHTML += ' / ';
		el.innerHTML += this.pageTitleUppercase();
		el.innerHTML += '</div>';
		return el;

	}

	pageTitleUppercase() {

		return editorData.strings.settings_uppercase;

	}

	renderPageHeader() {

		// Build header.
		let pageHeader = this.pageHeader();
		let logo = this.logo();
		pageHeader.appendChild( logo );
		this.getRootElement().appendChild( pageHeader );

		// Build subheader.
		let subheader = this.subheader();
		let breadcrumbs = this.breadcrumbs();
		subheader.appendChild( breadcrumbs );
		this.getRootElement().appendChild( subheader );

	}

	objectListContainer() {

		const el = document.createElement('div');
		el.id = 'sacom-object-list';
		return el;

	}

}

// New ES6 version.
var SACOM_EditorInstance = new SACOM_SettingEditor();
SACOM_EditorInstance.init();
