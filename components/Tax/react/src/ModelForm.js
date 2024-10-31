import ModelFormRender from './ModelFormRender.js';

export default class ModelForm extends React.Component {

	constructor( props ) {

		super( props )

		this.handleSubmit = this.handleSubmit.bind( this );

		const initialValues = this.buildFormInitialValues();

		console.log( initialValues )

		this.state = {
			show: this.props.show,
			mode: 'create',
			initialValues: initialValues
		}

		// Map this to callbacks.
		this.validator = this.validator.bind(this);
		this.cancel = this.cancel.bind(this);


	}

	componentDidMount() {


	}

	componentDidUpdate( prevProps, prevState ) {

		console.log( this.props )

		if( this.props.show !== prevProps.show ) {

			this.setState({ show: this.props.show });

		}

		if( this.props.editObject === false && prevProps.editObject !== this.props.editObject ) {

			const initialValues = this.buildFormInitialValues();

			this.setState({
				mode: 'create',
				initialValues: initialValues
			});

			return;

		}

		if( prevProps.editObject.id !== this.props.editObject.id ) {

			const initialValues = this.parseValuesFromEditObject();

			this.setState({
				mode: 'update',
				initialValues: initialValues
			});

		}

	}

	parseValuesFromEditObject() {

		const vals = {}
		const editObject = this.props.editObject;

		this.props.modelDefinition.fields.map( function( field ) {

			vals[ field.key ] = editObject[ field.key ];

		});

		return vals;

	}

	buildFormInitialValues() {

		const vals = {}

		this.props.modelDefinition.fields.map( function( field ) {

			vals[ field.key ] = '';

		});

		return vals;

	}

	handleSubmit( values ) {

		console.log('handleSubmit in ModelForm.js')
		console.log( values )

		this.props.onSubmit( this.state.mode, values );

	}

	validator( values ) {

		const errors = {};

		/* Validate for required fields. */
		this.props.modelDefinition.fields.map( function( field ) {

			if( field.required !== undefined && field.required === true ) {

				// Check if value exists for the required field.
				if ( !values[ field.key ] ) {
					errors[ field.key ] = 'Required';
				}

			}

		});

		return errors;

	}

	cancel() {

		this.props.onCancel();

	}

	render() {

		if( !this.state.show ) {

			return null;

		}

		return (
			<ModelFormRender
				show={this.state.show}
				submit={this.handleSubmit}
				cancel={this.cancel}
				modelDefinition={this.props.modelDefinition}
				modelData={this.props.modelData}
			/>
		)

	}

}
