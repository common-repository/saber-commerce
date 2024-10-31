import { withStyles } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';

class PortalMenuMain extends React.Component {

	constructor( props ) {

		super( props );

	}

	menuItemsOrder() {

		const sections = SACOM_PortalData.data.sections;
		sections.sort((a, b) => {

			if( a.position === undefined || isNaN( a.position ) ) {
				return 1;
			}

			if( b.position === undefined || isNaN( b.position ) ) {
				return -1;
			}

			if( parseFloat( a.position ) > parseFloat( b.position ) ) {
				return 1;
			} else {
				return -1;
			}

		});

		return sections;

	}

	render() {

		const { classes } = this.props;
		const menuItems = this.menuItemsOrder();

		return(
			<React.Fragment>
				<Grid className={classes.toggleGrid} container xs={12} onClick={this.props.toggle}>
					<Grid xs={6}>
						<h5 className={classes.toggleGridLabel}>MENU</h5>
					</Grid>
					<Grid className={classes.toggleGridIcon} item xs={6}>
						<MenuIcon fontSize="large" />
					</Grid>
				</Grid>
				<Collapse in={this.props.open} timeout="auto" unmountOnExit>
					<List className={classes.menuMainList}>
					{menuItems.map((section, index) => (
						<ListItem
							className={classes.menuMainListItem}
							button
							key={section.key}
							onClick={this.props.menuClickHandler}
							portal-section={section.key}
							selected={this.props.selected == section.key}
						>
							<ListItemText primary={section.title} />
						</ListItem>
					))}
					</List>
				</Collapse>
			</React.Fragment>
		)

	}

}

const styles = {
	menuMainList: {
		backgroundColor: '#272727',
		alignContent: 'center'
	},
	toggleGrid: {
		cursor: 'pointer',
		padding: '0',
		margin: '0',
		backgroundColor: '#151515',
		color: '#D6D6D6',
		alignItems: 'center'
	},
	toggleGridLabel: {
		color: '#FFF',
		fontWeight: 400,
		fontSize: '1.2em',
		padding: '0 0 0 6px'
	},
	toggleGridIcon: {
		display: 'flex',
		alignSelf: 'center',
		padding: '0 6px 0 0',
		'& > svg': {
			marginLeft: 'auto'
		}
	},
	menuMainListItem: {
		backgroundColor: '#272727',
		textTransform: 'uppercase',
		fontWeight: 500,
		textAlign: 'center',
		margin: '3px 0'
	}
}

export default withStyles( styles )( PortalMenuMain );
