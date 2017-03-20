import React, { Component, PropTypes } from 'react';
import Tooltip from 'rc-tooltip';
import { circlePreloader } from './helpers';


class CellAJAXLink extends Component {
  constructor(props) {
    super(props);
    this.state = { data: undefined };
  }

  componentWillReceiveProps() {
    this.setState({ data: undefined });
  }

  fetchData() {
    if (this.state.data !== undefined) return;

    const { id, section, src_type, ajaxUrl } = this.props;
    window.$.post(ajaxUrl, { id, section, src_type }, data => {
      this.setState({ data });
    }, 'json');
  }

  render() {
    const tooltipContent = (linkList) => linkList.map((link, i) => (
      <div className="row" key={i}>
        <a className="left ellipsis col-80" href={link.link} target="_blank">{link.title}</a>
        <a className="left ellipsis col-20 a-right" href={link.link} target="_blank">{link.cnt}</a>
      </div>
    ));


    if (this.props.data === '-') {
      return <div>{this.props.data}</div>;
    }

    if (!this.state.data && !this.state.link) {
      return <div className="link" onMouseEnter={::this.fetchData}>{this.props.data}</div>;
    }

    if (!Array.isArray(this.state.data)) {
      return <a href={this.state.data.link} target="_blank">{this.props.data}</a>;
    }

    if (this.state.data.length === 1) {
      return <a href={this.state.data[0].link} target="_blank">{this.props.data}</a>;
    }

    return (
      <Tooltip
        trigger={['click']}
        placement="top"
        overlay={<div style={{ width: '300px', fontSize: '14px' }}>
          {this.state.data && !!this.state.data.length
            ? tooltipContent(this.state.data)
            : circlePreloader(20)}
        </div>}
        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
        destroyTooltipOnHide
      >
        <div className="link" onMouseEnter={::this.fetchData}>
          {this.props.data}
        </div>
      </Tooltip>
    );
  }
}


CellAJAXLink.propTypes = {
  data: PropTypes.string,
  id: PropTypes.string,
  ajaxUrl: PropTypes.string,
  section: PropTypes.string,
  src_type: PropTypes.number,
};

export default CellAJAXLink;
