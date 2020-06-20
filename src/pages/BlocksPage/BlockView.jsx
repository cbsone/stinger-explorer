import React, {Component} from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import './BlockView.sass'
import * as Api from '../../api/api';

export default class BlockView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      copied: false,
      blockData: {
        action_mroot: "...",
        block_num: 0,
        confirmed: 0,
        id: "...",
        new_producers: null,
        previous: "...",
        producer: "eosio",
        producer_signature: "SIG_K1_KcxXtNms3EhddYRBW4jEr2YBjNNfJnKfc8T52GmeMkLcP1Nv34tmcdY9iSgtJr5j6io5c6iYF3XZy4scDUDsgdjAUAhqWi",
        ref_block_prefix: 0,
        schedule_version: 0,
        timestamp: "...",
        transaction_mroot: "..."
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

  componentWillMount() {
    Api.rpc.get_block(this.props.match.params.id_or_num).then(blockData => this.setState({blockData}))
  }

  render() {
    const {blockData} = this.state;
    return (
      <div className="block-view-page">
        <div className="block-view-page__title"><span>Block Detail</span></div>
        <div className="block-view-page__info">
          <div className="block-view-page__info_row">
            <div className="info-name"><span>Block Number</span></div>
            <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
            </svg>
            <span className="info-value">{blockData.block_num}</span>
          </div>
          <div className="block-view-page__info_row">
            <div className="info-name"><span>Block ID</span></div>
            <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
            </svg>
            <span className="info-value">{blockData.id}</span>
            <CopyToClipboard text={ blockData.id }>
              <div className="popup-botton-container">
                  <div className="copy-icon" onClick={ this.showCopyTooltip }></div>
                  <div className={ `button-tooltip${ this.state.copied ? ' button-tooltip-show' : '' }` }><span>Скопировано</span></div>
              </div>
            </CopyToClipboard>
          </div>
          <div className="block-view-page__info_row">
            <div className="info-name"><span>Timestamp</span></div>
            <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
            </svg>
            <span className="info-value">{blockData.timestamp}</span>
          </div>
          <div className="block-view-page__info_row">
            <div className="info-name"><span>№ of Transactions</span></div>
            <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
            </svg>
            <span className="info-value">{blockData.transactions ? blockData.transactions.length : '0'}</span>
          </div>
        </div>
        <div className="block-view-page__raw-panel">
          <div className="raw-panel__title"><div><span>Block Raw JSON</span></div></div>
          <div className="raw-panel__card">
            <SyntaxHighlighter language="javascript" style={ a11yLight }>
{JSON.stringify(blockData, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    )
  }
}