import React from 'react';
import Dropdown from '../../components/advertika/dropdown';



const Analysys_plnd_listDD = React.createClass({
    getInitialState() {
        return {
            Geo:[],
            AdNets:{value:[]}
        };
    },

    handleChange(name,list_id){
        if (name == 'Geo') {
            this.state[name] = list_id;
        } else {
            this.state[name].value = list_id;
        };
        this.setState(this.state);
    },
    handleApply(calback, filterName){        
        window[calback]( this.state[filterName], 'plnd' )
    },
    render() {
        return (
            <div className="row">
           {Dropdowns.map(
                    (c,i)=><div className="right col-45" key={i}>
                           <Dropdown 
                               {...c} 
                               items={c}
                               onChange={this.handleChange}
                               applySelected={this.handleApply.bind(null, c.calback, c.filterName)}
                           />
                       </div>
                    )}
             
            </div>
        );
    }
});

React.render(<Analysys_plnd_listDD />, document.getElementById("landingPageSorting"));



