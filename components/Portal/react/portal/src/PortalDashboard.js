import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import PortalGreeting from './PortalGreeting.js';
import PortalStat from './PortalStat.js';

class PortalDashboard extends React.Component {

	constructor( props ) {

		super( props );

		this.statClick = this.statClick.bind(this);

	}

	statClick( route ) {

		console.log('stat click...')
		console.log( route )
		location.hash = route;
		console.log( this.props.doRouting )
		this.props.doRouting();

	}

	render() {

		const { classes } = this.props;

		console.log( SACOM_PortalData.data.sectionsObject )

		return(
			<Grid className={classes.portalBodyGrid} container spacing={2}>
				<PortalGreeting username={SACOM_PortalData.data.user.data.user_nicename} />
				<PortalStat
					stat={SACOM_PortalData.data.sectionsObject.workspace.data.models.length}
					label="Active Workspaces"
					clickHandler={this.statClick}
					route="/workspace"
				/>
				<PortalStat
					stat={SACOM_PortalData.data.sectionsObject.timesheet.data.models.length}
					label="Current Timesheets"
					clickHandler={this.statClick}
					route="/timesheet"
				/>
				<PortalStat
					stat={SACOM_PortalData.data.sectionsObject.invoice.data.models.length}
					label="Current Invoices"
					clickHandler={this.statClick}
					route="/invoice"
				/>
			</Grid>
		)

	}

}

const styles = {
	portalBodyGrid: {
		backgroundColor: '#FFF',
		color: '#000',
		padding: '30px 20px 50px 20px'
	}
}

export default withStyles( styles )( PortalDashboard );
