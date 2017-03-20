import React, { Component } from 'react';

export default class DashboardDropdown extends Component {




    render() {
        return (

             <div className="dashboard-dropdown">
                <div className="dashboard-dropdown_body">
                {this.props.dropdown.map(
                    (item, index) =>
                    <div
                        className="dashboard-dropdown_item"
                        key={index}
                    >
                        <a href={`${item.url}${item.param}=${this.props.term}`} >
                            <span className="dashboard-dropdown_search-term">
                                {this.props.term}
                            </span>
                            {' '}
                            <strong>
                                искать в
                            </strong>
                            {' '}
                            <span className="txt-success">
                                {item.title}
                            </span>
                        </a>

                    </div>
                    )}
                </div>
            </div>
        );
    }
}
