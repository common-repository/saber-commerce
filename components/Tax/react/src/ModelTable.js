import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default class ModelTable extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			show: 1
		}

	}

	headCells() {

		const cells = [];

		this.props.modelDefinition.fields.map( function( field ) {
			if( field.table !== undefined && field.table === 1 ) {
				cells.push( <TableCell>{field.label}</TableCell> );
			}
		});

		return cells;

	}

	rowCells( row ) {

		const cells = [];

		this.props.modelDefinition.fields.map( function( field ) {
			if( field.table !== undefined && field.table === 1 ) {
				cells.push( <TableCell>{row[field.key]}</TableCell> );
			}
		});

		return cells;

	}

	render() {

		if( !this.props.models ) {

			return 'Loading...';

		}

		return (
			<TableContainer>
				<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						{this.headCells()}
						<TableCell>&nbsp;</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{this.props.models.map(( row ) => (
						<TableRow>
							{this.rowCells( row )}
							<TableCell object-id={row.id}>
								{this.props.editButton}
								{this.props.deleteButton}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
				</Table>
			</TableContainer>
		);

	}

}
