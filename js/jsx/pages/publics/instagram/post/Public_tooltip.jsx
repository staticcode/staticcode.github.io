

import React from 'react';
import {circlePreloader, abbrNum, numberWithSpaces} from '../../../../components/advertika/helpers';


export default React.createClass({
    getInitialState() {
        return {
            pubInfoShow:false,
        };
    },
    getDefaultProps() {
        return {};
    },
    componentWillReceiveProps(nextProps) {
        if (nextProps.id !== this.props.id) {    
            delete this.state.public;
            this.state.pubInfoShow = false;
        }
    },    
    handleGetPubInfo() {
        if (!this.state.public && !this.state.pubInfoShow) {
            this.getMoreInfo({method:'getPublicInfo',filter:'post',params:{id:this.props.id}}, 'public')
            this.setState({pubInfoShow: true});
        };        
    },
    getMoreInfo(config,stateKey) {
        $.getJSON('/public/ig/default/load', config, (result) => {
            if (this.isMounted()) {               
                this.setState({                    
                    [stateKey]: result
                });             
            }
        });
    },    
    render() {
        let coloringDigits = (number) => {
            var className = 'txt-primary';
            var trend = '';

            if (number != 0) {
                if ((/\-/gi).test(number)) {
                    className = 'txt-danger';
                } else {                         
                    className = 'txt-success';
                    trend = '+';
                } 
            };
            return <div className={`mb1 ${className}`}>{trend+numberWithSpaces(number)}</div>
        }        
        return (
                <div 
                    className="ion-android-information post-ig_public-inf" 
                    onMouseOver={this.handleGetPubInfo}
                >
                    <div className={`post-ig_public-inf-body ${this.props.position ?this.props.position :''}`}>
                        <div className="post-ig_public-inf-cnt">
                        {this.state.public
                            ?<div>
                                <div 
                                    className="mb1 py1 border-bottom break-word"
                                    style={{whiteSpace: 'normal'}}
                                >
                                    {this.state.public.bio}
                                </div>
                                <div className="row mb1">
                                    <div className="left col-35">
                                    <div style={{marginBottom:5}}>Подписчики</div>
                                    {numberWithSpaces(this.state.public.followed_cnt)}<br/>
                                    {coloringDigits(this.state.public.followed_diff)}
                                
                                    </div>
                                    <div className="left col-35">
                                    <div style={{marginBottom:5}}>Подписок</div>
                                    {numberWithSpaces(this.state.public.follows_cnt)}<br/>
                                    {coloringDigits(this.state.public.follows_diff)}
                                
                                    </div>
                                    <div className="left col-30 a-right">
                                        <ul>
                                            {this.state.public.geo.length
                                                ?this.state.public.geo
                                                .sort(
                                                    (a,b)=>{
                                                      if (Number(a.value.replace('%','')) > Number(b.value.replace('%','')))
                                                        return -1;
                                                      if (Number(a.value.replace('%','')) < Number(b.value.replace('%','')))
                                                        return 1;
                                                      return 0;
                                                    }
                                                )
                                                .slice(0,3)
                                                .map(
                                                        c=> <li key={c.code}>
                                                                {c.value}
                                                                {' '}
                                                                <span 
                                                                    className={`i-geo ${c.code}`}
                                                                    style={{verticalAlign:'middle'}}
                                                                    data-tip={c.label}
                                                                />
                                                                
                                                            </li>
                                                    )
                                            :null}
                                        </ul>
                                    </div>
                                </div>
                                <div className="center mb1">
                                    ER мес.: 
                                    {' '}
                                    {this.state.public.er_m}
                                    <br/>

                                    ER нед.: 
                                    {' '}
                                    {this.state.public.er_w}
                                    

                                </div>
                                <div className="mb1">
                                    <div className="txt-disabled">
                                        Лайков на пост:
                                        {' '}
                                        {numberWithSpaces(this.state.public.like_post)}
                                    </div>
                                    <div className="txt-disabled">
                                        Комментариев на пост:
                                        {' '}
                                        {numberWithSpaces(this.state.public.comment_post)}
                                    </div>
                                    <div className="txt-disabled">
                                        Упоминаний сообщества:
                                        {' '}
                                        {numberWithSpaces(this.state.public.reference)}
                                    </div>
                                    <div className="txt-disabled">
                                        Рекламных постов: 
                                        {' '}
                                        {this.state.public.perc_adv}%
                                
                                    </div>
                                </div>
                            </div>
                            : circlePreloader(180,80)}

                        </div>
                    </div>
                </div>             
        );
    }
})



