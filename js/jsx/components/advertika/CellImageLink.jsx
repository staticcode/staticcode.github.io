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
    return (
    <div className="clearfix allvam">
      <div
        className="left center"
        style={{ width: this.props.thmbSize, height: this.props.thmbSize }}
        onClick={this.showModal}
      >
        {this.props.data.img
          ? <img className="img-responsive" src={this.props.data.img} />
          : <i className="ion-image size-32" />}

      </div>

      <div className="left"
        style={{
          width: `calc(100% - (${this.props.thmbSize} + 5px))`,
          paddingLeft: '5px',
        }}
      >
        <div className="link-box">
          {this.props.data.link
            ? <a
              className="link-box_link"
              data-tip={this.props.data.name}
              style={!this.props.data.extLink ? { maxWidth: '100%' } : null}
              target={this.props.blank ? '_blank' : '_self'}
              href={this.props.data.link}
            >
              {this.props.data.name}
            </a>

            : <span className="link-box_link __disabled" data-tip={this.props.data.name} >
              {this.props.data.name}
            </span>}
          {this.props.data.extLink
            ? <a
              className="link-box_ico "
              href={this.props.data.extLink}
              target="_blank"
              style={{ marginLeft: '5px' }}
            />

            : null}
        </div>

        {this.props.data.category
          ? (
            <div
              className="category ellipsis" data-tip={this.props.data.category.split(',').join('<br>')}
              data-place="bottom"
            >
              {this.props.data.category}
            </div>
          )
          : null}

        {this.props.data.description
          ? <div className="description">
            {this.props.data.description}
          </div>
          : null}

      </div>

    </div>
    );
  },
});

export default CellImageLink;
