import React from 'react';

export default React.createClass ({
    getInitialState() {
        return {
            value: this.props.value || '',
        }
    },
    getDefaultProps() {
        return {
            name: 'inputitem'
        };
    },
    componentDidMount() {
        if (this.props.onChange) {
            this.props.onChange(this.state.name || this.props.name, this.state.value);
        }
    },
    componentDidUpdate(prevProps, prevState) {
        if (this.props.onChange) {
            this.props.onChange(this.state.name || this.props.name, this.state.value);
        }
    },
    componentWillReceiveProps(nextProps) {
        // if (this.props.rewritable === true) {
            this.setState({value:nextProps.value});
        // };
    },
    handleChange(e){

        switch(this.props.validate){
            case 'numbers':
                this.setState({value: e.target.value.replace(/[^0-9.,]+/ig, '')});
                break;

            default:
                this.setState({value: e.target.value});
                break;
        }

        if (this.props.onChange) {
            this.props.onChange(this.props.name, e.target.value);
        }
    },
    render() {
        return (
            this.props.type == 'textarea'
                ?<textarea
                    {...this.props}
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                :<input
                    type="text"
                    {...this.props}
                    value={this.state.value}
                    onChange={this.handleChange}
                />
            );
    }
})

