import { withStyles } from "@material-ui/core/styles";

class PortalStat extends React.Component {

	constructor( props ) {

		super( props );

		this.clickHandler = this.clickHandler.bind( this );

	}

	clickHandler() {

		this.props.clickHandler( this.props.route );

	}

	render() {

		const { classes } = this.props;

		return(
			<div className={classes.sacomStat} onClick={this.clickHandler}>
				<div>{this.props.stat}</div>
				<div>{this.props.label}</div>
			</div>
		)

	}

}

const styles = {
	sacomStat: {
		display: 'grid',
		width: '100%',
		margin: '8px 0',
		cursor: 'pointer',
		gridTemplateColumns: '1fr 3fr',
		'& > div': {
			padding: '8px'
		},
		'& > div:first-child': {
			backgroundColor: '#585858',
			color: '#FFF',
			textAlign: 'center'
		},
		'& > div:last-child': {
			backgroundColor: '#787878',
			color: '#FFF'
		}
	}
}

export default withStyles( styles )( PortalStat );
