import React from "react";
import ConfigurationState from "../../State/ConfigurationState";
import { Button, TextArea, Form } from "semantic-ui-react";
import { useSelector } from "react-redux";

import { fetchConfigurationFromGitHub } from "../main";

const save = (configurationState: ConfigurationState) => {
    fetchConfigurationFromGitHub().then(savedConfig => {
        if (savedConfig.hash !== configurationState.hash) {
            alert('Config has been updated since it was last loaded. Refresh the page to load the latest changes')
            return
        }

        const result = fetch('https://githelper.davwil00.co.uk', {
          method: 'PATCH',
          body: JSON.stringify({
            filename: 'gloomhaven-shop.json',
            content: JSON.stringify(configurationState, null, 2)
          })
        }).then(response => {
            if (response.status === 200) {
                alert('Saved');
            } else {
                console.error(response.status);
            }
        }).catch(err => console.error(err));
    })
}

function SaveTab() {
    const configurationState = useSelector<any, ConfigurationState>(state => state.configurationState)

    return (
        <React.Fragment>
            <Form>
                <TextArea label="Config" value={JSON.stringify(configurationState, null, 2)} rows={20}/>
                <Button onClick={() => save(configurationState)}>Save</Button>
            </Form>
        </React.Fragment>
    )
}

export default SaveTab