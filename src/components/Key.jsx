import React from 'react';
import classNames from 'classnames';

export default class Key extends React.Component {
	render() {
		const left = `${this.props.x}px`;
		const top = `${this.props.y}px`;
		const width = `${this.props.size}px`;
		const style = { top, left, width };

		return (
			<div className="key" style={style}>
				<div className="keytop">
					<div className="primary">{this.props.label}</div>
				</div>
			</div>
		);
	}

}
