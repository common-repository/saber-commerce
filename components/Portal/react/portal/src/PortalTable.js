import { withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PortalTableRow from './PortalTableRow.js';
import PortalTableViewButton from './PortalTableViewButton.js';

class PortalTable extends React.Component {

	constructor( props ) {

		super(props);

		this.state = {
			rows: []
		}

	}

	tableRenderFields() {

		let renderFields = [];
		this.props.modelDefinition.fields.map( function( field ) {

			console.log( field );
			if( field.portalTableDisplay !== undefined && field.portalTableDisplay > 0 ) {
				renderFields.push( field );
			}

		});

		return renderFields;

	}

	render() {

		const { classes } = this.props;

		return(
			<TableContainer component={Paper}>
				<Table className={classes.portalTable} aria-label="simple table">
					<TableHead>
						<TableRow>
							{this.tableRenderFields().map((field) => (
								<TableCell component="th" scope="row">
									{field.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.models.map((row) => (
							<PortalTableRow
								key={row.title}
								viewObject={this.props.viewObject}
								objectId={row.id}
								modelKey={this.props.modelDefinition.key}
							>
								{this.tableRenderFields().map((field) => (
									<TableCell component="td" scope="row">
										{row[field.propertyKey]}
									</TableCell>
								))}
							</PortalTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		);

	}

}

const styles = {
	portalTable: {
		backgroundColor: '#F8F8F8',
		'& th': {
			backgroundColor: '#D6D6D6',
		}
	}
}

export default withStyles( styles )( PortalTable );
