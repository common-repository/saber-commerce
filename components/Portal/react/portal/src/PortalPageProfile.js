import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

class PortalPageProfile extends React.Component {

	constructor( props ) {

		super( props );

	}

	render() {

		const { classes } = this.props;

		return(
			<Grid className={classes.portalBodyGrid} container spacing={2}>
				<h3 className={classes.pageHeader}>Your User Profile</h3>
				<Grid item className={classes.profileData}>
					<h4>ACCOUNT NAME</h4>
					<h2>{this.props.accountName}</h2>
				</Grid>
				<Grid item className={classes.profileData}>
					<h4>DISPLAY NAME</h4>
					<h2>{this.props.displayName}</h2>
				</Grid>
				<Grid item className={classes.profileData}>
					<h4>COLOR SCHEME</h4>
					<h2>Default Black/White</h2>
				</Grid>
			</Grid>
		)

	}

}

const styles = {
	portalBodyGrid: {
		backgroundColor: '#FFF',
		color: '#000',
		padding: '30px 20px 50px 20px'
	},
	profileData: {
		display: 'block',
		width: '100%',
		color: '#888',
		'& > h2': {
			margin: '0',
			fontSize: '1.15em',
			color: '#777',
			padding: '5px 10px',
			display: 'block',
			width: '100%'
		},
		'& > h4': {
			backgroundColor: '#7E7E7E',
			padding: '5px 10px',
			margin: '0',
			fontSize: '1.0em',
			fontWeight: 400,
			color: '#D8D8D8',
			display: 'block',
			width: '100%'
		},
	},
	pageHeader: {
		display: 'block',
		width: '100%',
		borderBottom: 'solid 1px #888',
		color: '#656565',
		fontSize: '1.0em',
		fontWeight: 400,
		textAlign: 'right',
		margin: '0 0 40px 0 !important'
	}
}

export default withStyles( styles )( PortalPageProfile );
