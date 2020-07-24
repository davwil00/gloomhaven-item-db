import React, { useState, useEffect } from "react";
import { Modal, Header, Button, Icon, Tab } from "semantic-ui-react";
import ConfigurationState, { storeConfiguration } from "../State/ConfigurationState";
import { useDispatch } from "react-redux";
import SaveTab from "./saveTab/SaveTab";
import Configuration from "./configuration/ConfigurationContainer";
import ItemView from "./item-view/ItemViewContainer";
import md5 from "crypto-js/md5"

export async function fetchConfigurationFromGitHub(): Promise<ConfigurationState> {
    const gistUrl = `https://gist.githubusercontent.com/davwil00/${process.env.REACT_APP_GIST_ID}/raw/gloomhaven-shop.json`;

    return fetch(gistUrl)
        .then(response => response.json())
        .then(loadedConfiguration => {
            loadedConfiguration.hash = md5(loadedConfiguration);
            return loadedConfiguration;
        })
}

const restoreFromGithubGist = (dispatch: (action: any) => void) => {
    fetchConfigurationFromGitHub()
        .then(configurationState => {
            dispatch(storeConfiguration(configurationState))
        }).catch(error => alert('Unable to load config'))
}

export function Main() {
    const [importModalOpen, setImportModalOpen] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        restoreFromGithubGist(dispatch)
    }, [])

    let panes = [
        { menuItem: 'Item List', render: () => <Tab.Pane><ItemView/></Tab.Pane> },
        { menuItem: 'Configuration', render: () => <Tab.Pane><Configuration/></Tab.Pane>},
        {
            menuItem: 'Save',
            render: () => <Tab.Pane><SaveTab/></Tab.Pane>
        }
    ];

    return (
        <>
            <Modal basic size='small' open={importModalOpen}>
                <Header icon='cloud download' content='Apply Configuration from Link'/>
                <Modal.Content>
                    <p>
                        Do you want to load the configuration passed with this link?
                    </p>
                </Modal.Content>
            </Modal>

            <div>
            <Tab panes={panes} defaultActiveIndex={0}/>
            </div>
            <em className={'pull-right ui text grey'}>Gloomhaven and all related properties, images and text are owned by <a href={'https://www.cephalofair.com/'} target={'_blank'} rel={'noopener'}>Cephalofair Games</a>.</em>
        </>
    )
}