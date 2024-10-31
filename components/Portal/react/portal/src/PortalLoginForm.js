import apiFetch from '@wordpress/api-fetch';
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

class PortalLoginForm extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			snackOpen: 0,
			snackMessage: ''
		}

		this.handleSubmit = this.handleSubmit.bind( this )
		this.snackHandleClose = this.snackHandleClose.bind( this )

	}

	loginSuccess() {

		this.props.loginSuccess();

	}

	handleSubmit( e ) {

		e.preventDefault();

		console.log('handle submit....')

		const usernameEl = document.getElementById('username');
		const passwordEl = document.getElementById('password');
		const values = {
			username: usernameEl.value,
			password: passwordEl.value
		}

		console.log( values )


		// Do validation required and minimum length.

		// Do request for login.
		const result = apiFetch( {

			path: '/sacom/v1/account/login',
			method: 'POST',
			data: { values: values },

		} ).then( ( res ) => {

			console.log( res );
			if( res.success === 1 ) {

				SACOM_PortalData.data = res.portalData;
				this.setState({snackMessage: "Success, you are now logged in."})
				this.loginSuccess();

			} else {

				this.setState({snackMessage: "Sorry, we couldn't verify that username and password combination. Please try again."})

			}

			this.setState({snackOpen: 1})


		} );

	}

	snackOpen() {}
	snackHandleClose() {
		this.setState({snackOpen: 0})
	}

	render() {

		const { classes } = this.props;

		return(
			<form className={classes.loginForm} onSubmit={this.handleSubmit}>
				<h3 className={classes.loginPageHeader}>Account Login</h3>
				<FormControl margin="normal">
					<TextField id="username" label="Username" variant="outlined" />
				</FormControl>
				<FormControl margin="normal">
					<TextField type="password" id="password" label="Password" variant="outlined" />
				</FormControl>
				<Button className={classes.loginFormSubmitButton} variant="contained" type="submit">

					Login
				</Button>

				<Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snackOpen}
        autoHideDuration={2000}
        onClose={this.snackHandleClose}
        message={this.state.snackMessage}
        action={
					<React.Fragment>
						<IconButton size="small" aria-label="close" color="inherit" onClick={this.snackHandleClose}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</React.Fragment>
					}
				/>

			</form>
		);

	}

}

const styles ={
	loginForm: {
		margin: '30px 0',
		'& .MuiFormControl-root': {
			width: '100%',
			maxWidth: '320px',
		},
		padding: '10px 20px',
		'& .MuiOutlinedInput-root': {
			borderRadius: '0',
		},
		'& input': {
			width: '100%',
			borderRadius: '0',
			borderColor: '#D1D1D1',
			padding: '8px 10px'
		}
	},
	loginPageHeader: {
		fontSize: '1.2em',
		textAlign: 'center',
		color: '#737373'
	},
	loginFormSubmitButton: {
		padding: '20px',
		fontSize: '1.5em',
		color: '#545454',
		backgroundColor: '#000',
		borderRadius: '0',
		marginTop: '25px',
		'&:hover': {
			color: '#FFF',
			backgroundColor: '#000',
		}
	}
}

export default withStyles( styles )( PortalLoginForm );
