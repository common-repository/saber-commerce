import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

export default class DeleteButton extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			objectId: 0,
			open: false
		}

	}

	componentDidMount() {

		const objectId = ReactDOM.findDOMNode( this ).parentNode.getAttribute( 'object-id' );

		this.setState({
			objectId: objectId
		});

		this.closeHandler = this.closeHandler.bind( this );
		this.openHandler = this.openHandler.bind( this );
		this.confirm = this.confirm.bind( this );


	}

	confirm() {

		this.openHandler();

	}

	closeHandler() {

		this.setState( {open: false} );

	}

	openHandler() {

		this.setState( {open: true} );

	}

	render() {

		return (
			<React.Fragment>
				<Button
					variant="contained"
					color="secondary"
					startIcon={<DeleteForeverIcon />}
					onClick={this.confirm}>Delete</Button>
				<Dialog aria-labelledby="confirm-deletion-title" open={this.state.open}>
					<DialogTitle id="confirm-deletion-title">Confirm Deletion</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-slide-description">
							Confirm that you want to delete this object. Note that it will be gone forever.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.closeHandler} color="primary">
							Cancel
						</Button>
						<Button onClick={ () => { this.closeHandler(); this.props.processDelete( this.state.objectId ) } } color="primary">
							Confirm Delete
						</Button>
					 </DialogActions>
				</Dialog>
			</React.Fragment>
		)

	}

}
