import React from 'react';
import { connect } from 'react-redux';
import { fetchData, toggleTeaserSelection, toggleVisibility } from '../actions/';
import Masonry from 'react-masonry-component';
import TeaserTemplate from '../../../../components/advertika/mytarget_ad_template';
import Pagination from '../../../../components/advertika/Pagination';
import { circlePreloader } from '../../../../components/advertika/helpers';
import FreemiumMessage from './freemium_message';

class SimilarImages extends React.Component {
  static defaultProps = {
    count: 0,
    // items: [],
    page: 1,

  };

  static propTypes = {
    name: React.PropTypes.string,
    items: React.PropTypes.array,
    count: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    page: React.PropTypes.number,
    fetchData: React.PropTypes.func,
    toggleVisibility: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { id } = window.adInfo;
    this.props.toggleVisibility({ tab: 'similarImg' });
    if (this.props.items === undefined) {
      this.props.fetchData({ method: 'similarImg', params: { page: 1, id } }, 'similarImg');
    }
  }

  changePage(page) {
    const { id } = window.adInfo;
    this.props.fetchData({ method: 'similarImg', params: { page, id } }, 'similarImg');
    window.scrollTo(0, 0);
  }

  render() {
    const { items, count, page, toggleTeaserSelection, selectedTeasers, visibility } = this.props;

    if (visibility.loading || items === undefined) {
      return circlePreloader(200);
    }

    if (items !== undefined && !items.length) {
      return (<div className="h2 txt-disabled p4 m4 center">
        Похожих изображений не найдено.
      </div>);
    }

    return (
      <div>
    {!window.access &&
      <FreemiumMessage message="Для получения полного списка похожих изображений, перейдите на платный тарифный план." />
    }
        <Masonry
          className={'mx-auto'}
          options={{
            isFitWidth: true,
            singleMode: true,
            isResizable: true,
            isAnimated: true,
            animationOptions: {
              queue: false,
              duration: 500,
            },
          }}
          disableImagesLoaded={false}
          updateOnEachImageLoad
        >
        {items.map(teaser => (
          <TeaserTemplate
            {...teaser}
            key={teaser.id}
            selected={selectedTeasers.indexOf(teaser.id) !== -1}
            toggleTeaserSelection={toggleTeaserSelection}
          />
        ))}
        </Masonry>
        {(count > 20) &&
          <Pagination
            ref="pagination"
            currentPage={page}
            maxVisible={
              Math.ceil(count / 20) > 5
              ? 5
              : Math.ceil(count / 20)
            }
            max={Math.ceil(count / 20)}
            onChange={::this.changePage}
          />
              }
      </div>
    );
  }
}

const mapStateToProps = ({ visibility, selectedTeasers, tabsData: { similarImg: { count, items, page } } }) => ({
  count, items, page, selectedTeasers, visibility,
});


export default connect(mapStateToProps, { fetchData, toggleTeaserSelection, toggleVisibility })(SimilarImages);
