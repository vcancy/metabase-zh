/* eslint "react/prop-types": "warn" */
import React from "react";
import PropTypes from "prop-types";
import S from "./SearchHeader.css";

import Icon from "metabase/components/Icon.jsx";

import cx from "classnames";
import zh from "metabase/locale/zh.js"
const SearchHeader = ({ searchText, setSearchText }) =>
    <div className={S.searchHeader}>
        <Icon className={S.searchIcon} name="search" size={18} />
        <input
            className={cx("input bg-transparent", S.searchBox)}
            type="text"
            placeholder={zh["Filter this list..."]}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
        />
    </div>

SearchHeader.propTypes = {
    searchText: PropTypes.string.isRequired,
    setSearchText: PropTypes.func.isRequired,
};

export default SearchHeader;
