import React from 'react'
import ReactRater from '../react-rater/'

const Rater = React.createClass({
    getInitialState() {
        return {
            rating: 0,
            voters: ''
        }
    },
    getDefaultProps() {
        return {
            limit: 5
        };
    },
    handleRate(rating, lastRating) {
        

        this.setState({rating: rating })

        // if (lastRating !== void 0) {
        //     alert('You rated ' + rating)
        // }
        
        $.getJSON(this.props.url, {
            id: this.props.id,
            rating: rating
        }, (json, textStatus) => {

        });

        this.setState({voters: this.props.voters + 1})

    },
    render() {
        return (<div>
                    <ReactRater 
                        total={5} 
                        rating={this.state.rating || this.props.rating} 
                        limit={this.props.limit}
                        lock={this.props.lock}
                        onRate={this.handleRate} />
                        <div>
                            <small className="txt-disabled">{this.state.voters || this.props.voters} проголосовавших</small>
                        </div>
                </div>
        )
    }
})

export default Rater