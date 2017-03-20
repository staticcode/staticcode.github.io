import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Btnitem from '../../../../components/advertika/btnitem';
import SortableTable from '../../../../components/react-sortable-table/sortable-table';
import ReactTooltip from '../../../../components/react-tooltip/react-tooltip';
import * as actions from '../actions/actions_similar_offers';

class SimilarOffers extends Component {
  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
    this.loadNext = this.loadNext.bind(this);
  }


  componentWillMount() {
    if (!this.props.data.length) {
      this.loadNext();
    }
  }

  handleSort(column, sort) {
    const filter = { ...this.props.filter, sort, column };
    this.props.togglePreloader(true);
    window.$.getJSON(
      this.props.url,
      { ...filter, page: this.props.filter.page - 1 },
      result => {
        this.props.loadSortedData({ ...result, filter });
      }
    );
  }

  loadNext() {
    this.props.togglePreloader(true);
    window.$.getJSON(
      this.props.url,
      { ...this.props.filter, loadnext: true },
      result => {
        this.props.loadNextData(result);
      }
    );
  }

  render() {
    return (<div>
          {this.props.loading &&
            <div className="progress" style={{ position: 'fixed', zIndex: 999, top: -10, left: 0 }}>
              <div className="indeterminate"></div>
            </div>
          }

          {this.props.data.length

            ? <div>
              <SortableTable
                className="tbl __fzsm __center"
                onSort={this.handleSort}
                data={this.props.data}
                columns={this.props.tableColumns}
              />

              <div className="center mb4">
                { (this.props.data.length !== this.props.totalOffers) &&
                <Btnitem
                  className="__primary"
                  onClick={ this.loadNext }
                  disabled={ this.props.loading }
                >
                  {(!this.props.loading ? 'Загрузить еще' : 'Загрузка')}
                </Btnitem>
                }
                {!!this.props.data.length &&
                  <div>
                    <small>
                      {`Отображается ${this.props.data.length} из ${this.props.totalOffers}`}
                    </small>
                  </div>
                }
              </div>
            </div>

            : !this.props.loading &&
              <div className="note-user" >
                <span className="ion-android-search" />
                <span className="text">
                  Похожих офферов не найдено.
                </span>
              </div>

            }

          <ReactTooltip place="top" type="light" effect="float" multiline />
        </div>
    );
  }
}


SimilarOffers.propTypes = {
  tableColumns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool,
  url: PropTypes.string,
  totalOffers: PropTypes.number,
  filter: PropTypes.object,
  loadSortedData: PropTypes.func,
  togglePreloader: PropTypes.func,
  loadNextData: PropTypes.func,
};


function mapStateToProps(state) {
  return {
    tableColumns: state.SimilarOffers.tableColumns,
    url: state.SimilarOffers.url,
    filter: state.SimilarOffers.filter,
    data: state.SimilarOffers.data,
    // page: state.SimilarOffers.page,
    loading: state.SimilarOffers.loading,
    totalOffers: state.SimilarOffers.totalOffers,
  };
}

export default connect(mapStateToProps, actions)(SimilarOffers);
