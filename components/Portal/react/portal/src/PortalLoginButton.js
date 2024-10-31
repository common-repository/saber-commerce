import { withStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';

class PortalLoginButton extends React.Component {

	render() {

		const { classes } = this.props;

		return(
			<Button
				className={classes.portalLoginButton}
				variant="outlined"
				startIcon={<LockOpenIcon />}
				size="large"
				onClick={this.props.clickHandler}
			>
				LOGIN
			</Button>
		)

	}

}

const styles = {
	portalLoginButton: {
		borderRadius: '0',
		borderColor: '#000',
		backgroundColor: '#EAEAEA',
		fontSize: '1.4em',
		maxWidth: '220px',
		justifyContent: 'space-between',
		marginLeft: 'auto'
	}
}

export default withStyles( styles )( PortalLoginButton );
