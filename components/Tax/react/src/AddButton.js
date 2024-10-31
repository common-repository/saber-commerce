import Button from '@material-ui/core/Button';
import AddBoxSharpIcon from '@material-ui/icons/AddBoxSharp';

export default class AddButton extends React.Component {

	constructor( props ) {

		super( props );

	}

	render() {

		return (
			<Button
				variant="contained"
				color="action"
				startIcon={<AddBoxSharpIcon />}
				onClick={this.props.create}>Create New</Button>
		)

	}

}
