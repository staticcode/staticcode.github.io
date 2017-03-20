import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Modal from '../../../../../components/modal';

const mapStateToProps = ({ visibility }) => ({ visibility });
@connect(mapStateToProps, actions)
export default class ModalWrapper extends Component {
  static propTypes = {
    visibility: PropTypes.object,
    toggleVisibility: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      formValue: '',
      tableData: [],
    };
  }

  handleInputText({ target: { value } }) {
    this.setState({ formValue: value });
  }

  hendleSendData() {
    const publicList =
      this.state.formValue.replace(/ /g, '').replace(/\n\n/g, '').replace(/\n/g, ',').split(',').slice(0, 10);
    $.post('/public/ig/default/add', { lp: publicList.toString() }, data => {
      this.setState({
        tableData: data,
      });
    }, 'json');
  }

  handleToggleVisibility(modal) {
    this.setState({ tableData: [], formValue: '' });
    this.props.toggleVisibility({ modal });
  }

  handleAddMorePublics() {
    this.setState({ tableData: [], formValue: '' });
  }

  render() {
    const { visibility } = this.props;
    const { formValue, tableData } = this.state;
    const coutRows = formValue.split('\n').length > 3 ? formValue.split('\n').length : 3;
    const status = {
      0: {className: '__error'},
      1: {className: '__warning'},
      2: {className: '__success'},
    };


    const table = rowItems => (
    <table className="tbl __fzsm __center" style={{ margin: 0 }}>
      <thead>
        <tr>
          <th>Паблик</th>
          <th>Статус добавления</th>
        </tr>
      </thead>
      <tbody>
      {rowItems.map((rowItem, index) =>
        <tr key={index} className={status[rowItem.status].className}>
          <td>
            <a href={rowItem.link} target="_blank">
              {rowItem.uname}
            </a>
          </td>
          <td>
            {rowItem.status_msg}
          </td>
        </tr>
      )}
      </tbody>

    </table>

    );
    const form = () => (
    <div className="modal-form">
    <p>Вставьте ссылку или ID сообщества. <br />
      Если хотите добавить несколько, вставьте каждую ссылку с новой строки.<br />
      За один раз можно добавить не более 10 сообществ.</p>
      <textarea
        ref={node => this.input = node}
        className="field __block"
        cols="30"
        rows={coutRows}
        onChange={e => this.handleInputText(e)}
        value={this.state.formValue}
      />
    </div>
    );


    const footer = tableData.length
    ? (
      <div className="a-right">
        <button className="button __success __sm" onClick={() => this.handleAddMorePublics()}>
          Добавить еще
        </button>
      </div>
    )

    : (
      <div className="a-right">
        <button className="button __primary __sm" onClick={() => this.hendleSendData()}>Добавить</button>
      </div>
    );
    return (
      <Modal
        size="__md"
        header
        // body={form()}
        body={tableData.length ? table(tableData) : form()}
        footer={footer}
        visibility={visibility.modal}
        toggle={modal => this.handleToggleVisibility(modal)}
      />

    );
  }
}
