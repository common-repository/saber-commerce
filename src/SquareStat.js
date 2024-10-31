class SquareStat extends React.Component {

	render() {

		return <div class="sacom-square-stat">
				<h2>{this.props.value}</h2>
				<span>{this.props.label}</span>
			</div>;

	}

}

export default SquareStat;
