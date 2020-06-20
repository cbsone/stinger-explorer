import React, {Component} from 'react';

import './AccountsPage.sass'

import SearchInput from "../../components/common/SearchInput/SearchInput";
import Table from "./AccountsComponents/AccuontsPageTable";
import * as Api from '../../api/api';

export default class AccountsPage extends Component {

    state = {
        searchValue: '',
        lastSearch: '',
        lastUpdateTime: 0,
        data: [],
        page: 0,
        total: 0,
        loading: true,
    };

    handleChange = ({ target: { name, value } }) => {
        this.setState({
            [name]: value
        })

        if (name === 'searchValue') {
            this.setState({searchValue: value, lastUpdateTime: Date.now()})
        }
    };

    checkSearch = () => {
        let {searchValue, lastSearch, lastUpdateTime, loading} = this.state;

        if (loading) return;

        if (searchValue !== lastSearch) {
            if (Date.now() - lastUpdateTime > 100) {
                this.loadAccounts(0, searchValue);
            }
        }
    }

    searcher = null;

    loadAccounts = (page, search) => {
        this.setState({loading: true})
        Api.getAccounts(page * 10, 10, `${search}`.toUpperCase()).then(accounts => {
            const data = accounts.values.map(v => {
                return {
                    avatarURL: '',
                    name: v.name,
                    ID: v.block_id,
                    created: v.creation_date,
                    balanceCBS: `${Api.token_fmt(v.cbs_balance)} CBS`,
                    balanceCBSCH: `${Api.token_fmt(v.cbsch_balance)} CBSCH`,
                }
            })

            this.setState({data, total: accounts.count, page, lastSearch: search, loading: false})
        })
    }

    onPageChanged = (page) => {
        this.loadAccounts(page, this.state.searchValue);
    }

    componentDidMount() {
        this.loadAccounts(0, '')
        this.searcher = setInterval(this.checkSearch, 500);
    }

    componentWillUnmount() {
        clearInterval(this.searcher);
    }

    render() {
        const { searchValue, data, page, total, loading } = this.state;

        return (
            <div className="page-accounts">
                <div className="page-accounts__header">
                    <h2>Accounts</h2>
                    <SearchInput
                        className="search-input"
                        name="searchValue"
                        value={ searchValue }
                        onChange={ this.handleChange }
                        placeholder="Search by account name" />
                </div>
                {loading ? <div className="preloader">Loading...</div> : <Table data={ data } page={ page } total={ total } onPageChanged={ this.onPageChanged }/>}
            </div>
        )
    }
}