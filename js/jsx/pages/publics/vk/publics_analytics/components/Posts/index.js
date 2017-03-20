import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Filters from '../../containers/filters';
import Btn from '../../../../../../components/advertika/btnitem';
import ReactTooltip from '../../../../../../components/react-tooltip/react-tooltip';
import Post from '../../../../../../components/advertika/post_vk_tpl';
import { flatLinePreloader, declOfNum } from '../../../../../../components/advertika/helpers';


class Posts extends Component {

  static propTypes = {
    postsData: PropTypes.object,
    visibility: PropTypes.object,
    filterConfig: PropTypes.object,
    loadNextPage: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visibility, postsData, filterConfig } = this.props;
    const accessiblePostCount = postsData.items.slice(0, window.access ? undefined : 2).length;

    return (
      <div>

        {visibility.preloader && flatLinePreloader()}

        <Filters />

        {postsData.items.length &&
          <div>
            <div className="clearfix mxn1" style={{ paddingTop: 140 }}>
            {!window.access &&
              <div className="px1 mb2">
                <div className="bg-darken-1 p3 center">
                  <p>Доступно <b>{accessiblePostCount}</b> {declOfNum(accessiblePostCount, ['пост', 'поста', 'постов'])} из <b>{postsData.totalCount}</b> найденных.</p>
                  <p>Почему?</p>
                  <p>Вы используете демонстрационную версию сервиса с ограниченными возможностями.</p>
                  <p>Для перехода ко всем функциям, выберите один из платных тарифов</p>

                  <a className="[ button __success __lg ]" href="/cabinet/info/tarif">Выбрать платный тариф</a>

                </div>
              </div>
            }
              {postsData.items.slice(0, window.access ? undefined : 2).map((post, i) => (
                <div className="inline-block col_half align-top px1" key={i}>
                  <Post {...post} header="true" />
                </div>
              ))}

            </div>
            {window.access &&
            <div className="center">
              {postsData.items.length != postsData.totalCount &&
                <Btn
                  className="__primary"
                  onClick={() => this.props.loadNextPage(filterConfig)}
                  disabled={visibility.preloader}
                >
                  {!visibility.preloader ? 'Загрузить еще' : 'Загрузка'}
                </Btn>}

              <div>
                <small>Отображается {postsData.items.length} из {postsData.totalCount}</small>
              </div>
            </div>
            }

          </div>}

        <ReactTooltip place="top" type="light" effect="float" multiline />
      </div>
    );
  }
}

const mapStateToProps = ({ visibility, postsData, filterConfig }) => ({
  visibility,
  postsData,
  filterConfig,
});

export default connect(mapStateToProps, actions)(Posts);

