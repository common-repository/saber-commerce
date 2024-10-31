import { withStyles } from "@material-ui/core/styles";

class PortalQuote extends React.Component {

	constructor( props ) {

		super( props );

	}

	render() {

		const { classes } = this.props;

		return(
			<div class={classes.portalQuote}>
				<h3>Live as if you were to die tomorrow. Learn as if you were to live forever.</h3>
				<h5>Mahatma Gandhi</h5>
			</div>
		);

	}

}

const styles = {
	portalQuote: {
		textAlign: 'right',
		color: '#000',
		margin: '30px 0 70px 0',
		'& h3': {
			color: '#000',
			fontSize: '1.25em',
			fontWeight: 500,
			lineHeight: 1.8
		},
		'& h5': {
			color: '#B2B2B2',
			fontSize: '1.05em',
			fontWeight: 400,
		}
	}
}

export default withStyles( styles )( PortalQuote );
