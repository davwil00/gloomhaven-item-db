import { Component } from "react";
import ConfigurationState from "../../State/ConfigurationState";
import React from "react";
import { Form, Message, Icon } from "semantic-ui-react";
import { storeShareLockSpoilerPanel } from "../../State/ItemViewState";

type Props = {
    shareLockSpoilerPanel: boolean,
    spoilerFilter: ConfigurationState,
    storeShareLockSpoilerPanel: (shareLockSpoilerPanel: boolean) => {}
}

class SaveTab extends Component<Props> {
    render() {
        const {shareLockSpoilerPanel} = this.props;
        const spoilerFilter = this.props.spoilerFilter;

        const shareUrl = location.origin + location.pathname + '#' + btoa(JSON.stringify({
            ...spoilerFilter,
            lockSpoilerPanel: shareLockSpoilerPanel
        }));

        return (
            <React.Fragment>
                <p>Here you can generate a link to this app with your current spoiler configuration.</p>
                <Form>
                    <Form.Group inline>
                        <label htmlFor={'share-spoiler-toggle'}>Deactivate spoiler configuration panel for people
                            following your shared link.</label>
                        <Form.Checkbox id={'share-spoiler-toggle'} toggle className={'share-spoiler-toggle'}
                                       checked={shareLockSpoilerPanel}
                                       onChange={() => this.props.storeShareLockSpoilerPanel(!shareLockSpoilerPanel)}/>
                    </Form.Group>
                    {shareLockSpoilerPanel && false && <Message negative>
                        <Icon name="exclamation triangle"/>Do not open the link yourself or you will not be able to
                        change any settings anymore
                    </Message>}
                    <Form.Group>
                        <Form.Input id={'share-url-input'} width={14} value={shareUrl}/>
                        <Form.Button width={2} onClick={() => {
                            (document.getElementById('share-url-input') as HTMLInputElement).select();
                            document.execCommand("copy");
                        }}>Copy</Form.Button>
                    </Form.Group>
                </Form>
            </React.Fragment>
        );
    }

}

export default SaveTab