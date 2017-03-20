import React, { PropTypes } from 'react';


const CellImageLink = React.createClass({
  propTypes: {
    thmbSize: React.PropTypes.string,
    blank: React.PropTypes.bool,
    categoryLimit: React.PropTypes.number,
    data: React.PropTypes.object,
    modal: React.PropTypes.object,

  },
  getDefaultProps() {
    return { thmbSize: '35px' };
  },
  showModal() {
    if (this.props.modal) {
      document.getElementById('popunder').style.display = 'block';
      document.getElementById('popupMsg').innerHTML = (
      `<div class="center">
        <img
          class="img-responsive"
          src="${this.props.data.img || '//lorempixel.com/500/500'}"/>
      </div>`
      );
    }
  },
  render() {
    const { thmbSize, data, blank} = this.props;
    return (
    <div className="clearfix allvam">
      <div
        className="left center"
        style={{ width: thmbSize, height: thmbSize }}
        onClick={this.showModal}
      >
        {data.img
          ? <img className="img-responsive" src={data.img} />
          : <i className="ion-image size-32" />}

      </div>

      <div className="left"
        style={{
          width: `calc(100% - (${thmbSize} + 5px))`,
          paddingLeft: '5px',
        }}
      >
        <div className="link-box">
          {data.link
            ? <a
              className="link-box_link"
              data-tip={data.name}
              style={!data.extLink ? { maxWidth: '100%' } : null}
              target={blank ? '_blank' : '_self'}
              href={data.link}
            >
              {data.name}
            </a>

            : <span className="link-box_link __disabled" data-tip={data.name} >
              {data.name}
            </span>}
          {!!data.extLink &&
            <a
              className="link-box_ico "
              href={data.extLink}
              target="_blank"
              style={{ marginLeft: '5px' }}
            />}
        </div>

        {!!data.category &&
            <div
              className="category ellipsis" data-tip={data.category.split(',').join('<br>')}
              data-place="bottom"
            >
              {data.category}
            </div>}

        {!!data.description &&
          <div className="description">
            {data.description}
          </div>}

      </div>

    </div>
    );
  },
});

export default CellImageLink;
