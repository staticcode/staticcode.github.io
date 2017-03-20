import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import Chart from './Chart';
import PostsTable from './Posts_table';


import Public from '../../../../../components/ig-public-tpl';
import Table from '../../../../../components/react-sortable-table/sortable-table';
import ReactTooltip from '../../../../../components/react-tooltip/react-tooltip';


class IGPublic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: window.pageData(),
    };

    this.tableDynamic = this.tableDynamic.bind(this);
  }


  tableDynamic(tableDynamic) {
    this.setState({ tableDynamic });
  }

  render() {
    return (
      <div>
        <Public {...this.state.data} detailInfo={true} />
        <div className="row mb4">
          <div className="left col-30">
            <Chart tableDynamic={this.tableDynamic} />
          </div>
          <div className="left col-70">
            <Table
              className="table __vertical-stripes __fzsm __ig-fixed_headers"
              data={this.props.tableDynamicData || []}
              columns={this.props.tableDynamic}
            />
            <div className="a-right txt-disabled" style={{ fontSize: 10 }}>Мы храним данные за последние 90 дней</div>
          </div>
        </div>
        <strong>Другие посты </strong><a href={this.state.data.public.outLink} target="_blank">@{this.state.data.public.username}</a>
        <PostsTable
          style={{ minHeight: 540 }}
          columns={this.props.tablePostsColumns}
          controls={this.props.tablePostsConfig}
        />
        <ReactTooltip place="top" type="light" effect="float" multiline />
      </div>
    );
  }
}

IGPublic.propTypes = {
  tableDynamic: PropTypes.array,
  tablePostsColumns: PropTypes.array,
  tablePostsConfig: PropTypes.array,
};

IGPublic.defaultProps = window.propsPublic();

export default connect(({ chart: { tableData } }) => ({ tableDynamicData: tableData }))(IGPublic);

