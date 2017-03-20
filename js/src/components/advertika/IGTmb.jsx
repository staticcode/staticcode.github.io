import React from 'react';

const IGTmb = React.createClass({
  render() {
    return (
      <div>
          <div style={{height:'150px'}}>
            {this.props.img
              ?<img className="img-responsive" src={this.props.img} alt="" />
              :null}
          </div>
          {this.props.inLink
            ?<a href={this.props.inLink} className="dashed-link __success">
              {this.props.txt}
            </a>
            :null}
          {this.props.deleted == 1
            ?<span className="post-ig_deleted ion-trash-b txt-disabled ml1" title="Пост удален"/>
            :null}
      </div>
    )
  }
})

export default IGTmb
