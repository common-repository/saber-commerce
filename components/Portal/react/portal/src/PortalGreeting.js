export default class PortalGreeting extends React.Component {

	constructor( props ) {

		super( props );

	}

	render() {

		return(
			<h4>Welcome back {this.props.username}.</h4>
		);

	}

}
