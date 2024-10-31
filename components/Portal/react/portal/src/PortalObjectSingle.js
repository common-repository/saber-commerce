import { withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class PortalObjectSingle extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			model: null
		}

	}

	componentDidMount() {



	}

	parseModelDataFromSection( section, id ) {

		let match = false;

		section.data.models.forEach( model => {
			if( model.id == id ) {
				match = model;
			}
		});

		return match;

	}

	renderPageTitle() {

		return(
			<h2>{this.props.section.title} View</h2>
		)

	}

	renderDataTable() {

		const { classes, section, id } = this.props;
		const model = this.parseModelDataFromSection( section, id );

		return(
			<TableContainer component={Paper}>
				<Table className={classes.portalObjectSingleTable} aria-label="object single table">
					<TableHead>
						<TableRow>
							<TableCell component="th" scope="row">
								Field
							</TableCell>
							<TableCell component="th" scope="row">
								Data
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{section.data.modelDefinition.fields.map((field) => (
							<TableRow>
								<TableCell component="td" scope="row">
									{field.label}
								</TableCell>
								<TableCell component="td" scope="row">
									{model[field.propertyKey]}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		)

	}

	render() {

		console.log( this.props.section )

		const model = this.parseModelDataFromSection( this.props.section, this.props.id );

		console.log( model )

		const { classes } = this.props;

		return(

			<div class={classes.portalObjectSingle}>
				{this.renderPageTitle()}
				{this.renderDataTable()}
			</div>
		);

	}

}

const styles = {
	portalObjectSingle: {}
}

export default withStyles( styles )( PortalObjectSingle );
