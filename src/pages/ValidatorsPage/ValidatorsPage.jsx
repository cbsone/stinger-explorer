import React, {Component} from 'react';

import './ValidatorsPage.sass'

import SearchInput from "../../components/common/SearchInput/SearchInput";
import Table from "./ValidatorsPageTable";
import * as Api from '../../api/api';

export default class ValidatorsPage extends Component {

    state = {
        searchValue: '',
        data: [],
        loading: true,
    };

    handleChange = ({ target: { name, value } }) => {
        this.setState({
            [name]: value
        })

        if (name === 'searchValue') {
            Api.getStaked(value).then(data => this.setState({data}))
        }
    };

    componentDidMount() {
        Api.getStaked('').then(data => this.setState({data, loading: false}))
    }

    render() {
        const { searchValue, data, loading } = this.state;

        return (
            <div className="page-validators">
                <div className="page-validators__header">
                    <h2>Validators</h2>
                    <SearchInput
                        className="search-input"
                        name="searchValue"
                        value={ searchValue }
                        onChange={ this.handleChange }
                        placeholder="Search by account name" />
                </div>
                {loading ? <div className="preloader">Loading...</div> : <Table data={ data } />}
            </div>
        )
    }
}