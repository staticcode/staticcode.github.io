import React, { Component, PropTypes } from 'react';
import Table from '../../../../components/react-sortable-table/sortable-table';
import Btn from '../../../../components/advertika/btnitem';
import { circlePreloader } from '../../../../components/advertika/helpers';
import autoBind from 'auto-bind';


class PostsTable extends Component {
  static propTypes = {
    controls: PropTypes.array,
    style: PropTypes.object,
    columns: PropTypes.array,
  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      controls: props.controls,
      activeTable: 0,
      data: props.controls.map(() => []),
    };
  }

  componentWillMount() {
    this.handleLoadData();
  }

  handleLoadData() {
    const { url, cfg } = this.state.controls[this.state.activeTable];
    this.setState({ loading: true });
    $.getJSON(url, cfg, result => {
      this.state.data[this.state.activeTable] = result.items;
      this.state.controls[this.state.activeTable].count = result.count;
      this.state.controls[this.state.activeTable].cfg.params.page ++;
      this.setState({ loading: false });
    });
  }

  handleLoadNextData() {
    const { url, cfg } = this.state.controls[this.state.activeTable];
    this.setState({ loading: true });
    $.getJSON(url, cfg, result => {
      this.state.data[this.state.activeTable] = this.state.data[this.state.activeTable].concat(result.items);
      this.state.controls[this.state.activeTable].cfg.params.page ++;
      this.setState({ loading: false });
    });
  }

  handleToggleTable(i) {
    this.state.controls.forEach((c, index) => c.visible = index == i);
    this.state.activeTable = i;
    if (!this.state.data[this.state.activeTable].length) {
      this.handleLoadData();
    } else {
      this.forceUpdate();
    }
  }

  render() {
    const activeTable = this.state.activeTable;
    const activeControls = this.state.controls[activeTable];
    const activeData = this.state.data[activeTable];
    const isLoading = this.state.loading;




    const tableSelector = this.state.controls.map((c, i) => (
      <Btn
        style={{ marginRight: 5 }}
        className={c.visible ? c.btnAtiveClass : c.btnClass}
        onClick={this.handleToggleTable.bind(this, i)}
        key={c.name}
        children={c.name}
      />
    ));

    const message = (
      <div className="bg-darken-1 p3 mb1 center">
        <p>Доступно 2 {activeControls.freemiumMsg} поста из {activeControls.count} найденных.</p>
        <p>Почему?</p>
        <p>Вы используете демонтсрационную версию сервиса с ограниченными возможностями</p>
        <p>Для перехода ко всем функциям, выберите один из платных тарифов</p>
        <a href="/cabinet/info/tarif" className="button __success __lg">Выбрать платный тариф</a>
      </div>
    );

    return (
      <div className="public-ig_posts-table" style={this.props.style}>
        <div className="py2">
          {tableSelector}
        </div>

        {(isLoading && !activeData.length) && circlePreloader(300)}

        {!!activeData.length &&
          <div>
            {(!window.access && activeControls.freemiumMsg !== undefined) && message}
            <Table
              className="table __vertical-stripes __fzsm"
              data={activeData}
              columns={this.props.columns}
            />
            <div className="center py2">
            {activeControls.freemiumMsg === undefined && activeData.length !== activeControls.count &&
              <Btn
                className="__primary"
                onClick={this.handleLoadNextData}
                disabled={ isLoading }
                children={!isLoading ? 'Загрузить еще' : 'Загрузка'}
              />}
              <div><small>{`Отображается ${activeData.length} из ${activeControls.count}`}</small></div>
            </div>
          </div>}

          {(!isLoading && !activeData.length) &&
            <div className="public-ig_nodata center">
            <span className="p4">&#9785;</span>
            <div dangerouslySetInnerHTML={{ __html: activeControls.msg }} />
          </div>}
      </div>
    );
  }
}


export default PostsTable;
