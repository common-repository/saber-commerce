import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

export default class PortalGreeting extends React.Component {

	constructor( props ) {

		super( props );

	}

	render() {

		return(
			<React.Fragment>
				<h4>Current Balance</h4>
				<h2>$583.24 USD</h2>
				<ButtonGroup color="primary" aria-label="outlined primary button group">
					<Button>Update Card on File</Button>
					<Button>Deposit Funds</Button>
				</ButtonGroup>
			</React.Fragment>
		);

	}

}
