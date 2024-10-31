import apiFetch from '@wordpress/api-fetch';

import AddButton from './AddButton.js';
import EditButton from './EditButton.js';
import DeleteButton from './DeleteButton.js';
import ModelForm from './ModelForm.js';
import ModelTable from './ModelTable.js';

export default class ModelEditor extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {

			mode: 'view',

			/* modelKey, example: "tax_rate" or "invoice". */
			modelKey: this.props.modelKey,

			editObject: false,
			models: [],
			modelsObject: {},
			modelsLoaded: 1,
			formShow: 0,
			tableNeedsRefresh: 0

		}

		/* Function this bindings. */
		this.createInit = this.createInit.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.processDelete = this.processDelete.bind(this);
		this.startEdit = this.startEdit.bind(this);

	}

	componentDidMount() {

		this.fetchData();
		this.fetchModels();

	}

	componentDidUpdate( prevProps, prevState ) {

		if( this.state.editObjectId !== prevState.editObjectId ) {

			if( this.state.mode === 'edit' && this.state.modelsLoaded === 1 ) {

				const editObject = this.state.modelsObject[ this.state.editObjectId ];
				this.setState( { editObject: editObject } );

			}

		}

	}

	apiPathBase() {

		return '/sacom/v1/'

	}

	fetchModels() {

		apiFetch( { path: this.apiPathBase() + 'tax-class' } )
			.then( ( response ) => {

				const models = response[ 'tax_class' ];
				const modelsObject = {}

				// Index the objects by id for fast lookup.
				models.forEach( model => {
					modelsObject[ model.id ] = model;
				});

				this.setState({
					modelData: {
						tax_class: {
							models: models,
							modelsObject: modelsObject,
							modelsLoaded: 1
						}
					}
				});

		});

	}

	fetchData() {

		apiFetch( { path: this.apiPathBase() + 'tax-rate' } )
			.then( ( response ) => {

				const models = response[ this.state.modelKey ];
				const modelsObject = {}

				// Index the objects by id for fast lookup.
				models.forEach( model => {
					modelsObject[ model.id ] = model;
				});

				this.setState({
					models: models,
					modelsObject: modelsObject,
					modelsLoaded: 1
				});

		});

	}

	createInit() {

		this.setState({
			mode: 'create',
			editObject: false,
			formShow: 1
		});

	}

	onCancel() {

		this.setState({formShow: 0});

	}

	onSubmit( type, values ) {

		const req = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}

		if( type === 'create' ) {
			req.path = this.apiPathBase() + 'tax-rate';
			req.method = 'POST';
		} else {
			req.path = this.apiPathBase() + 'tax-rate/' + this.state.editObject.id;
			req.method = 'PUT';
		}

		const reqBody = {}

		this.props.modelDefinition.fields.map( function( field ) {

			reqBody[ field.key ] = values[ field.key ];

		});

		console.log( reqBody )

		req.body = JSON.stringify( reqBody );

		apiFetch( req ).then( ( response ) => {

			this.fetchData();
			this.refreshTable();

		});

	}

	processDelete( objectId ) {

		apiFetch( {
			path: this.apiPathBase() + 'tax-rate/' + objectId,
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then( ( response ) => {

			this.fetchData();
			this.refreshTable();

		});

	}

	startEdit( id ) {

		this.setState({
			mode: 'edit',
			editObjectId: id,
			formShow: 1
		});

	}

	refreshTable() {

		this.setState( { tableNeedsRefresh: 1 } );

	}

	render() {

		return (

			<div class="sacom-model-editor">
				<header>
					<h3>{this.props.modelTitle}</h3>
					<AddButton create={this.createInit} />
				</header>
				<article>
					<ModelForm
						show={this.state.formShow}
						editObject={this.state.editObject}
						onSubmit={this.onSubmit}
						onCancel={this.onCancel}
						modelDefinition={this.props.modelDefinition}
						modelData={this.state.modelData}
					/>
				</article>
				<article>
					<ModelTable
						refresh={this.state.tableNeedsRefresh}
						models={this.state.models}
						deleteButton={<DeleteButton processDelete={this.processDelete} />}
						editButton={<EditButton edit={this.startEdit} />}
						modelDefinition={this.props.modelDefinition}
					/>
				</article>
			</div>

		)

	}



}
