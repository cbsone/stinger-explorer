import React from "react";
import cx from 'classnames'
import './Switcher.sass'

function Switcher({ className, name, value, onChange }) {

    function handleClick(modeValue) {
        return function () {
            onChange({ target: { name, value: modeValue } })
        }
    }

    return (
        <div className={ cx(className, 'switcher-container') }>
            <button type="button" tabIndex={ 0 } className={ cx('switcher__value', 'switcher-value--cbs', { 'switcher__value--active': value === 'CBS' }) }
                  onClick={ handleClick('CBS') }>
                CBS
            </button>
            <button type="button" tabIndex={ 0 } className={ cx('switcher__value', 'switcher-value--cbsch', { 'switcher__value--active': value === 'CBSCH' }) }
                  onClick={ handleClick('CBSCH') }>
                CBSCH
            </button>
            <div className="switcher__body" />
        </div>
    )
}

export default Switcher