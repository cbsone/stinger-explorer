import React, {Component} from 'react';
import cx from 'classnames'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {notify} from 'react-notify-toast';

import AccountViewTable from './AccountsComponents/AccoountViewTable';
import * as Api from '../../api/api';

import './AccountView.sass'

// import { ReactComponent as AccountLogo } from "../../assets/svg/cbs-account-icon.svg";
// import { ReactComponent as LinkIcon } from "../../assets/svg/link-icon.svg";
// import { ReactComponent as ArrowSmall } from "../../assets/svg/arrow-small-icon.svg";
import { ReactComponent as LockIcon } from "../../assets/svg/lock-icon.svg";
import { ReactComponent as UnlockIcon } from "../../assets/svg/unlock-icon.svg";

const ResourcesLoad = React.forwardRef(function({ title, color, load, value }) {
  return (
    <div className="resource-row">
        <div className="resource-row__name"><span className="main-text text-normal">{ title }</span></div>
        <div className="resource-row__load">
            <svg width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#ebebea" strokeWidth="6" />
                <circle cx="24" cy="24" r="20" fill="none" stroke={ color } strokeWidth="8" strokeDasharray="125.6" strokeDashoffset={`-${125.6 - load * 1.256}`} />
            </svg>
        </div>
        <div className="resource-row__info">
            <span className="main-text text-normal">{ load }%</span>
            <span>{ value }</span>
        </div>
    </div>
  )
})

export default class AccountView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cbs: '0 CBS',
            cbsch: '0 CBSCH',
            txc: 0,
            txes: [],
            txPage: 0,
            pubKeyCopied: false,
            nameCopied: false,
            resourcesOpened: false,
            account: {
                name: '...',
                activeKey: '...',
                ownerKey: '...',
                core_liquid_balance: '...',
                cpu_weight: '...',
                created: '',
                head_block_num: 0,
                head_block_time: '',
                last_code_update: '',
                net_limit: 0,
                net_weight: 0,
                permissions: false,
                privileged: false,
                ram_quota: 0,
                ram_usage: 0,
                refund_request: null,
                rex_info: null,
                self_delegated_bandwidth: false,
                total_resources: null,
                voter_info: null,
            }
        };

        this.refreshBalance = this.refreshBalance.bind(this);

        this.showPubKeyCopyTooltip = this.showPubKeyCopyTooltip.bind(this);
        this.showNameCopyTooltip = this.showNameCopyTooltip.bind(this);
        this.closePubKeyTooltip = this.closePubKeyTooltip.bind(this);
        this.closeNameTooltip = this.closeNameTooltip.bind(this);
    }

    componentDidMount() {
        this.refreshBalance();

        Api.rpc.get_account(this.props.match.params.accountName).then(account => {
            let activeKey = '...';
            let ownerKey = '...';

            account.permissions.forEach(v => {
                switch (v.perm_name) {
                    case 'owner':
                        ownerKey = v.required_auth.keys[0].key;
                    break;
                    case 'active':
                        activeKey = v.required_auth.keys[0].key;
                    break;
                    default:
                    break;
                }
            })

            this.setState({
                account: {
                    name: account.account_name,
                    activeKey,
                    ownerKey,
                    core_liquid_balance: account.core_liquid_balance,
                    cpu_limit: account.cpu_limit,
                    cpu_weight: account.cpu_weight,
                    created: account.created,
                    head_block_num: account.head_block_num,
                    head_block_time: account.head_block_time,
                    last_code_update: account.last_code_update,
                    net_limit: account.net_limit,
                    net_weight: account.new_weight,
                    permissions: account.permissions,
                    privileged: account.privileged,
                    ram_quota: account.ram_quota,
                    ram_usage: account.ram_usage,
                    refund_request: account.refund_request,
                    rex_info: account.rex_info,
                    self_delegated_bandwidth: account.self_delegated_bandwidth,
                    total_resources: account.total_resources,
                    voter_info: account.voter_info,
                }
            })
        }).catch(err => {
            // console.log(err);
            notify.show(`Cannot get account ${this.props.match.params.accountName}: network error`, 'error');
        });
    }

    refreshBalance() {
        Api.rpc.get_currency_balance('eosio.token', this.props.match.params.accountName).then(balances => {
            let cbs = this.state.cbs;
            let cbsch = this.state.cbsch
            balances.map(v => {
                if (`${v}`.endsWith('CBS')) cbs = v;
                else if (`${v}`.endsWith('CBSCH')) cbsch = v;
                return false;
            })

            this.setState({cbs, cbsch});
        }).catch((err) => {
            notify.show('Cannot load account balance: network error', 'warning');
            // console.log(err);
        })
    }

    showPubKeyCopyTooltip() {
        if (this.state.pubKeyCopied) return

        this.setState({ pubKeyCopied: true })

        setTimeout(this.closePubKeyTooltip, 2000)
    }

    showNameCopyTooltip() {
        if (this.state.nameCopied) return

        this.setState({ nameCopied: true })

        setTimeout(this.closeNameTooltip, 2000)
    }

    closePubKeyTooltip() {
        this.setState({ pubKeyCopied: false })
    }

    closeNameTooltip() {
        this.setState({ nameCopied: false })
    }

    toggleResources = () => {
        if (window.innerWidth < 1000) {
            this.setState(({ resourcesOpened }) => ({
                resourcesOpened: !resourcesOpened
            }))
        }
    };

    resourcesInfo(name, value) {
      return (
        <div className="account-resources__info-container_row">
          <div className="info-container_row_label"><span>{ name }</span></div>
          <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
          </svg>
          <span className="info-container_row_value">{ value }</span>
        </div>
      )
    }

    render() {
        const { resourcesOpened, account } = this.state;

        return (
            <div className="acc-view-container">
                <div className="account-stats">
                    <div className="account-stats__column">
                      <div className="account-info">
                          <div className="account-info__image" style={{ backgroundImage: `url('')` }}></div>
                          <div className="account-info__container">
                              <div className="account-info__container_info">
                                  <span className="account-info__container_info_link">{account.created}</span>
                              </div>
                              <div className="account-info__container_info">
                                  <span className="main-text text-normal">{ this.props.match.params.accountName ?? 'Account name'}</span>
                                  <CopyToClipboard text={ this.props.match.params.accountName }>
                                      <div className="popup-botton-container">
                                          <div className="account-info__container_icon" onClick={ this.showNameCopyTooltip }></div>
                                          <div className={ `button-tooltip${ this.state.nameCopied ? ' button-tooltip-show' : '' }` }><span>Скопировано</span></div>
                                      </div>
                                  </CopyToClipboard>
                              </div>
                          </div>
                      </div>
                      <div className="account-keys">
                        <div className="account-keys__row">
                          <div className="account-keys__row_label"><span>Owner Public Key</span></div>
                          <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
                              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
                          </svg>
                          <span className="account-keys__row_value">{Api.shortKey(account.ownerKey)}</span>
                        </div>
                        <div className="account-keys__row">
                          <div className="account-keys__row_label"><span>Active Public Key</span></div>
                          <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
                              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
                          </svg>
                          <span className="account-keys__row_value">{Api.shortKey(account.activeKey)}</span>
                          <CopyToClipboard text={ this.props.activeKey }>
                              <div className="popup-botton-container">
                                  <div className="account-info__container_icon" onClick={ this.showPubKeyCopyTooltip }></div>
                                  <div className={ `button-tooltip${ this.state.pubKeyCopied ? ' button-tooltip-show' : '' }` }><span>Скопировано</span></div>
                              </div>
                          </CopyToClipboard>
                        </div>
                      </div>
                      <div className="balances-wrapper">
                          <div className="balances-wrapper-container">
                              <div className="account-balance account-balance--cbs">
                                  <div className="account-balance__container">
                                      <div className="account-balance__container_balance">
                                          <span>{this.state.cbs.replace('CBS', '')} <span className="account-balance__container_balance_currency">CBS</span></span>
                                      </div>
                                      <div className="account-balance__container_sub-balance">
                                          <LockIcon />
                                          <span>{account.voter_info ? Api.cbsfmt(account.voter_info.staked) : '0'}</span>
                                          <svg className="sub-balance-dot" width="4" height="5" viewBox="0 0 4 5" fill="none">
                                              <circle opacity="0.5" cx="2" cy="2.5" r="2" fill="#3E445B"/>
                                          </svg>
                                          <UnlockIcon />
                                          <span>{account.refund_request ? account.refund_request.net_amount : '0'} </span>
                                      </div>
                                  </div>
                                  <div className="account-balance__icon account-balance__icon-yellow"/>
                              </div>
                              <div className="account-balance account-balance--cbsch">
                                  <div className="account-balance__container">
                                      <div className="account-balance__container_balance">
                                          <span>{this.state.cbsch.replace('CBSCH', '')} <span className="account-balance__container_balance_currency">CBSCH</span></span>
                                      </div>
                                  </div>
                                  <div className="account-balance__icon account-balance__icon-blue"/>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div onClick={ this.toggleResources } className="account-resources">
                        <span className="account-resources__title main-text text-small">Resources</span>
                        {/*<div className={ cx('account-resources__arrow', { 'account-resources__arrow--opened': resourcesOpened }) }>*/}
                        {/*    <ArrowSmall />*/}
                        {/*</div>*/}
                        <div className={ cx('account-resources__container',{ 'account-resources__container--opened': resourcesOpened }) }>
                            <ResourcesLoad title="RAM" load={account.ram_quota ? Api.percent(account.ram_usage, account.ram_quota) * 100: '100'} color="#27AE60" value={`${Api.memfmt(account.ram_usage)} / ${Api.memfmt(account.ram_quota)}`}/>
                            <ResourcesLoad title="CPU" load={account.cpu_limit ? Api.percent(account.cpu_limit.used, account.cpu_limit.max) * 100 : '100'} color="#EB5757" value={account.cpu_limit ? `${Api.cpuTime(account.cpu_limit.used)} / ${Api.cpuTime(account.cpu_limit.max)}`: '0 ns / 0 ns'}/>
                            <ResourcesLoad title="NET" load={account.net_limit ? Api.percent(account.net_limit.used, account.net_limit.max) * 100: '100'} color="#2FA7E3" value={`${Api.memfmt(account.net_limit.used)} / ${Api.memfmt(account.net_limit.max)}`}/>
                        </div>
                        <div className="account-resources__info-container">
                          { this.resourcesInfo('Availbe', this.state.cbs) }
                          { this.resourcesInfo('Refanding', account.refund_request ? account.refund_request.net_amount : '0 CBS') }
                          { this.resourcesInfo('CPU Stacked', account.total_resources ? account.total_resources.cpu_weight : '0 CBS') }
                          { this.resourcesInfo('Net Stacked', account.total_resources ? account.total_resources.net_weight : '0 CBS') }
                          { this.resourcesInfo('Stacked by others', '0 CBS') }
                        </div>
                    </div>
                </div>
                <AccountViewTable
                    accountName={this.props.match.params.accountName}
                    account={account}
                    refreshBalance={this.refreshBalance}
                    balances={{
                        cbs: parseFloat(this.state.cbs.replace(' CBS', '')),
                        cbsch: parseFloat(this.state.cbsch.replace(' CBSCH', '')),
                    }}/>
            </div>
        )
    }
}