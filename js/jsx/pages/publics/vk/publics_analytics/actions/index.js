/* eslint-disable  no-use-before-define */

export const fetchData = (config) => dispatch => {
  dispatch(toggleVisibility({ preloader: true }));
  $.getJSON('/public/vk/analytic/post', config, data => dispatch({
    type: 'FETCH_POSTS',
    data,
  }));
};


/*

applyFilter() {
  this.filter.page = 0;
  this.setState({ loading: true });
  $.getJSON(this.props.url, this.filter, result => {
    this.setState({
      totalCount: result.totalCount,
      loading: false,
      page: 1,
      data: result.items,
    });
    this.filterNextPage = _.extend(this.filterNextPage, this.filter);
  });
}

loadNext() {
  this.filterNextPage.page = this.state.page;
  this.setState({ loading: true });
  $.getJSON(this.props.url, this.filterNextPage, result => {
    this.setState({
      totalCount: result.totalCount,
      page: this.state.page + 1,
      loading: false,
      data: this.state.data.concat(result.items),
    });
  });
}
*/

export const changeFilter = filter => ({
  type: 'CHANGE_FILTER',
  filter,
});

export const changePage = page => ({
  type: 'CHANGE_PAGE',
  page,
});

export const resetFilters = () => dispatch => {
  dispatch({ type: 'RESET_FILTERS' });
  dispatch(fetchData(window.postsFilterConfig()));
};

export const changeSort = (sort, filterConfig) => dispatch => {
  dispatch(changeFilter(sort));
  dispatch(fetchData({ ...filterConfig, sort }));
};

export const loadNextPage = (filterConfig) => dispatch => {
  dispatch(toggleVisibility({ preloader: true }));
  dispatch(changePage());
  $.getJSON('/public/vk/analytic/post', { ...filterConfig, page: filterConfig.page + 1, loadnext: true }, data => dispatch({
    type: 'LOAD_NEXT_PAGE',
    data,
  }));
};


export const toggleVisibility = visibility => ({
  type: 'TOGGLE_VISIBILITY',
  visibility,
});
