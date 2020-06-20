import React, {Component} from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ResourceLoad from '../../components/common/ResourceLoad/ResourceLoad'
import InfoTable from './InfoTable/InfoTable'
import { ReactComponent as InfoIcon } from '../../assets/svg/information-icon.svg'
import cx from 'classnames'

import './InfoPage.sass'
import * as Api from '../../api/api';

export default class InfoPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ram_load: 100,
            ram_value: '0/0 GB',
            cbs_load: 100,
            cbs_value: '1000/1000',
            block: {
                block_cpu_limit: 199900,
                block_net_limit: 1048576,
                chain_id: "a2687bf53e2b282ad62d7e17f99c8e98075488a73ce596001838ac92e79b667a",
                fork_db_head_block_id: "001d2ba9a8607d0b36f00d9c9a4d40365f32198a28bf870d604f35825ccc611f",
                fork_db_head_block_num: 1911721,
                head_block_id: "001d2ba9a8607d0b36f00d9c9a4d40365f32198a28bf870d604f35825ccc611f",
                head_block_num: 1911721,
                head_block_producer: "eosio",
                head_block_time: "2020-06-05T10:18:11.500",
                last_irreversible_block_id: "001d2ba84e735d4c16a75d263c14813e898815930b4fefa95183bbc2f1260458",
                last_irreversible_block_num: 1911720,
                server_full_version_string: "v2.0.5-38b17d7bb2cd66ff75202b93705bc88cfd71f20c",
                server_version: "38b17d7b",
                server_version_string: "v2.0.5",
                virtual_block_cpu_limit: 200000000,
                virtual_block_net_limit: 1048576000
            },
            _refresh: false,
            cbs_supply: 0,
            copy1: false,
            copy2: false,
        };

        this.block1Copy = this.block1Copy.bind(this)
        this.block2Copy = this.block2Copy.bind(this)
    }

    blockInfoRef = null

    copyIcon(value, onCopy, showTooltip) {
        return (
            <CopyToClipboard text={ value }>
                <div className="popup-botton-container">
                    <div className="copy-icon" onClick={ onCopy }></div>
                    <div className={ cx('button-tooltip', { 'button-tooltip-show' : showTooltip }) }><span>Скопировано</span></div>
                </div>
            </CopyToClipboard>
        )
    }

    infoRow({ parametr, value, copy = false, onCopy, showTooltip = false }) {
        return (
            <div className="info-container__row">
                <div className="info-container__row_parametr">
                    <span>{ parametr }</span>
                </div>
                <svg width="4" height="5" viewBox="0 0 4 5" fill="none">
                    <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
                </svg>
                <div className="info-container__row_value">
                    {/* <span>{ copy ? `${value}`.substring(0, 6) + '...' + value.substring(0, -3) : value }</span> */}
                    <span>{ value }</span>
                </div>
                { copy ? this.copyIcon(value, onCopy, showTooltip) : null }
            </div>
        )
    }

    block1Copy() {
        if (this.state.copy1) return

        this.setState({ copy1: true })

        const close = () => this.setState({ copy1: false })

        setTimeout(close, 2000)
    }

    block2Copy() {
        if (this.state.copy2) return

        this.setState({ copy2: true })

        const close = () => this.setState({ copy2: false })

        setTimeout(close, 2000)
    }

    handleMouseOver = () => {
        this.blockInfoRef.style.opacity = 1;
        this.blockInfoRef.style.transform = 'translateY(0)'
        this.blockInfoRef.style.pointerEvents = 'auto'
    };

    handleMouseOut = () => {
        this.blockInfoRef.style = {};
    };

    componentDidMount() {
        Api.getResLoad().then(stats => {
            const ram_load = stats.ram_total > 0 ? Api.percent(stats.ram_used, stats.ram_total) : 100;
            const ram_value = Api.memfmt(stats.ram_used) + '/' + Api.memfmt(stats.ram_total);
            const cbs_load = Api.percent(stats.cbs_staked, stats.cbs_total);
            const cbs_value = `${Math.round(stats.cbs_staked * 100) / 100}/${Math.round(stats.cbs_total * 100) / 100} CBS`;
            this.setState({ram_load, ram_value, cbs_load, cbs_value, cbs_supply: stats.cbs_total});
        })
        
        if (!this.state._refresh) {
            const _refresh = setInterval(() => {
                Api.rpc.get_info().then(block => this.setState({block}))
            }, 500)

            this.setState({_refresh})
        }
    }

    componentWillUnmount() {
        if (this.state._refresh) clearInterval(this.state._refresh);
    }

    render() {
        return (
            <div className="info-page">
                <div className="page-title-row">
                    <div className="page-title-row__page-name">
                        <span>Summary</span>
                    </div>
                    <button onMouseOver={ this.handleMouseOver }
                            onMouseOut={ this.handleMouseOut }
                            className="m-info-page__btn-block-info">
                        Block info
                        <InfoIcon />
                    </button>
                </div>
                <div className="info-top-row">
                    <div className="info-top-row__load-card">
                        <div className="info-top-row__load-card_item">
                            <div className="chips-title">
                                <span>Ram</span>
                            </div>
                            <ResourceLoad
                                load={this.state.ram_load}
                                color='#27AE60'
                                value={this.state.ram_value} />
                        </div>
                        <div className="info-top-row__load-card_item">
                            <div className="chips-title">
                                <span>CBS supply/staking</span>
                            </div>
                            <ResourceLoad
                                load={this.state.cbs_load}
                                color='#F8A303'
                                value={this.state.cbs_value} />
                        </div>
                    </div>
                    <div ref={ el => this.blockInfoRef = el } className="info-top-row__block-info">
                        <div className="info-container">
                            <div className="info-container__title">
                                <span>Head Block Information</span>
                            </div>
                            { this.infoRow({ parametr: 'Block Number', value: this.state.block.head_block_num }) }
                            { this.infoRow({ parametr: 'Block ID', value: this.state.block.head_block_id, copy: true, onCopy: this.block1Copy, showTooltip: this.state.copy1 }) }
                            { this.infoRow({ parametr: 'Timestamp', value: this.state.block.head_block_time }) }
                            { this.infoRow({ parametr: 'Block Producer', value: this.state.block.head_block_producer }) }
                        </div>
                        <div className="info-container info-container--last">
                            <div className="info-container__title">
                                <span>Last irreversible block information</span>
                            </div>
                            { this.infoRow({ parametr: 'Block Number', value: this.state.block.last_irreversible_block_num }) }
                            { this.infoRow({ parametr: 'Block ID', value: this.state.block.last_irreversible_block_id, copy: true, onCopy: this.block2Copy, showTooltip: this.state.copy2 }) }
                        </div>
                    </div>
                </div>
                <InfoTable supply={this.state.cbs_supply} />
            </div>
        )
    }
}