import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { flatLinePreloader } from '../../../../components/advertika/helpers';
import * as actions from '../actions/actions_ads_and_posts';
import VKPostTemplate from '../../../../components/advertika/post_vk_tpl';
import InstagramPostTemplate from '../../../../pages/publics/instagram/posts/containers/post_template';
import ReactTooltip from '../../../../components/react-tooltip/react-tooltip';
import MtMTpl from '../../../../components/advertika/mytarget_ad_template';

// let adsData = window.adsData;
const $ = window.$;

class AdsAndPosts extends Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
  }

  componentWillMount() {
    if (!this.props.adsData.length) {
      this.loadData();
    }
  }

  componentDidMount() {
    window.Tipped.create('.tipped', function () {
      return {
        content: $(this).data('content'),
      };
    });
  }

  componentDidUpdate() {
    window.Tipped.create('.tipped', function () {
      return {
        content: $(this).data('content'),
      };
    });
  }

  loadData() {
    const { togglePreloader, adsUrl, ajaxUrl, publicsUrl, loadData, id, adsType } = this.props;

    togglePreloader(true);

    $.post(adsUrl, data => {
      loadData({ adsData: data });
    });

    $.post(ajaxUrl, { id, type: adsType.mtm }, data => {
      loadData({ mtm: data });
    }, 'json');

    $.post(publicsUrl, data => {
      loadData({ ...data });
      togglePreloader(false);
    }, 'json');
  }

  render() {
    const { loading, access, adsData, mtm, vkPost } = this.props;

    const SectiponTooltip = (
      <i
        className="ion-help-circled txt-primary"
        data-tip="Наиболее популярные посты за последние 90 дней"
      />
    );

    const noPostsFound = (
      <div className="m4 p4 center h3">Постов не найдено</div>
    );
    const noAdsFound = (
      <div className="m4 p4 center h3">Объявлений не найдено</div>
    );


    if (loading) {
      return flatLinePreloader();
    }

    if (!access) {
      return (
        <div dangerouslySetInnerHTML={{ __html: adsData }} />
      );
    }

    return (
      <div>

        <div dangerouslySetInnerHTML={{ __html: adsData }} />

        <section className=" py1">
          <div className="clearfix">
            <div className="left col_half">
              <h3>
                {'Объявления соц. сетей (Mobile) '}
                <i
                  className="ion-help-circled txt-primary"
                  data-tip="Наиболее популярные объявления из числа новых за последние 90 дней"
                />
              </h3>
            </div>
            <div className="left col_half a-right">
            {!!mtm.items.length &&
              <a href={mtm.link}>{`${mtm.count} новых объявлений`}</a>
            }
            </div>
          </div>

          {mtm.items.length
            ? (
              <div className="center ">
                <div className="inline-block relative">
                  {this.props.mtm.items.map(mtmAd => <MtMTpl {...mtmAd} key={mtmAd.id} checkboxHidden />)}
                </div>
              </div>
            )
            : noAdsFound}
        </section>

        <section className=" py1">
          <div className="clearfix">
            <div className="left col_half">
              <h3>Посты ВКонтакте {SectiponTooltip}</h3>
            </div>
            <div className="left col_half a-right">
            {!!vkPost.items.length &&
              <a href={vkPost.link}>{`${vkPost.count} новых постов`}</a>
            }
            </div>
          </div>

          {vkPost.items.length
            ? (
              <div className="clearfix mxn1">
                {this.props.vkPost.items.map((postData, index) => (
                <div className="inline-block align-top col_half px1" key={index}>
                  <VKPostTemplate {...postData} header />
                </div>
                ))}
              </div>
            )
            : noPostsFound}
        </section>

        <section className="py1">
          <div className="clearfix">
            <div className="left col_half">
              <h3>Посты Instagram {SectiponTooltip}</h3>
            </div>
            <div className="left col_half a-right">
            {!!this.props.igPost.items.length
              && <a href={this.props.igPost.link}>{`${this.props.igPost.count} новых постов`}</a>
            }
            </div>
          </div>

          {this.props.igPost.items.length
            ? (
              <div className="mxn1">
                {this.props.igPost.items.map((postData, index) => (
                  <div className="posts-ig_list-item" key={index}>
                    <InstagramPostTemplate {...postData} detailInfo access />
                  </div>
                  ))}
              </div>
            )

            : noPostsFound}
        </section>

        <ReactTooltip place="top" type="light" effect="float" multiline />

      </div>
    );
  }
}

AdsAndPosts.propTypes = {
  id: PropTypes.string,
  adsType: PropTypes.object,
  access: PropTypes.bool,
  loading: PropTypes.bool,
  adsUrl: PropTypes.string,
  ajaxUrl: PropTypes.string,
  publicsUrl: PropTypes.string,
  adsData: PropTypes.string,
  mtm: PropTypes.object,
  vkPost: PropTypes.object,
  igPost: PropTypes.object,
  loadData: PropTypes.func,
  togglePreloader: PropTypes.func,
};

const mapStateToProps = ({
  AdsAndPosts: { id, ajaxUrl, access, loading, adsUrl, publicsUrl, adsData, mtm, vkPost, igPost, adsType },
}) => ({
  id,
  adsType,
  ajaxUrl,
  access,
  loading,
  adsUrl,
  publicsUrl,
  adsData,
  mtm,
  vkPost,
  igPost,
});


export default connect(mapStateToProps, actions)(AdsAndPosts);

