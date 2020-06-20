import React, {Component} from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import cx from 'classnames'

import './TransactionView.sass'

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import * as Api from '../../api/api';

export default class TransactionView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 'Actions',
      copied: false,
      tx: {
        block_num: 0,
        block_time: '',
        id: '',
        traces: [],
        block: {

        }
      }
    }

    this.showCopyTooltip = this.showCopyTooltip.bind(this)
    this.closeCopyTooltip = this.closeCopyTooltip.bind(this)
  }

  showCopyTooltip() {
    if (this.state.copied) return

    this.setState({ copied: true })

    setTimeout(this.closeCopyTooltip, 2000)
  }

  closeCopyTooltip() {
      this.setState({ copied: false })
  }

  componentDidMount() {
    Api.rpc.history_get_transaction(this.props.match.params.id).then(tx => {
      Api.rpc.get_block(tx.block_num).then(block => {
        tx.block = block;
        this.setState({tx})
      })
    });
  }

  actionRow({ index, action, name }) {
    return (
      <div className="actions-table__row">
        <div><span>{ index }</span></div>
        <div><span>{ action }</span></div>
        <div><span>{ name }</span></div>
      </div>
    )
  }

  render() {
    const {tx} = this.state;
    console.log(tx)
    
    return (
      <div className="transaction-view-page">
        <div className="transaction-view-page__title"><span>Transaction Detail</span></div>
        <div className="transaction-view-page__info">
          <div className="transaction-view-page__info_row">
            <div className="info-name"><span>Block Number</span></div>
            <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
            </svg>
            <span className="info-value">{tx.block_num}</span>
          </div>
          <div className="transaction-view-page__info_row">
            <div className="info-name"><span>Transaction ID</span></div>
            <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
            </svg>
            <span className="info-value">{tx.id}</span>
            <CopyToClipboard text={ tx.id }>
              <div className="popup-botton-container">
                  <div className="copy-icon" onClick={ this.showCopyTooltip }></div>
                  <div className={ `button-tooltip${ this.state.copied ? ' button-tooltip-show' : '' }` }><span>Скопировано</span></div>
              </div>
            </CopyToClipboard>
          </div>
          <div className="transaction-view-page__info_row">
            <div className="info-name"><span>Timestamp</span></div>
            <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
            </svg>
            <span className="info-value">{tx.block_time}</span>
          </div>
          <div className="transaction-view-page__info_row">
            <div className="info-name"><span>№ of Actions</span></div>
            <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
            </svg>
            <span className="info-value">{tx.traces.length}</span>
          </div>
        </div>
        <div className="transaction-view-page__panels">
          <div className="panels__title-row">
            <div className={ cx('panels__title-row_tab', { 'title-active' : this.state.activeTab === 'Actions' }) } onClick={ () => this.setState({ activeTab: 'Actions' }) }>
              <span>Actions</span>
            </div>
            <div className={ cx('panels__title-row_tab', { 'title-active' : this.state.activeTab === 'Raw' }) } onClick={ () => this.setState({ activeTab: 'Raw' }) }>
              <span>Block Raw JSON</span>
            </div>
          </div>
          <div className={ cx('panels__cards-wrapper', { 'show-actions' : this.state.activeTab === 'Actions', 'show-raw' : this.state.activeTab === 'Raw' }) }>
            <div className="panels__card actions-card">
              <div className="actions-table">
                <div className="actions-table__title-row">
                  <div><span>Index</span></div>
                  <div><span>Action</span></div>
                  <div><span>Smart Contract Name</span></div>
                </div>
                {tx.traces.map((t, i) => this.actionRow({
                    index: i+1,
                    action: t.act.name,
                    name: t.act.account,
                }))}
              </div>
            </div>
            <div className="panels__card raw-card">
              <SyntaxHighlighter language="javascript" style={ a11yLight }>
{JSON.stringify(tx.block, null, 2)}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    )
  }
}