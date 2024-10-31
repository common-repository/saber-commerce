import apiFetch from '@wordpress/api-fetch';

/* Shared Components */
import TaxEditorTabs from './TaxEditorTabs.js';
import ModelEditor from './ModelEditor.js';
import AddButton from './AddButton.js';
import EditButton from './EditButton.js';
import DeleteButton from './DeleteButton.js';

/* Tax Class Components */
import TaxClassForm from './TaxClassForm.js';
import TaxClassTable from './TaxClassTable.js';

export default class TaxEditor extends React.Component {

	constructor( props ) {

		super( props );

		this.createTaxClass = this.createTaxClass.bind(this);

		this.state = {
			mode: 'view',
			tableNeedsRefresh: 1,
			modelsLoaded: 0,
			modelsObject: {},
			models: [],
			editObject: {
				key: '',
				title: '',
				description: ''
			},
			formShow: 0,
			rates: {
				mode: 'view',
				editObjectId: 0,
				editObject: false,
				formShow: 0
			}
		}

		this.createStart = this.createStart.bind(this);
		this.startEdit = this.startEdit.bind(this);
		this.refreshed = this.refreshed.bind(this);
		this.processDelete = this.processDelete.bind( this );
		this.submit = this.submit.bind( this );
		this.afterTaxClassCreated = this.afterTaxClassCreated.bind( this );

	}

	apiPathBase() {

		return '/sacom/v1/'

	}

	componentDidMount() {

		this.fetchTaxClassData();

	}

	componentDidUpdate( prevProps, prevState ) {

		if( this.state.editObjectId !== prevState.editObjectId ) {

			if( this.state.mode === 'edit' && this.state.modelsLoaded === 1 ) {

				const editObject = this.state.modelsObject[ this.state.editObjectId ];
				this.setState( { editObject: editObject } );

			}

		}

	}

	refreshTable() {

		this.setState( { tableNeedsRefresh: 1 } );

	}

	refreshed() {

		this.setState( { tableNeedsRefresh: 0 } );

	}

	startEdit( id ) {

		this.setState({
			mode: 'edit',
			editObjectId: id,
			formShow: 1
		});

	}

	createStart() {

		this.setState({
			mode: 'create',
			editObjectId: 0,
			editObject: false,
			formShow: 1
		});

	}

	createTaxClass() {

		this.refreshTable();

	}

	fetchTaxClassData() {

		apiFetch( { path: this.apiPathBase() + 'tax-class' } )
			.then( ( response ) => {

				const models = response.tax_class;
				const modelsObject = {}

				// Index the objects by id for fast lookup.
				models.forEach( model => {
					modelsObject[ model.id ] = model;
				});

				this.setState( { models: models } );
				this.setState( { modelsObject: modelsObject } );
				this.setState( { modelsLoaded: 1 } );

		});

	}

	processDelete( objectId ) {

		apiFetch( {
			path: this.apiPathBase() + 'tax-class/' + objectId,
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then( ( response ) => {

			this.afterTaxClassDeleted();

		});

	}

	afterTaxClassDeleted() {

		this.fetchTaxClassData();
		this.refreshTable();

	}

	afterTaxClassCreated() {

		this.fetchTaxClassData();
		this.refreshTable();

	}

	submit( type, values ) {

		if( type === 'create' ) {

			apiFetch( {
				path: this.apiPathBase() + 'tax-class',
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(
					{
						key: values.key,
						title: values.title,
						description: values.description
					}
				)
			}).then( ( response ) => {

				this.afterTaxClassCreated();

			});

		}

		if( type === 'update' ) {

			apiFetch( {
				path: this.apiPathBase() + 'tax-class/' + this.props.editObject.id,
				method: 'PUT',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(
					{
						key: values.key,
						title: values.title,
						description: values.description
					}
				)
			}).then( ( response ) => {

				this.afterTaxClassCreated();

			});

		}

	}

	taxClassPanelJsx() {

		return <React.Fragment>
			<header>
				<h3>Tax Classes</h3>
				<AddButton create={this.createStart} />
			</header>
			<article>
				<TaxClassForm
					show={this.state.formShow}
					onCreate={this.createTaxClass}
					editObject={this.state.editObject}
					submit={this.submit}
					/>
			</article>
			<article>
				<TaxClassTable
					refresh={this.state.tableNeedsRefresh}
					refreshed={this.refreshed}
					models={this.state.models}
					deleteButton={<DeleteButton processDelete={this.processDelete} />}
					editButton={<EditButton edit={this.startEdit} />}
				/>
			</article>
		</React.Fragment>

	}

	render() {

		return (
			<div class="sacom-dashboard-widget sacom-widget-cart-report">
				<main>
					<TaxEditorTabs
						taxRatePanel={
							<ModelEditor
								modelKey="tax_rate"
								modelTitle="Tax Rates"
								modelDefinition={{
									key: "tax_rate",
									relations: [
										{
											model: 'tax_class',
											type: 'child'
										}
									],
									fields: [
										{
											key: 'id_tax_class',
											type: 'select',
											choices: {
												model: 'tax_class'
											},
											label: 'Tax Class ID',
											table: 1
										},
										{
											key: 'title',
											type: 'text',
											label: 'Title',
											placeholder: 'Enter a title.',
											table: 1,
											required: true
										},
										{
											key: 'country',
											type: 'text',
											label: 'Country',
											table: 1,
											placeholder: 'Enter the country (optional).'
										},
										{
											key: 'state',
											type: 'text',
											label: 'State',
											placeholder: 'Enter the state (optional).'
										},
										{
											key: 'city',
											type: 'text',
											label: 'City',
											placeholder: 'Enter the city (optional).'
										},
										{
											key: 'zipcode',
											type: 'text',
											label: 'Zip or Postal Code',
											placeholder: 'Enter the zip or postal code (optional).'
										},
										{
											key: 'rate',
											type: 'text',
											label: 'Rate (%)',
											placeholder: 'Enter the tax rate as a percentage (%).',
											table: 1,
											required: true
										},
										{
											key: 'compound',
											type: 'text',
											label: 'Compound',
											placeholder: 'Calculate taxes using the compound method?'
										},
										{
											key: 'shipping',
											type: 'text',
											label: 'Shipping',
											placeholder: 'Apply this tax to shipping?'
										},
										{
											key: 'priority',
											type: 'text',
											label: 'Priority',
											placeholder: 'Set a numeric priority for this tax rate. (optional)'
										}
									]
								}}
							/>
						}
						taxClassPanel={this.taxClassPanelJsx()}
					/>
				</main>
			</div>
		);

	}

}
