import React from "react";
import cx from 'classnames'
import './Input.sass'

function Input({ className, name, value, label, type = 'text', onChange, maxValue }) {

    function setMaxValue() {
        onChange({ target: { name, value: maxValue } })
    }

    return (
        <div className={ cx(className, 'component-input') }>
            <input
                className={ cx({ 'component-input__input-full': value !== '' }) }
                type={ type }
                name={ name }
                id={ name }
                value={ value }
                onChange={ onChange }/>
            <label htmlFor={ name }>{ label }</label>
            {
                type === 'number' && maxValue !== undefined &&
                <button type="button" onClick={ setMaxValue } className="component-input__btn-max">
                    <div className="component-input__btn-max__hover-layer" />
                    <span>max</span>
                </button>
            }
        </div>
    )
}

export default Input