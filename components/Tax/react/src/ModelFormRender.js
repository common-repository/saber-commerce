import { useForm, setValue } from "react-hook-form";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import Select from "react-select";

export default function App( props ) {

	const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
	const onSubmit = values => {

		props.submit( values );

	}

	const handleChange = ( value ) => {

		setValue( 'id_tax_class', value.value )
		return value;

	}

	const fields = () => {

		const f = [];

		props.modelDefinition.fields.map( (field) => {

			f.push( <label for={field.key}>{field.label}</label> );

			if( field.type === 'select' ) {

				const choices = [];

				if( Array.isArray( field.choices ) ) {

					// Static choices.
					choices = field.choices;

				} else {

					// Dynamic choices.
					const modelKey = field.choices.model;

					if( props.modelData[modelKey].modelsLoaded ) {

						const models = props.modelData[modelKey].models;
						models.map( ( model ) => {
							choices.push({
								label: model.title,
								value: model.id
							});
						});

					} else {

						choices = [
							{
								label: 'No options available yet.',
								value: 0
							}
						]
					}

				}

				f.push( <Select options={choices} name={field.key} {...register( field.key )} onChange={handleChange} /> );

			} else {

				f.push( <input type={field.type} name={field.key} {...register( field.key )} placeholder={field.placeholder} /> );

			}

		});

		return f;

	}

	console.log( 81 )
	console.log( props.show )

	if( props.show == 0 ) {

		return <div>Hiddeninger</div>

	} else {

		return (

			<form onSubmit={handleSubmit(onSubmit)}>

				{fields()}

				{errors.exampleRequired && <span>This field is required</span>}

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
						onClick={props.cancel}
						>Cancel</Button>
				</div>

				</form>
		);

	}



}
