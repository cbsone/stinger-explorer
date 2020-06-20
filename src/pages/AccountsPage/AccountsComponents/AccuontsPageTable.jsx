import React, { Component } from "react";
import { Link } from 'react-router-dom'

import CopyButton from "../../../components/common/CopyButton/CopyButton"

import './AccountsPageTable.sass'

function TableItem({ itemData }) {
    return (
        <div className="component-accounts-table__item" to={`/account/${itemData.name}`}>
            <div>
              <Link className="component-accounts-table__item_profile" to={`/account/${itemData.name}`}>
                <div className="profile-avatar" style={{ backgroundImage: `url('${ itemData.avatarURL }')` }}></div>
                <span>{ itemData.name }</span>
              </Link>
            </div>
            <div className="component-accounts-table__item_id">
              <span>{ itemData.ID }</span>
              <CopyButton value={ itemData.ID } />
            </div>
            <div><span>{ itemData.created }</span></div>
            <div className="component-accounts-table__item_cash"><span>{ itemData.balanceCBS }</span><span>CBS</span></div>
            <div className="component-accounts-table__item_cash"><span>{ itemData.balanceCBSCH }</span><span>CBSCH</span></div>
        </div>
    )
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


export default class AccountsPageTable extends Component {

    render() {
        const { data, page, total, onPageChanged } = this.props;

        const tableItems = data.map((item, i) => (
            <TableItem itemData={ item } key={ i } />
        ));

        return (
            <div className="component-accounts-table">
                <div className="component-accounts-table__container">
                    <div className="component-accounts-table__header">
                        <div><span>Account name</span></div>
                        <div><span>ID</span></div>
                        <div><span>Created</span></div>
                        <div><span>CBS balance</span></div>
                        <div><span>CBSCH balance</span></div>
                    </div>
                    <div className="component-accounts-table__body">
                        { tableItems }
                    </div>
                </div>
                <div className="component-accounts-table__pagination">
                    {createPagination(Math.ceil(total / 10), page, onPageChanged)}
                </div>
            </div>
        )
    }
}