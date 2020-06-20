import React, { Component } from "react";
import { Link } from 'react-router-dom'
import CopyButton from "../../common/CopyButton/CopyButton"

import './Table.sass'

function TableItem({ itemData, mode }) {
    return (
        <div className="component-blocks-table__item">
            <div className="component-blocks-table__col component-blocks-table__col--block-num">
                <p>{ itemData.block_num }</p>
            </div>
            <div className="component-blocks-table__col component-blocks-table__col--block-id">
                <p>
                    <Link to={ `/${ mode === 'blocks' ? 'block' : 'transaction' }/${mode === 'blocks' ? itemData.block_id : itemData.id}` }>{ mode === 'blocks' ? itemData.block_id : itemData.id }</Link>
                </p>
                <CopyButton value={ mode === 'blocks' ? itemData.block_id : itemData.id } />
            </div>
            <div className="component-blocks-table__col component-blocks-table__col--transaction-num">
                {
                    mode === 'blocks' &&
                    <p>{ itemData.tx_count ? itemData.tx_count : itemData.transactions.length }</p>
                }
            </div>
            <div className="component-blocks-table__col component-blocks-table__col--time">
                <p>{ itemData.timestamp }</p>
            </div>
        </div>
    )
}

class Table extends Component {

    render() {
        const { data, mode, total, page, onPageChanged } = this.props;

        // при подключении бэка надо поменять ключ на уникальное значение, вместо индекса

        const tableItems = data.map((item, index) => (
            <TableItem key={ index } itemData={ item } mode={ mode } />
        ));

        return (
            <div className="component-blocks-table">
                <div className="component-blocks-table__container">
                    <div className="component-blocks-table__header">
                        <div className="component-blocks-table__col component-blocks-table__col--block-num">
                            <p>№ Block</p>
                        </div>
                        <div className="component-blocks-table__col component-blocks-table__col--block-id">
                            <p>{ mode === 'blocks' ? 'Block ID' : 'Transaction ID'}</p>
                        </div>
                        <div className="component-blocks-table__col component-blocks-table__col--transaction-num">
                            {
                                mode === 'blocks' &&
                                <p>№ of Transactions</p>
                            }
                        </div>
                        <div className="component-blocks-table__col component-blocks-table__col--time">
                            <p>Timestamp</p>
                        </div>
                    </div>
                    <div className="component-blocks-table__body">
                        { tableItems }
                    </div>
                </div>
                <div className="component-blocks-table__pagination">
                    {createPagination(Math.ceil(total / 10), page, onPageChanged)}
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

export default Table
