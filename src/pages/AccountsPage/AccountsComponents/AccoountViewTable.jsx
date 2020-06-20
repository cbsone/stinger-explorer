import React, {Component} from 'react';
import cx from 'classnames'
// import {notify} from 'react-notify-toast';
// import JSSalsa20 from "js-salsa20";

// import SendPopup from "../../../components/wallet/SendPopup/SendPopup";
// import ReceivePopup from "../../../components/wallet/ReceivePopup/ReceivePopup";
import * as Api from '../../../api/api';

import './AccoountViewTable.sass'

// import { ReactComponent as WalletSendIcon } from "../../../assets/svg/wallet-send-icon.svg";
// import { ReactComponent as WalletReceiveIcon } from "../../../assets/svg/wallet-receive-icon.svg";
// import { ReactComponent as TableSendIcon } from "../../../assets/svg/table-send-icon.svg";
// import { ReactComponent as TableReceiveIcon } from "../../../assets/svg/table-receive-icon.svg";

export default class AccountViewTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            txCount: 0,
            total: 0,
            page: 0,
            txes: [],
            direct: '',
            currency: '',
            filterCategory: '',
            filterContract: '',
            filterAction: '',
            filterLastCategory: '',
            filterLastContract: '',
            filterLastAction: '',
            lastUpdateTime: 0,
            loaded: false,
            loading: true,
        }

        this.getPage = this.getPage.bind(this)
        this.onSend = this.onSend.bind(this)
        this.clearFilter = this.clearFilter.bind(this)
        this.refreshFilter = this.refreshFilter.bind(this)
        this.checkSearch = this.checkSearch.bind(this);
    }

    getPage(page, category, contract, action) {
        // Api.get_wallet_txes(this.props.accountName, page, currency, direct).then(data => {
        //     this.setState({
        //         txCount: data.cnt,
        //         pages: data.pages,
        //         page: page,
        //         txes: data.txes,
        //         direct: direct,
        //         currency: currency,
        //     })
        // })

        this.setState({loading: true})

        Api.getActions(page * 10, 10, {
            account: this.props.accountName,
            contract,
            action,
            category,
        }).then(values => {
            this.setState({
                txes: values.values.map((v, i) => {
                    return {
                        key: i,
                        tx: v.txid.substr(0, 8),
                        date: v.block.timestamp.split('T')[0],
                        time: v.block.timestamp.split('T')[1].replace('Z', ''),
                        action: Api.actCategory(v.act_name),
                        mrootAction: v.block.action_mroot,
                        mrootTransaction: v.block.transaction_mroot,
                        confirmed: v.block.confirmed,
                        newProdusers: v.block.new_producers,
                        produser: v.block.producer,
                        previos: v.block.previous,
                        sheduleVersion: v.block.schedule_version,
                        timestamp: Date.parse(v.block.timestamp),
                    }
                }),
                total: values.count,
                page,
                filterLastCategory: category,
                filterLastContract: contract,
                filterLastAction: action,
                lastUpdateTime: Date.now(),
                loading: false
            })
        })
    }

    checkSearch = () => {
        let {filterAction, filterContract, filterCategory, filterLastContract, filterLastAction, lastUpdateTime, filterLastCategory, loading} = this.state;

        if (loading) return;

        if (filterContract !== filterLastContract || filterAction !== filterLastAction || filterCategory !== filterLastCategory) {
            if (Date.now() - lastUpdateTime > 100) {
                this.getPage(0, filterCategory, filterContract, filterAction);
            }
        }
    }

    searcher = null;

    componentDidMount() {
        if (!this.state.loaded) this.getPage(0, '', '');
        this.searcher = setInterval(this.checkSearch, 500);
    }

    componentWillUnmount() {
        clearInterval(this.searcher);
    }

    toggleSendPopup = () => {
        this.setState(({ sendPopupOpened }) => ({
            sendPopupOpened: !sendPopupOpened
        }))
    };

    toggleRecvPopup = () => {
        this.setState(({ recvPopupOpened }) => ({
            recvPopupOpened: !recvPopupOpened
        }))
    }

    onSend(options) {
    }

    TableRow({ key, tx, date, time, action, mrootAction, mrootTransaction, confirmed, newProdusers, produser, previos, sheduleVersion, timestamp }) {
        return (
            <div key={ key } className="table-container__table-row">
                <div>{ tx }</div>
                <div className="table-container__table-row_date-time">{ date } • <span>{ time }</span></div>
                <div>
                    <div className="table-container__table-row_action">
                        <span>{ action }</span>
                    </div>
                </div>
                <div className="table-container__table-row_data">
                    <span>header: action_mroot: </span>
                    <span className="table-container__table-row_data_key">{ mrootAction }</span>
                </div>
                <div className="table-container__table-row_data_popup">
                    <div><span>header:</span></div>
                    <div><span>action_mroot: </span><span>{ mrootAction }</span></div>
                    <div><span>confirmed: </span><span>{ confirmed }</span></div>
                    <div><span>new_producers: </span><span>{ newProdusers }</span></div>
                    <div><span>previous: </span><span>{ previos }</span></div>
                    <div><span>producer: </span><span>{ produser }</span></div>
                    <div><span>schedule_version: </span><span>{ sheduleVersion }</span></div>
                    <div><span>timestamp: </span><span>{ timestamp }</span></div>
                    <div><span>transaction_mroot: </span><span>{ mrootTransaction }</span></div>
                </div>
            </div>
        )
    }

    filterCategoryItem({ active, label, onClick }) {
        return (
            <div className={ cx('filter-categiry-radio', { 'categiry-radio-active' : active }) } onClick={ onClick }>
                <span>{ label }</span>
            </div>
        )
    }

    clearFilter() {
        this.setState({
            filterCategory: '',
            filterContract: '',
            filterAction: ''
        })

        this.getPage(0, '', '', '')
    }

    refreshFilter() {
        // console.log('jepa o-o');
        this.getPage(this.state.page, this.state.filterCategory, this.state.filterContract, this.state.filterAction)
    }

    filterTextInput({ value, onChange, onClear }) {
        return (
            <div className="filter-input">
                <span className="filter-input__search-icon"></span>
                <input type="text" name="filter-contract" id="filter-contract" value={ value } onChange={ onChange }/>
                <span className="filter-input__clear-icon" onClick={ onClear }></span>
            </div>
        )
    }

    render() {
        const {txes, page, total, loading} = this.state;

        return (
            <div className="acc-view-table">
                <div className="acc-view-table__top-row">
                    <span className="main-text text-normal">Transactions</span>
                </div>
                <div className="acc-view-table__table-container">
                    <div className="acc-view-table__filters">
                        <div className="filters__title-row">
                            <span className="filters__title-row_label">Filter</span>
                            <div className="filters__title-row_buttons">
                                <div className="filter-title-button" onClick={ this.clearFilter }>
                                    <div className="filter-title-button__icon icon-close"></div>
                                    <span className="filter-title-button__label">Сlear filter</span>
                                </div>
                                <div className="filter-title-button" onClick={ this.refreshFilter }>
                                    <div className="filter-title-button__icon icon-refresh"></div>
                                    <span className="filter-title-button__label">Refresh</span>
                                </div>
                            </div>
                        </div>
                    </div>                    
                    <div className="filters__filter-row">
                        <div className="filters__filter-row_label"><span>Categoty action</span></div>
                        <div className="filters__filter-row__options">
                            { this.filterCategoryItem({
                                active: this.state.filterCategory === 'token',
                                label: 'Send Token',
                                // onClick: () => this.getPage(0, 'token', this.state.filterContract, this.state.filterAction),
                                onClick: () => this.setState({filterCategory: 'token'})
                            }) }
                            { this.filterCategoryItem({
                                active: this.state.filterCategory === 'contract',
                                label: 'Contract',
                                // onClick: () => this.getPage(0, 'contract', this.state.filterContract, this.state.filterAction),
                                onClick: () => this.setState({filterCategory: 'contract'})
                            }) }
                            { this.filterCategoryItem({
                                active: this.state.filterCategory === 'account',
                                label: 'Account',
                                // onClick: () => this.getPage(0, 'account', this.state.filterContract, this.state.filterAction),
                                onClick: () => this.setState({filterCategory: 'account'})
                            }) }
                            { this.filterCategoryItem({
                                active: this.state.filterCategory === 'ram_cpu_net',
                                label: 'RAM/CPU/NET',
                                // onClick: () => this.getPage(0, 'ram_cpu_net', this.state.filterContract, this.state.filterAction),
                                onClick: () => this.setState({filterCategory: 'ram_cpu_net'})
                            }) }
                        </div>
                    </div>
                    <div className="filters__filter-row">
                        <div className="filters__filter-row_label"><span>Contract/Action</span></div>
                        <div className="filters__filter-row__inputs">
                            { this.filterTextInput({
                                value: this.state.filterContract,
                                onChange: event => this.setState({ filterContract: event.target.value }),
                                onClear: () => this.setState({ filterContract: '' }),
                            }) }
                            { this.filterTextInput({
                                value: this.state.filterAction,
                                onChange: event => this.setState({ filterAction: event.target.value }),
                                onClear: () => this.setState({ filterAction: '' }),
                            }) }
                        </div>
                    </div>
                    {loading ? <div className="preloader">Loading...</div> : (<>
                    <div className="acc-view-table__table-container__content">
                        <div className="acc-view-table__table-container_titles">
                            <div><span className="main-text text-small">TX</span></div>
                            <div><span className="main-text text-small">Date • Time </span></div>
                            <div><span className="main-text text-small">Action</span></div>
                            <div><span className="main-text text-small">Data</span></div>
                        </div>
                        <div className="acc-view-table__table-container_body">
                            { txes.map(tx => this.TableRow(tx)) }
                        </div>
                    </div>
                    <div className="acc-view-table__pagination">
                        {createPagination(Math.ceil(total / 10), page, (page) => this.getPage(page, this.state.filterCategory, this.state.filterContract, this.state.filterAction))}
                    </div></>)}
                </div>
            </div>
        )
    }
}


function createPagination(pagesCount, page, onClick) {
    let items = [];
    
    if (page > 0) {
        items.push(<span onClick={() => onClick(page - 1)} key={items.length}>{ '<' }</span>)
      } else {
        items.push(<span key={items.length}>{ '<' }</span>)
      }
    
      if (pagesCount < 5) {
        for (let i = 0; i < pagesCount; i++) {
          items.push(<span onClick={() => onClick(i)} key={items.length} className={i === page ? 'pagination__active' : null}>{i + 1}</span>)
        }
      } else {
        items.push(<span onClick={() => onClick(0)} key={items.length} className={0 === page ? 'pagination__active' : null}>1</span>)
        if (page < 3) {
          items.push(<span onClick={() => onClick(1)} key={items.length} className={1 === page ? 'pagination__active' : null}>2</span>)
          items.push(<span onClick={() => onClick(2)} key={items.length} className={2 === page ? 'pagination__active' : null}>3</span>)
    
          if (page === 2) items.push(<span onClick={() => onClick(3)} key={items.length} className={3 === page ? 'pagination__active' : null}>4</span>)
        } else { 
          items.push(<span>...</span>);
          items.push(<span onClick={() => onClick(page-1)} key={items.length}>{page}</span>)
          items.push(<span onClick={() => onClick(page)} key={items.length}  className={'pagination__active'}>{page+1}</span>)
        }
    
        if (pagesCount - page > 2) {
              if (page >= 3) {
              items.push(<span onClick={() => onClick(page+1)} key={items.length}>{page+2}</span>);
              }
              
              if (page < pagesCount-3) items.push(<span>...</span>);
              items.push(<span onClick={() => onClick(pagesCount-1)} key={items.length} className={pagesCount-1 === page ? 'pagination__active' : null}>{pagesCount}</span>)
          } else if (page !== pagesCount-1) {
              items.push(<span onClick={() => onClick(pagesCount-1)} key={items.length}> className={pagesCount-1 === page ? 'pagination__active' : null}{pagesCount}</span>)
          }
      }
  
      if (page < pagesCount-1) {
          items.push(<span onClick={() => onClick(page + 1)} key={items.length}>{ '>' }</span>)
      } else {
          items.push(<span key={items.length}>{ '>' }</span>)
      }


    return items;
}
