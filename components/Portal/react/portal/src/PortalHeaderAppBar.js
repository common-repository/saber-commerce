import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withStyles } from "@material-ui/core/styles";
import PortalSaberWpLogo from './PortalSaberWpLogo.js';


class PortalHeaderAppBar extends React.Component {

	constructor( props ) {

		super( props );

	}

	renderAccountImage() {

		console.log( SACOM_PortalData.data.user )

		if( !SACOM_PortalData.data.user.data.profileImage ) {

			return(
				<AccountCircle fontSize="large" />
			);

		}

		return (
			<img src={SACOM_PortalData.data.user.data.profileImage} />
		);

	}

	render() {

		const { classes } = this.props;

		return(
			<AppBar className={classes.headerAppBar} position="static">
				<Toolbar disableGutters>
					<PortalSaberWpLogo />
					<div class={classes.grow}></div>
					<IconButton
						className={classes.iconRestrain}
						aria-label="account of current user"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						color="inherit"
					>
						{this.renderAccountImage()}
					</IconButton>
				</Toolbar>
			</AppBar>
		)
	}

}

const styles = {
	root: {
		flexGrow: 1,
	},
	grow: {
		flexGrow: 1,
	},
	headerAppBar: {
		backgroundColor: 'inherit',
		borderBottom: 'solid 1px #444',
		padding: '0 0 15px 0',
		marginBottom: '10px'
	},
	iconRestrain: {
		width: '64px',
		height: '64px'
	},
}

export default withStyles( styles )( PortalHeaderAppBar );
