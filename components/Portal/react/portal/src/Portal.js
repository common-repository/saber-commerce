import PortalBody from './PortalBody.js';
import PortalHeaderAppBar from './PortalHeaderAppBar.js';
import PortalFooterAppBar from './PortalFooterAppBar.js';
import PortalMenuMain from './PortalMenuMain.js';
import PortalLoginButton from './PortalLoginButton.js';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";

class Portal extends React.Component {

	constructor( props ) {

		super( props );

		// State defaults.
		this.state = {
			userAuthorized: 0,
			route: null,
			menuMain: {
				selected: 'user',
				open: 0
			}
		}

		this.menuClickHandler = this.menuClickHandler.bind(this);
		this.toggleMenuMain = this.toggleMenuMain.bind(this);
		this.loginClickHandler = this.loginClickHandler.bind(this);
		this.loginSuccess = this.loginSuccess.bind(this);
		this.viewObject = this.viewObject.bind(this);
		this.profileClick = this.profileClick.bind(this);
		this.doRouting = this.doRouting.bind(this);

	}

	componentDidMount() {

		// Authorize.
		if( SACOM_PortalData.data.user.ID > 0 ) {

			this.state.userAuthorized = 1;

		}

		this.doRouting();

	}

	componentDidUpdate( prevProps, prevState ) {



	}

	parseRouteRequest() {

		const routeRequest = {}
		routeRequest.hash = location.hash;

		if( location.hash === '' ) {

			routeRequest.error   = 0;
			routeRequest.path    = 'default';
			return routeRequest;

		}

		if( location.hash.substring( 0, 2 ) !== '#/' || location.hash.length <= 2 ) {

			routeRequest.error        = 1;
			routeRequest.errorMessage = 'Invalid route.';
			return routeRequest;

		}

		// Parse segments.
		let path = routeRequest.hash;
		path = path.replace('#/', '');
		routeRequest.pathSegments = path.split( '/' );

		// Clear empty last segment.
		const lastSegmentIndex = routeRequest.pathSegments.length - 1;
		const lastSegment = routeRequest.pathSegments[ lastSegmentIndex ];
		if( lastSegment === '' ) {
			routeRequest.pathSegments.splice( lastSegmentIndex, 1 );
		}

		// Make final path and set ID if found.
		routeRequest.objectId = 0;
		routeRequest.path = '';
		routeRequest.pathSegments.forEach( ( pathSegment, index ) => {

			if( isNaN( pathSegment ) ) {
				routeRequest.path += pathSegment;
			} else {
				routeRequest.path += '[id]';
				routeRequest.objectId = pathSegment
			}

			if( index + 1 !== routeRequest.pathSegments.length ) {
				routeRequest.path += '/';
			}
		});

		return routeRequest;

	}

	menuClickHandler( e ) {

		const menuItem = e.currentTarget;
		const sectionKey = menuItem.getAttribute( 'portal-section' );
		const section = SACOM_PortalData.data.sectionsObject[ sectionKey ];

		location.hash = '/' + section.key;
		this.doRouting();
		this.toggleMenuMain();

	}

	toggleMenuMain() {

		if( !this.state.userAuthorized ) {
			return;
		}

		if( this.state.menuMain.open === 1 ) {

			this.setState({
				menuMain: {
					open: 0
				}
			});

		} else {

			this.setState({
				menuMain: {
					open: 1
				}
			});

		}

	}

	loginClickHandler() {

		location.hash = '/login';
		this.doRouting();

	}

	profileClick() {

		location.hash = '/profile';
		this.doRouting();

	}

	loginSuccess() {

		this.setState({
			userAuthorized: 1
		});

		location.hash = '/dashboard';
		this.doRouting();

	}

	viewObject( objectId, modelKey ) {

		console.log( 'viewObject' )
		console.log( objectId )

		const hashBangPath = '/' + modelKey + '/' + objectId + '/';
		location.hash = hashBangPath;
		this.doRouting();
	}

	authCheck( routeRequest ) {

		if( this.state.userAuthorized ) {
			return 1; // Simple auth allows all access.
		}

		if( !this.state.userAuthorized && routeRequest.path === 'default' ) {
			return 1; // Allow access to default (splash page).
		}

		if( !this.state.userAuthorized && routeRequest.path === 'login' ) {
			return 1; // Allow access to login page.
		}

		/* All other conditions fail. */
		return 0;

	}

	doRouting() {

		const routeRequest = this.parseRouteRequest();
		const registeredRoutes = this.parseRegisteredRoutes();

		console.log( 'doRouting' )
		console.log( routeRequest )
		console.log( registeredRoutes )

		const authCheckResult = this.authCheck( routeRequest );

		/* If auth check fails set route to invalid. */
		if( !authCheckResult ) {
			routeRequest.path = 'invalid';
		}

		/* If logged in user request default replace with dashboard. */
		if( this.state.userAuthorized && routeRequest.path === 'default' ) {
			routeRequest.path = 'dashboard';
		}

		let matchedRoute = this.routeMatch( routeRequest, registeredRoutes );

		if( matchedRoute ) {

			this.setState({ route: matchedRoute });
			return;

		}

		/* Send invalid route if none matched. */
		routeRequest.path = 'invalid';
		matchedRoute = this.routeMatch( routeRequest, registeredRoutes );

		if( matchedRoute ) {

			this.setState({ route: matchedRoute });
			return;

		}

		// Everything failed?
		return;

	}

	routeMatch( routeRequest, registeredRoutes ) {

		let matchedRoute = false;
		registeredRoutes.forEach( function( registeredRoute, index ) {

			if( registeredRoute.route === '/' + routeRequest.path + '/' ) {
				matchedRoute = registeredRoute;
				matchedRoute.request = routeRequest; // Add request to the matched route.
			}

		});

		return matchedRoute;

	}

	parseRegisteredRoutes() {

		const routes = [];
		SACOM_PortalData.data.sections.forEach( section => {

			if( section.routes !== undefined ) {

				section.routes.forEach( route => {

					// Add section to the route data.
					route.section = section;
					routes.push( route );

				});

			}

		});

		return routes;

	}

	render() {

		const { classes } = this.props;

		console.log( this.state.userAuthorized );

		return(
			<Grid className={`${classes.appMaxWidth} ${classes.appCenterMargin} ${classes.appBackgroundColor}`} container spacing={2}>
				<Grid item xs={12}>
					<PortalHeaderAppBar />
				</Grid>
				<Grid item xs={12}>
					<AppBar position="static">
						<PortalMenuMain
							menuClickHandler={this.menuClickHandler}
							selected={this.state.menuMain.selected}
							open={this.state.menuMain.open}
							toggle={this.toggleMenuMain}
						/>
					</AppBar>
				</Grid>
				<Grid className={classes.bodyGridWrap} item xs={12}>
					<PortalBody
						route={this.state.route}
						doRouting={this.doRouting}
						viewObject={this.viewObject}
						loginButton={<PortalLoginButton clickHandler={this.loginClickHandler} />}
						loginSuccess={this.loginSuccess}
					/>
				</Grid>
				<Grid item xs={12}>
					<PortalFooterAppBar
						userAuthorized={this.state.userAuthorized}
						profileClick={this.profileClick}
					/>
				</Grid>
			</Grid>
		)

	}

}

const styles = {
	appMaxWidth: {
		maxWidth: '320px'
	},
	appCenterMargin: {
		margin: '0 auto'
	},
	appBackgroundColor: {
		backgroundColor: '#000000'
	},
	footerButton: {
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
	bodyGridWrap: {
		background: '#FFF',
		color: '#000',
		padding: '0',
		margin: '0'
	},
	buttonDisabled: {
		color: '#686868 !important',
		borderColor: '#686868 !important'
	}
}

export default withStyles( styles )( Portal );
