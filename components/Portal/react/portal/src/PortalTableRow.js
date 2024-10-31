import TableRow from '@material-ui/core/TableRow';

export default class PortalTableRow extends React.Component {

	constructor( props ) {

		super(props);

		this.clickHandler = this.clickHandler.bind( this );

	}

	clickHandler() {

		console.log('click handling row...')

		this.props.viewObject( this.props.objectId, this.props.modelKey );

	}

	render() {

		return(
			<TableRow onClick={this.clickHandler}>
				{this.props.children}
			</TableRow>
		)

	}

}
