import React, { Component } from 'react';
import { numberWithSpaces } from '../../../components/advertika/helpers';

export default class DashboardPlates extends Component {

  render() {
    const plateChildren = (childrens, count) =>
      childrens.map(
        (children, i) =>
        <a
          className="dashboard-plate_children"
          href={count ? `${children.href}${children.searchParam}=${this.props.term}` : children.href}
          key={i}
          title={children.title}
        >
          <img src={`/images/dashboard/${children.ico}.png`} />
        </a>
      );

    const dashboardPlate = (item, index) =>
      <div
        className="dashboard-plate"
        key={index}
        style={{ width: `${100 / this.props.columns}%` }}
      >

          <div
            className={`dashboard-plate_body ${item.inProcess === true ? '__in-process' : ''}`}
            style={
              { backgroundImage: `url(/images/dashboard/0${index + 1}.png)` }
            }
          >
            {item.childrens
              ? <div className="dashboard-plate_childrens">
                {plateChildren(item.childrens, item.count)}
              </div>
              : <a
                href={item.count ? `${item.href}${item.searchParam}=${this.props.term}` : item.href}
                className="dashboard-plate_link"
              />}

            <div className="center">
              <div className="dashboard-plate_title">
                {item.title}
              </div>
              <div className="dashboard-plate_descr">
                {item.descr}
              </div>
            </div>

            {!Array.isArray(item.label)
              ? <div className={`dashboard-plate_label ${item.label.design}`}>
                  <div className="dashboard-plate_label-inner">
                    {item.label.txt}
                  </div>
              </div>
            : null}

          </div>


        {item.count
          ? <div className="dashboard-plate_counter">
            {numberWithSpaces(item.count)}
          </div>
          : null}

      </div>


    return (
      <div className="clearfix mxn1">
        {this.props.data.map(
            (item, index) => dashboardPlate(item, index)
          )}
      </div>
    );
  }
}

