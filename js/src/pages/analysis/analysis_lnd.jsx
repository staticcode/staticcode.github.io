import React from 'react';
import Dropdown from '../../components/advertika/dropdown';



const Analysys_lnd_adNetDD = React.createClass({
        getInitialState() {
        return {
            list_id:{
                value:[]
            }
        };
    },

    handleChange(name,list_id){

        this.state.list_id.value = list_id;
        this.setState(this.state);

    },
    handleApply(){
        sort_ch( this.state.list_id, 'lnd' )
    },
    render() {
        return (
            <div>
                <Dropdown 
                    {...ADNETDD} 
                    items={ADNETDD}
                    onChange={this.handleChange}
                    applySelected={this.handleApply}
                />
            </div>
        );
    }
});

React.render(<Analysys_lnd_adNetDD />, document.getElementById("adNetDD"));



