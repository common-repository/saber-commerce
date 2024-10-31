import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

export default class EditButton extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			objectId: 0
		}

	}

	componentDidMount() {

		const objectId = ReactDOM.findDOMNode( this ).parentNode.getAttribute( 'object-id' );

		this.setState({
			objectId: objectId
		});

	}

	render() {

		return (
			<Button
				variant="contained"
				color="primary" 
				startIcon={<EditIcon />}
				onClick={ () => { this.props.edit( this.state.objectId ) } }>Edit</Button>
		)

	}

}
