import Button from '@material-ui/core/Button';

export default class PortalTableViewButton extends React.Component {

	constructor( props ) {

		super(props);

		this.clickHandler = this.clickHandler.bind( this );

	}

	clickHandler() {

		this.props.viewObject( this.props.objectId, this.props.modelKey );

	}

	render() {

		return(
			<Button onClick={this.clickHandler}>View</Button>
		)

	}

}
