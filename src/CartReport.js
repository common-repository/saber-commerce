import apiFetch from '@wordpress/api-fetch';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SquareStat from './SquareStat.js';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

export default class CartReport extends React.Component {

	constructor( props ) {

		super( props );
		this.state = {
			cartAge: {
				data: {
					labels: [ 'Under 1-hour', '1-2 hours', '2-4 hours', '4-8 hours', '8-12 hours', '12-16 hours', '16-24 hours' ],
					datasets: [
						{
							label: 'Dataset 1',
							data: [ 4, 3, 2, 9, 6, 186, 2 ],
							backgroundColor: ['#edf8e9','#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#005a32']
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						title: {
							display: true,
							text: 'Active Carts Age'
						},
						legend: {
							position: 'bottom',
						}
					}
				} // end data.cartAge.options
			}, // end data.cartAge
			cartType: {
				data: {},
				options: {}
			}
		}

	}

	componentDidMount() {

		this.fetchData();

	}

	fetchData() {

		apiFetch( { url: 'http://sacoma.dev.cc/wp-json/sacom/v1/cart' } )
			.then( ( response ) => {

				console.log( response );
				const carts = response.carts;

				this.setState( { carts: carts } );

				this.setState( { cartCount: carts.length } );

				// Calculate cart sum value.
				var total = parseFloat( 0.00 );
				carts.forEach( function( cart ) {

					cart.items.forEach( function( cartItem ) {

						total += parseFloat( cartItem.subtotal );

					});

				});

				this.setState( { cartTotalAmount: '$' + total.toFixed( 2 ) } );

				// Calculate cart average amount.
				const avg = total / carts.length;
				this.setState( { cartAverageAmount: '$' + avg.toFixed( 2 )  } );

				// Calculate number of user and anonymous carts.
				var userCartCount = parseInt( 0 );
				var anonymousCartCount = parseInt( 0 );

				carts.forEach( function( cart ) {

					if( cart.referenceType === 'user' ) {

						userCartCount++;

					} else {

						anonymousCartCount++;

					}

				});

				// Make data array for the cart type chart.
				const cartTypeData = [ userCartCount, anonymousCartCount ];

				// Make cart type chart data.
				const cartTypeChart = {
					data: {
						labels: [ 'Customer Carts', 'Anonymous Carts' ],
						datasets: [
							{
								label: 'Dataset 1',
								data: cartTypeData,
								backgroundColor: [ '#3288bd', '#238B45' ]
							}
						]
					},
					options: {
						responsive: true,
						plugins: {
							legend: {
								position: 'bottom',
							},
							title: {
								display: true,
								text: 'Active Carts by Type'
							}
						}
					} // end data.cartType.options
				} // end data.cartType

				// Set state data.
				this.setState( { cartType: cartTypeChart } );

			}
		);

	}

	render() {

		return <div class="sacom-dashboard-widget sacom-widget-cart-report">
			<div class="sacom-widget-header">
				<h2>Active Carts Report</h2>
				<span><ShoppingCartIcon /></span>
			</div>
			<SquareStat label="Active Carts" value={this.state.cartCount} />
			<SquareStat label="Average Cart Value" value={this.state.cartAverageAmount} />
			<SquareStat label="Potential Sales" value={this.state.cartTotalAmount} />

			<div class="sacom-widget-chart-row">
				<div class="sacom-widget-chart-wrap">
					<Pie id="cart-type-chart" data={this.state.cartType.data} options={this.state.cartType.options} />
				</div>
				{/* Removed because we don't have support yet for updated dates on carts.
				<div class="sacom-widget-chart-wrap">
					<Pie id="cart-age-chart" data={this.state.cartAge.data} options={this.state.cartAge.options} />
				</div>
				*/}
			</div>

		</div>;

	}

}
