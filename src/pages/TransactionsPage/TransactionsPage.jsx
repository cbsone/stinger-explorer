import React, {Component} from 'react';
import SearchInput from "../../components/common/SearchInput/SearchInput";
import Table from "../../components/blocks/Table/Table";

import './TransactionsPage.sass';
import * as Api from '../../api/api';

export default class TransactionPage extends Component {

    state = {
        searchValue: '',
        lastSearch: '',
        lastUpdateTime: 0,
        transactions: [],
        noEmpty: true,
        page: 0,
        total: 0,
        loading: true,
    };

    searcher = null;

    handleChange = ({ target: { name, value } }) => {
        // this.setState({
        //     [name]: value
        // })

        console.log('Handle change', name, value)

        if (name === 'searchValue') {
            this.setState({searchValue: value, lastUpdateTime: Date.now()})
        }
    };

    checkSearch = () => {
        let {searchValue, lastSearch, lastUpdateTime} = this.state;

        if (searchValue !== lastSearch) {
            if (Date.now() - lastUpdateTime > 100) {
                this.onPageChanged(0, searchValue);
            }
        }
    }

    onPageChanged = (page, search = '') => {
        this.setState({loading: true})
        Api.getTransactions(page * 10, 10, search.toUpperCase()).then(txes => {
            this.setState({transactions: txes.values, total: txes.count, page, lastSearch: search, loading: false})
        })
    }

    componentDidMount() {
        this.onPageChanged(0);
        this.searcher = setInterval(this.checkSearch, 500);
    }

    componentWillUnmount() {
        clearInterval(this.searcher);
    }

    render() {
        const { searchValue, transactions, page, total, loading } = this.state;

        return (
            <div className="page-blocks">
                <div className="page-blocks__header">
                    <h2>Transactions</h2>
                    <SearchInput
                        className="search-input"
                        name="searchValue"
                        value={ searchValue }
                        onChange={ this.handleChange }
                        placeholder="Search by transaction ID" />
                </div>
                {loading ? <div className="preloader">Loading...</div> : <Table data={ transactions } mode="transactions"  page={ page } total={ total } onPageChanged={(page) => this.onPageChanged(page, this.state.searchValue)}/>}
            </div>
        )
    }
}