import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	return (
		<div { ...useBlockProps.save() }>
			<form class="scm-checkout-form">
				<div class="scm-checkout-form-field-group scm-checkout-form-field-group-first-name">
					<label for="scm-checkout-form-field-first-name">
						{ __( 'First Name', 'saber-commerce') }
					</label>
					<input name="scm-checkout-form-field-first-name" id="scm-checkout-form-field-first-name" type="text" />
				</div>
				<div class="scm-checkout-form-field-group scm-checkout-form-field-group-first-name">
					<label for="scm-checkout-form-field-first-name">
						{ __( 'Last Name', 'saber-commerce') }
					</label>
					<input name="scm-checkout-form-field-first-name" id="scm-checkout-form-field-first-name" type="text" />
				</div>
				<div class="scm-checkout-form-field-group scm-checkout-form-field-group-company-name">
					<label for="scm-checkout-form-field-company-name">
						{ __( 'Company Name', 'saber-commerce') }
					</label>
					<input name="scm-checkout-form-field-company-name" id="scm-checkout-form-field-company-name" type="text" />
				</div>
			</form>
		</div>
	);
}
