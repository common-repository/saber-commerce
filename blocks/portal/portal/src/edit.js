import { __ } from '@wordpress/i18n';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {

	const TEMPLATE = [
		[ 'saber-commerce/portal-menu', {} ],
		[ 'saber-commerce/portal-body', {} ],
	];

	return (
		<div { ...useBlockProps() }>
			<h1>
				{ __( 'ACCOUNT', 'saber-commerce' ) }
			</h1>
			<div class="portal-grid">
				<InnerBlocks
					template={TEMPLATE}
					templateLock="all"
				/>
			</div>
		</div>
	);
}
