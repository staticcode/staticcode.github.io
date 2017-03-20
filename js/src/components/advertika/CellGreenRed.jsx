import React from 'react';

export default React.createClass({
    render() {
        var value = this.props.data;
        // console.log(value);
        var className = '';
        var trend = '';

        if (value != 0 && value != '-') {
            if ((/\-/gi).test(value)) {
                className = 'txt-danger';
            } else {                
                trend = '+';
                className = 'txt-success'
            } 
        };

        return (
                <span className={className}>
                    {`${trend}${value}`}
                </span>
        )
    }
})
