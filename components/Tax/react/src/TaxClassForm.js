import { Formik, Form, Field, ErrorMessage } from 'formik';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';

export default class TaxClassForm extends React.Component {

	constructor( props ) {

		super( props )

		this.handleSubmit = this.handleSubmit.bind( this );

		this.state = {
			show: this.props.show,
			mode: 'create',
			initialValues: {
				id: 0,
				key: '',
				title: '',
				description: ''
			}
		}

	}

	componentDidMount() {


	}

	componentDidUpdate( prevProps, prevState ) {

		if( this.props.show !== prevProps.show ) {

			this.setState({ show: this.props.show });

		}

		if( this.props.editObject === false && prevProps.editObject !== this.props.editObject ) {

			this.setState({
				mode: 'create',
				initialValues: {
					id: 0,
					key: '',
					title: '',
					description: ''
				}
			});

			return;

		}

		if( prevProps.editObject.id !== this.props.editObject.id ) {

			this.setState({
				mode: 'update',
				initialValues: {
					id: this.props.editObject.id,
					key: this.props.editObject.key,
					title: this.props.editObject.title,
					description: this.props.editObject.description
				}
			});

		}

	}

	handleSubmit( values ) {

		this.props.submit( this.state.mode, values );

	}

	render() {

		if( !this.state.show ) {

			return null;

		}

		return <Formik
			enableReinitialize={true}
			initialValues={this.state.initialValues}
			validate={values => {
				const errors = {};
				if (!values.title) {
					errors.title = 'Required';
				}
				return errors;
				}}
				onSubmit={ ( values, { setSubmitting } ) => {
					this.handleSubmit( values );
					setTimeout(() => {
						setSubmitting(false);
					}, 400);
				}}>

			 {({ isSubmitting }) => (
					<Form>
						<Field type="hidden" name="id" />
						<label for="title">Title</label>
						<Field type="text" name="title" placeholder="Enter a title (required)." />
						<ErrorMessage name="title" component="div" />
						<label for="key">Key</label>
						<Field type="text" name="key" placeholder="Enter a unique key (required)." />
						<label for="description">Description</label>
						<Field as="textarea" type="text" name="description" />
						<div>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								size="large"
								startIcon={<SaveIcon />}
								>SAVE</Button>
						</div>
						<div>
							<Button
								variant="contained"
								color="action"
								size="small"
								startIcon={<CloseIcon />}
								onClick={ () => { this.setState( { show: 0 } ); this.props.show = 0; } }
								>Cancel</Button>
						</div>
					</Form>
				)}
			</Formik>

	}

}
