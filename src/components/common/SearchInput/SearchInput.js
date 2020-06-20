import React from "react";
import cx from 'classnames'
import './SearchInput.sass'
import { ReactComponent as SearchIcon } from '../../../assets/svg/search-icon.svg';

function SearchInput({ className, name, value, onChange, placeholder }) {
    return (
        <div className={ cx(className, 'component-search-input') }>
            <div className="component-search-input__icon">
                <SearchIcon />
            </div>
            <input
                type="text"
                name={ name }
                value={ value }
                placeholder={ placeholder }
                onChange={ onChange } />
        </div>
    )
}

export default SearchInput