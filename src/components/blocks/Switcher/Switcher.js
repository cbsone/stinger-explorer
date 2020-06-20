import React from "react";
import './Switcher.sass'
import cx from 'classnames'

function Switcher({ className, name, value, label, onChange }) {

    function handleClick() {
        onChange({ target: { name, value: !value } })
    }

    return (
        <div onClick={ handleClick } className={ cx(className, 'component-switcher') }>
            <div className={ cx('component-switcher__body', { 'component-switcher__body--active': value }) } />
            <p>{ label }</p>
        </div>
    )
}

export default Switcher