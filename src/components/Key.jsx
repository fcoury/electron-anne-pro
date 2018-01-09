import React from 'react';
import classNames from 'classnames';

export default class Key extends React.Component {
	render() {
		const left = `${this.props.x}px`;
		const top = `${this.props.y}px`;
		const width = `${this.props.width}px`;
		const height = `${this.props.height}px`;
		const style = { top, left, width, height };

		return (
			<div className="keybox" style={style}>
				<div className="key">
					<div className="keytop">
						<div className="primary">{this.props.label}</div>
					</div>
				</div>
			</div>
		);
	}

}
