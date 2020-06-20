import React, {Component} from 'react';
import './BlocksPage.sass'
import SearchInput from "../../components/common/SearchInput/SearchInput";
import Switcher from "../../components/blocks/Switcher/Switcher";
import Table from "../../components/blocks/Table/Table";

import * as Api from '../../api/api';

export default class BlocksPage extends Component {

    state = {
        searchValue: '',
        lastSearch: '',
        lastUpdateTime: 0,
        blocks: [],
        noEmpty: true,
        page: 0,
        total: 0,
        loading: true,
    };

    handleChange = ({ target: { name, value } }) => {
        // this.setState({
        //     [name]: value
        // })

        if (name === 'searchValue') {
            // this.getBlocksPage(0, this.state.noEmpty, value)
            this.setState({searchValue: value, lastUpdateTime: Date.now()})
        } else if (name === 'noEmpty') {
            this.getBlocksPage(0, value, this.state.searchValue)
        }
    };

    checkSearch = () => {
        let {searchValue, lastSearch, lastUpdateTime, noEmpty, page, loading} = this.state;

        if (loading) return;

        if (searchValue !== lastSearch) {
            if (Date.now() - lastUpdateTime > 100) {
                this.getBlocksPage(0, noEmpty, searchValue);
            }
        }

        if (page === 0 && !noEmpty && lastSearch === '' && !loading) this.recvLastProducedBlock()
    }

    searcher = null;

    recvLastProducedBlock = () => {
        Api.rpc.get_info().then(info => {
            let {blocks} = this.state;
            if (blocks.length && info.head_block_num > blocks[0].block_num) {
                Api.rpc.get_block(info.head_block_num).then(block => {
                    block.block_id = block.id;
                    this.setState({blocks: [block, ...blocks.slice(0, blocks.length-1)]})
                })
            }
        })
    }

    getBlocksPage = (page, noEmpty, search = '') => {
        this.setState({loading: true});
        Api.getBlocks(noEmpty, page * 10, 10, search.toUpperCase()).then(blocks => {
            this.setState({blocks: blocks.values, page, total: blocks.count, noEmpty, lastSearch: search, loading: false})
        })
    }

    componentDidMount() {
        this.getBlocksPage(0, false);
        this.searcher = setInterval(this.checkSearch, 500);
    }

    componentWillUnmount() {
        clearInterval(this.searcher);
    }

    render() {
        const { searchValue, blocks, noEmpty, page, total, loading } = this.state;

        return (
            <div className="page-blocks">
                <div className="page-blocks__header">
                    <h2>Blocks</h2>
                    <SearchInput
                        className="search-input"
                        name="searchValue"
                        value={ searchValue }
                        onChange={ this.handleChange }
                        placeholder="Search by block ID" />
                    <Switcher
                        className="page-blocks__header__switcher"
                        label="No Empty blocks"
                        name="noEmpty"
                        value={noEmpty }
                        onChange={ this.handleChange } />
                </div>
                {loading ? <div className="preloader">Loading...</div> : <Table data={ blocks } mode="blocks" page={ page } total={ total } onPageChanged={(page) => this.getBlocksPage(page, noEmpty, this.state.searchValue)}/>}
            </div>
        )
    }
}