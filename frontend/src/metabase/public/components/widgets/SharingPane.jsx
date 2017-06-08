/* @flow */

import React, { Component } from "react";

import RetinaImage from "react-retina-image";
import Icon from "metabase/components/Icon";
import Toggle from "metabase/components/Toggle";
import CopyWidget from "metabase/components/CopyWidget";
import Confirm from "metabase/components/Confirm";

import { getPublicEmbedHTML } from "metabase/public/lib/code";

import cx from "classnames";

import type { EmbedType, EmbeddableResource } from "./EmbedModalContent";

import MetabaseAnalytics from "metabase/lib/analytics";
import zh from "metabase/locale/zh.js"
type Props = {
    resourceType: string,
    resource: EmbeddableResource,
    extensions?: string[],
    isAdmin: bool,
    isPublicSharingEnabled: bool,
    isApplicationEmbeddingEnabled: bool,
    onCreatePublicLink: () => Promise<void>,
    onDisablePublicLink: () => Promise<void>,
    getPublicUrl: (resource: EmbeddableResource, extension: ?string) => string,
    onChangeEmbedType: (embedType: EmbedType) => void,
};

type State = {
    extension: ?string,
};

export default class SharingPane extends Component<*, Props, State> {
    props: Props;
    state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
            extension: null
        };
    }

    static defaultProps = {
        extensions: []
    };

    render() {
        const {
            resource, resourceType,
            onCreatePublicLink, onDisablePublicLink,
            extensions,
            getPublicUrl,
            onChangeEmbedType,
            isAdmin,
            isPublicSharingEnabled,
            isApplicationEmbeddingEnabled
        } = this.props;

        const publicLink = getPublicUrl(resource, this.state.extension);
        const iframeSource = getPublicEmbedHTML(getPublicUrl(resource));

        return (
            <div className="pt2 ml-auto mr-auto" style={{ maxWidth: 600 }}>
                { isAdmin && isPublicSharingEnabled &&
                    <div className="pb2 mb4 border-bottom flex align-center">
                        <h4>{zh["Enable sharing"]}</h4>
                        <div className="ml-auto">
                            { resource.public_uuid ?
                                <Confirm
                                    title={zh["Disable this public link?"]}
                                    content={zh["This will cause the existing link to stop working. You can re-enable it, but when you do it will be a different link."]}
                                    action={() => {
                                        MetabaseAnalytics.trackEvent("Sharing Modal", "Public Link Disabled", resourceType);
                                        onDisablePublicLink();
                                    }}
                                >
                                    <Toggle value={true} />
                                </Confirm>
                            :
                                <Toggle value={false} onChange={() => {
                                    MetabaseAnalytics.trackEvent("Sharing Modal", "Public Link Enabled", resourceType);
                                    onCreatePublicLink();
                                }}/>
                            }
                        </div>
                    </div>
                }
                <div className={cx("mb4 flex align-center", { disabled: !resource.public_uuid })}>
                    <div style={{ width: 98, height: 63 }} className="bordered rounded shadowed flex layout-centered">
                        <Icon name="link" size={32} />
                    </div>
                    <div className="ml2 flex-full">
                        <h3 className="text-brand mb1">{zh["Public link"]}</h3>
                        <div className="mb1">Share this with people who don't have a Metabase account using the URL below:</div>
                        <CopyWidget value={publicLink} />
                        { extensions && extensions.length > 0 &&
                            <div className="mt1">
                                {extensions.map(extension =>
                                    <span
                                        className={cx("cursor-pointer text-brand-hover text-bold text-uppercase",
                                            extension === this.state.extension ? "text-brand" : "text-grey-2"
                                        )}
                                        onClick={() => this.setState({ extension: extension === this.state.extension ? null : extension })}
                                    >
                                        {extension}{" "}
                                    </span>
                                )}
                            </div>
                        }
                    </div>
                </div>
                <div className={cx("mb4 flex align-center", { disabled: !resource.public_uuid })}>
                    <RetinaImage
                        width={98}
                        src="/app/img/simple_embed.png"
                        forceOriginalDimensions={false}
                    />
                    <div className="ml2 flex-full">
                        <h3 className="text-green mb1">{zh["Public embed"]}</h3>
                        <div className="mb1">Embed this in blog posts or web pages by copying and pasting this snippet:</div>
                        <CopyWidget value={iframeSource} />
                    </div>
                </div>
                { isAdmin &&
                    <div
                        className={cx("mb4 flex align-center cursor-pointer", { disabled: !isApplicationEmbeddingEnabled })}
                        onClick={() => onChangeEmbedType("application")}
                    >
                        <RetinaImage
                            width={100}
                            src="/app/img/secure_embed.png"
                            forceOriginalDimensions={false}
                        />
                        <div className="ml2 flex-full">
                            <h3 className="text-purple mb1">{zh["Embed this in an application"]}</h3>
                            <div className="">By integrating with your application server code, you can provide a secure stats  limited to a specific user, customer, organization, etc.</div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
