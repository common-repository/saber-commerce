import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import TabList from '@material-ui/lab/TabList';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import { TabPanel } from '@material-ui/lab';

export default class  TaxEditorTabs extends React.Component {

	constructor( props ) {

		super( props );

		this.state = {
			value: 'tax_classes',
			setValue: 'tax_classes',
		}

		this.handleChange = this.handleChange.bind( this );

	}

	handleChange( event, newValue ) {

		this.setState( { value: newValue } );

	}

	render() {

		return (
			<Paper square>
				<TabContext value={this.state.value}>
					<TabList onChange={this.handleChange} aria-label="simple tabs example">
						<Tab label="Tax Rates" aria-controls="a11y-tabpanel-0" id="a11y-tab-0" value="tax_rates" />
						<Tab label="Tax Classes" aria-controls="a11y-tabpanel-1" id="a11y-tab-1" value="tax_classes" />
					</TabList>
					<TabPanel value="tax_rates">
						{this.props.taxRatePanel}
					</TabPanel>
					<TabPanel value="tax_classes">
						{this.props.taxClassPanel}
					</TabPanel>
				</TabContext>
			</Paper>
		);

	}


}
