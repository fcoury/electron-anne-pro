import React from 'react';
import classNames from 'classnames';

export default class Key extends React.Component {
  constructor(props) {
    super(props);
  }

	render() {
		const left = `${this.props.x}px`;
		const top = `${this.props.y}px`;
		const width = `${this.props.width}px`;
		const height = `${this.props.height}px`;
		const style = { top, left, width, height };
		const keyClasses = `key${this.props.selected ? ' selected' : ''}`;

		return (
			<div className="keybox" style={style}>
				<div className={keyClasses} onClick={e => this.props.onClick(e)}>
					<div className="keytop">
						<div className="primary">{this.props.label}</div>
					</div>
				</div>
			</div>
		);
	}

}
