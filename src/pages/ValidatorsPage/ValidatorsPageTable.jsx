import React, { Component } from "react";
import './ValidatorsPageTable.sass'

function TableItem({ itemData }) {
    let todayClass = ''

    if (itemData.votesToday.charAt(0) === '+') todayClass = 'text-green'
    if (itemData.votesToday.charAt(0) === '-') todayClass = 'text-red'

    return (
        <div className="component-validators-table__item">
          <div><span>{ itemData.rank }</span></div>
            <div className="component-validators-table__item_profile">
              <div className="profile-avatar" style={{ backgroundImage: `url('${ itemData.avatarURL }')` }}></div>
              <span>{ itemData.name }</span>
            </div>
            <div><span>{ itemData.status }</span></div>
            <div><span>{ itemData.votes }</span></div>
            <div className="component-validators-table__item_total-votes">
              <span>{ itemData.totalVotes ?? '0' }</span>
              <span className={ todayClass }>{ itemData.votesToday }</span>
            </div>
            <div><span>{ itemData.revards }</span></div>
        </div>
    )
}

export default class ValidatorsPageTable extends Component {

    render() {
        const { data } = this.props;

        const tableItems = data.map((item, _) => (
            <TableItem itemData={ item } />
        ));

        return (
            <div className="component-validators-table">
                <div className="component-validators-table__container">
                    <div className="component-validators-table__header">
                        <div><span>Rank</span></div>
                        <div><span>Name</span></div>
                        <div><span>Status</span></div>
                        <div><span>Votes (%)</span></div>
                        <div className="component-validators-table__header_total">
                            <span>Total votes</span>
                            <span>Today</span>
                        </div>
                        <div><span>Rewards per Day</span></div>
                    </div>
                    <div className="component-validators-table__body">
                        { tableItems }
                    </div>
                </div>
                {/* <div className="component-validators-table__pagination">
                    <span>{ '<' }</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>...</span>
                    <span>156</span>
                    <span>{ '>' }</span>
                </div> */}
            </div>
        )
    }
}