import React from 'react';

const CellTextOrImg = React.createClass({


    render () {
        var data = this.props.data;
        console.log((/(.png)|(.jpg)/gi).test(data))
        return (  data )
    }
})

export default CellTextOrImg
