import React from 'react';
import Table from '../../../../../components/react-sortable-table/sortable-table';
import Btn from '../../../../../components/advertika/btnitem';
import {circlePreloader} from '../../../../../components/advertika/helpers';



const PostsTable = React.createClass({

  getInitialState() {
    return {
      controls:this.props.controls,

      activeTable:0,
      data:this.props.controls.map(c=>[])
    };
  },
  componentWillMount() {
    this.handleLoadData()
  },
  handleLoadData(){
    this.setState({ loading: true });
    $.getJSON(
    // this.props.url,
    this.state.controls[this.state.activeTable].url,
    this.state.controls[this.state.activeTable].cfg,
    (result) => {
      if (this.isMounted()) {
        this.state.data[this.state.activeTable] = result.items
        this.state.controls[this.state.activeTable].count = result.count
        this.state.controls[this.state.activeTable].cfg.params.page ++
        this.setState({
          loading: false,
          // data: result
        });
      }
    });
  },
  handleLoadNextData(){
    this.setState({ loading: true });
    $.getJSON(
    // this.props.url,
    this.state.controls[this.state.activeTable].url,
    this.state.controls[this.state.activeTable].cfg,
    (result) => {
      if (this.isMounted()) {
        this.state.data[this.state.activeTable] = this.state.data[this.state.activeTable].concat(result.items);
        this.state.controls[this.state.activeTable].cfg.params.page ++
        this.setState({
          loading: false,
          // data: result
        });
      }
    });
  },
  handleToggleTable(i) {
    this.state.controls.forEach((c, index) => c.visible = index == i);
    this.state.activeTable = i;
    /*this.setState({
      controls:this.props.controls
    });*/
    if(!this.state.data[this.state.activeTable].length){
      this.handleLoadData()
    } else {
      this.forceUpdate();
    }
  },
  render() {


    var tableSelector = this.state.controls.map((c, i) => (
      <Btn
        style={{ marginRight: 5 }}
        className={c.visible ? c.btnAtiveClass : c.btnClass}
        onClick={this.handleToggleTable.bind(this, i)}
        key={c.name}
        children={c.name}
      />
    ));



    return (
      <div className="public-ig_posts-table" style={this.props.style}>
        <div className="py2">
          {tableSelector}
        </div>
        {!this.state.loading || this.state.data[this.state.activeTable].length
        ?this.state.data[this.state.activeTable].length
          ?<div>
            <Table
              className="table __vertical-stripes __fzsm"
              data={this.state.data[this.state.activeTable]}
              columns={this.props.columns} />
            <div className="center py2">
            {this.state.data[this.state.activeTable].length != this.state.controls[this.state.activeTable].count
              ?<Btn
                className="__primary"
                onClick={this.handleLoadNextData}
                disabled={ this.state.loading }
                children={!this.state.loading ? 'Загрузить еще' : 'Загрузка'}/>
              :null}
              <div>
                <small>
                  Отображается
                  {' '}
                  {this.state.data[this.state.activeTable].length}
                  {' '}
                  из
                  {' '}
                  {this.state.controls[this.state.activeTable].count}
                </small>
              </div>
            </div>
          </div>
          :<div className="public-ig_nodata center">
            <span className="p4">&#9785;</span>
            <div dangerouslySetInnerHTML={{__html:this.state.controls[this.state.activeTable].msg}} />
          </div>
        :circlePreloader(300)}
      </div>
    );
  }
});

export default PostsTable;
