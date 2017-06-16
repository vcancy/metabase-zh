/* eslint "react/prop-types": "warn" */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import S from "./Detail.css";

import cx from "classnames";
import pure from "recompose/pure";
import zh from "metabase/locale/zh.js"
const Detail = ({ name, description, placeholder, subtitleClass, url, icon, isEditing, field }) =>
    <div className={cx(S.detail)}>
        <div className={S.detailBody}>
            <div className={S.detailTitle}>
                { url ?
                    <Link to={url} className={S.detailName}>{name}</Link> :
                    <span className={S.detailName}>{name}</span>
                }
            </div>
            <div className={cx(description ? S.detailSubtitle : S.detailSubtitleLight, { "mt1" : true })}>
                { isEditing ?
                    <textarea
                        className={S.detailTextarea}
                        placeholder={placeholder}
                        {...field}
                        //FIXME: use initialValues from redux forms instead of default value
                        // to allow for reinitializing on cancel (see ReferenceGettingStartedGuide.jsx)
                        defaultValue={description}
                    /> :
                    <span className={subtitleClass}>{description || placeholder || zh["No description yet"]}</span>
                }
                { isEditing && field.error && field.touched &&
                    <span className="text-error">{field.error}</span>
                }
            </div>
        </div>
    </div>

Detail.propTypes = {
    name:               PropTypes.string.isRequired,
    url:                PropTypes.string,
    description:        PropTypes.string,
    placeholder:        PropTypes.string,
    subtitleClass:      PropTypes.string,
    icon:               PropTypes.string,
    isEditing:          PropTypes.bool,
    field:              PropTypes.object
};

export default pure(Detail);
