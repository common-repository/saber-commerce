import apiFetch from '@wordpress/api-fetch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default class TaxClassTable extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			rows: [],
			show: 1
		}

	}

	componentDidMount() {


	}

	componentDidUpdate( prevProps ) {


	}

	createData( id, key, title, description ) {
		return { id, key, title, description };
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
						<TableCell>Key</TableCell>
						<TableCell>Title</TableCell>
						<TableCell>Description</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{this.props.models.map(( row ) => (
						<TableRow key={row.name}>
							<TableCell component="th" scope="row">{row.key}</TableCell>
							<TableCell align="right">{row.title}</TableCell>
							<TableCell align="right">{row.description}</TableCell>
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
