import { withStyles } from "@material-ui/core/styles";
import PortalTable from './PortalTable.js';
import PortalQuote from './PortalQuote.js';
import PortalDashboard from './PortalDashboard.js';
import PortalPageProfile from './PortalPageProfile.js';
import PortalLoginForm from './PortalLoginForm.js';
import PortalObjectSingle from './PortalObjectSingle.js';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';

class PortalBody extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			section: {
				title: "No section loaded."
			}
		}

	}

	componentDidMount() {



	}

	componentDidUpdate( prevProps, prevState ) {


	}

	renderRoute( route ) {

		switch( route.callback ) {

			case 'MODEL_COLLECTION':
				return this.renderObjectTable();
				break;

			case 'MODEL_SINGLE':
				return this.renderObjectSingle( route );
				break;

			default:
				return this[route.callback]();
				break;

		}

	}

	/* Render callbacks. */

	renderLogin() {

		return(
			<PortalLoginForm
				loginSuccess={this.props.loginSuccess}
			/>
		)

	}

	renderSplash() {

		const { classes } = this.props;

		return(
			<Grid className={classes.portalBodyGrid} container spacing={2}>
				<PortalQuote />
				{this.props.loginButton}
			</Grid>
		)

	}

	renderDashboard() {

		return (
			<PortalDashboard doRouting={this.props.doRouting} />
		);

	}

	renderProfile() {

		const { classes } = this.props;

		console.log( SACOM_PortalData.data )

		return(
			<PortalPageProfile
				accountName={SACOM_PortalData.data.account.title}
				displayName={SACOM_PortalData.data.user.data.display_name}
			/>
		)

	}

	renderInvalidRoute() {

		return( <h1>404 - Invalid Route...</h1> );

	}

	renderObjectTable() {

		const { classes } = this.props;

		return(
			<Grid container>
				<Grid item xs={12}>
					<PortalTable
						models={this.props.route.section.data.models}
						modelDefinition={this.props.route.section.data.modelDefinition}
						viewObject={this.props.viewObject}
					/>
				</Grid>
			</Grid>
		)

	}

	renderObjectSingle( route ) {

		console.log( route )

		const { classes } = this.props;

		return(
			<Grid className={classes.portalBodyGrid} container spacing={2}>
				<Grid item xs={12}>
					<PortalObjectSingle
						type={route.section.key}
						section={route.section}
						id={route.request.objectId}
					/>
				</Grid>
			</Grid>
		)

	}

	render() {

		const { classes } = this.props;

		if( this.props.route ) {
			return this.renderRoute( this.props.route );
		} else {
			return (<h1>No Route Sent.</h1>)
		}

	}

}

const styles = {
	portalBodyGrid: {
		backgroundColor: '#FFF',
		color: '#000',
		padding: '30px 20px 50px 20px'
	}
}

export default withStyles( styles )( PortalBody );
