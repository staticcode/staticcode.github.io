import Rater from '../../components/advertika/rater';
import React from 'react';
import Sticky from 'react-sticky';
import SortableTable from '../../components/react-sortable-table/sortable-table';
import Btnitem from '../../components/advertika/btnitem';
import Dropdown from '../../components/advertika/dropdown';
import ReactTooltip from '../../components/react-tooltip/react-tooltip';
import _ from 'underscore';

function SetRatePN (rate, id){
    $.post('/offer/partner/vote'+id, {rating: rate});
}

const OfferCardpn = React.createClass({
    filter:{},
    filterNextPage:{
        loadnext: true
    },
    getInitialState() {
        return statePPchoicePP();
    },
    getDefaultProps() {
        return propsPPchoicePP();
    },
    componentWillMount() {
        this.applyFilter();
    },
    resetFilters(){
        this.filter = {};
        this.props.dropdowns.forEach(c=>this.refs[c.filterName].handleChange(()=>false));
        setTimeout(()=>this.applyFilter(),100);
    },
    changeFilter(key, val) {
        this.filter[key] = val;
    },
    handleSort(column, sort) {
        this.filter.column = column;
        this.filter.sort = sort;
        this.filter.page = this.state.page - 1;
        this.setState({ loading: true });
        $.getJSON(this.props.url, this.filter, result => {
            if (this.isMounted()) {
                this.setState({
                    totalGoals: result.totalGoals,
                    loading: false,
                    data: result.goals
                });
            }
            this.filterNextPage = _.extend(this.filterNextPage, this.filter);;
        });
    },
    applyFilter() {
        this.filter.page = 0;
        this.setState({ loading: true });
        $.getJSON(this.props.url, this.filter, (result) => {
            if (this.isMounted()) {
                this.setState({
                    totalGoals: result.totalGoals,
                    loading: false,
                    page: 1,
                    data: result.goals
                });
            }
            this.filterNextPage = _.extend(this.filterNextPage, this.filter);
        });
    },
    loadNext() {
        this.filterNextPage.page = this.state.page;
        this.setState({ loading: true });
        $.getJSON(this.props.url, this.filterNextPage, (result) => {
            if (this.isMounted()) {
                this.setState({
                    totalGoals: result.totalGoals,
                    page: this.state.page + 1,
                    loading: false,
                    data: this.state.data.concat(result.goals)
                });

            }
        });
    },
    render() {

        return (
        <div className="clearfix" style={{paddingTop: 1}}>
            {this.state.loading
                        ? <div className="progress" style={{'position':'fixed', 'zIndex': 999, top: -10, left: 0 }}>
                            <div className="indeterminate"></div>
                        </div>
                        : null}
            <Sticky
                style={{'position':'absolute', 'zIndex': 10 }}
                stickyStyle={{'zIndex': 10, 'position': 'fixed', 'top': 0, 'left': 0, 'right': 0, 'minWidth': '1200px'}}
            >
                <div className="[ container ] fhp">
                    <div className="fhp_resetfilters" onClick={this.resetFilters}>
                        Очистить фильтры <i className="ion-close-circled"></i>
                    </div>
                    {this.props.dropdowns.map((item,i)=>(
                        <div className="left px1" style={{'width': (100 / this.props.dropdowns.length)+'%'}} key={i}>
                            <Dropdown
                                {...item}
                                index={i}
                                ref={item.filterName}
                                items={item}
                                filterName={item.filterName}
                                title={item.title}
                                subtitle={item.subtitle}
                                onChange={this.changeFilter}
                                applySelected={this.applyFilter}
                            />
                        </div>
                    ))}

                </div>
            </Sticky>
            <SortableTable
                onSort={this.handleSort}
                className="tbl __fzsm __center"
                data={this.state.data}
                columns={this.props.tableColumns}
                style={{marginTop: 140}}/>
            <div className="center mb4">
                { this.state.data.length != this.state.totalGoals
                ?<Btnitem
                    className="__primary"
                    onClick={ this.loadNext }
                    disabled={ this.state.loading }>
                    {(!this.state.loading ? 'Загрузить еще' : 'Загрузка')}
                </Btnitem>
                :null}
                {this.state.data.length
                ?<div>
                    <small>{"Отображается "+ this.state.data.length + " из " + this.state.totalGoals}</small>
                </div>
                :null}
            </div>
            <ReactTooltip place='top' type='light' effect='float' multiline={true}/>
        </div>
        );
    }
});


React.render(<OfferCardpn />, document.getElementById("cardpn"));

React.render(<Rater total={5} rating={ratePN} voters={votersNP} url={rateURL} id={NPID} lock={lock}/>, document.getElementById("rate"));
