import React from "react"

import './ResourceLoad.sass'

function ResourceLoad({ load, color, value }) {
  return (
    <div className="resource-row">
        <div className="resource-row__load">
            <svg viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#ebebea" strokeWidth="6" />
                <circle cx="24" cy="24" r="20" fill="none" stroke={ color } strokeWidth="8" strokeDasharray="125.6" strokeDashoffset={`-${ 125.6 - load * 1.256 }`} />
            </svg>
        </div>
        <div className="resource-row__info">
            <span>{ load }%</span>
            <span>{ value }</span>
        </div>
    </div>
  )
}

export default ResourceLoad