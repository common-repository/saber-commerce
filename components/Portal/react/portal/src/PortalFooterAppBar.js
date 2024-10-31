import apiFetch from '@wordpress/api-fetch';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import PortalFooterPaymentLogo from './PortalFooterPaymentLogo.js';

class PortalFooterAppBar extends React.Component {

	constructor( props ) {

		super( props );

		this.logoutHandler = this.logoutHandler.bind( this );

	}

	logoutHandler() {

		apiFetch( {

			path: '/sacom/v1/account/logout',
			method: 'POST',
			data: {},

		} ).then( ( res ) => {

			console.log( res )
			location.hash = '';
			window.location.reload();


		} );

	}


	render() {

		console.log( this.props.userAuthorized )

		const { classes } = this.props;

		return(
			<AppBar className={classes.footerAppBar} position="static">
				<Toolbar
					disableGutters
					className={classes.footerUpperToolbar}
				>
					<Button
						disabled={!this.props.userAuthorized}
						className={classes.logoutButton}
						classes={{disabled: classes.buttonDisabled}}
						onClick={this.logoutHandler}
						>Logout</Button>
					<Button
						disabled={!this.props.userAuthorized}
						className={classes.button}
						classes={{disabled: classes.buttonDisabled}}
						variant="outlined"
						onClick={this.props.profileClick}
					>
						Profile
					</Button>
				</Toolbar>
				<Toolbar
					disableGutters
					className={classes.footerLowerToolbar}
				>
					<PortalFooterPaymentLogo className={classes.svg} />
					<Box class={classes.footerCreditLine}>SACOM v1.3.5</Box>
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
	footerAppBar: {
		backgroundColor: 'inherit',
		borderTop: 'solid 1px #444',
		padding: '15px 0 0 0',
		marginTop: '50px'
	},
	logoutButton: {
		backgroundColor: 'transparent',
		color: '#FFFFFF',
		padding: '0 0 0 0',
		marginRight: 'auto',
		width: 'auto',
	},
	buttonDisabled: {
		color: '#686868 !important',
		borderColor: '#686868 !important'
	},
	button: {
		backgroundColor: 'transparent',
		color: '#FFFFFF',
		borderRadius: '0',
		borderColor: '#FFFFFF',
		width: 'auto',
		margin: '0 6px',
		padding: '0 6px 0 6px',
		'&:hover': {
			borderColor: '#666666'
		},
		'&:last-child': {
			marginRight: '0'
		}
	},
	zeroMargin: {
		margin: '0'
	},
	footerCreditLine: {
		margin: '0',
		textAlign: 'right',
		fontSize: '0.75em',
		fontWeight: '500',
		color: '#FFFFFF59',
	},
	toolbarReduceGutters: {
		padding: '0',
		margin: '0'
	},
	footerUpperToolbar: {
		justifyContent: 'end',
		alignItems: 'center',
		padding: '0',
		margin: '8px 0 30px 0',
		minHeight: '0'
	},
	footerLowerToolbar: {
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '0',
		margin: '8px 0',
		minHeight: '0'
	},
	svg: {
		maxWidth: '45px'
	}
}

export default withStyles( styles )( PortalFooterAppBar );
