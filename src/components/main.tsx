import React, { useState, useEffect } from "react";
import { Modal, Header, Button, Icon, Tab } from "semantic-ui-react";
import { ConfigurationState, storeConfiguration } from "../State/ConfigurationState";
import { useDispatch } from "react-redux";
import ShareTab from "./share-tab/ShareTabContainer";
import Configuration from "./configuration/ConfigurationContainer";
import ItemView from "./item-view/ItemViewContainer";

export const configurationLocalStorageKey = 'GloomhavenStore:configuration';

const parseHash = (): (ConfigurationState | undefined) => {
    const hash = location.hash.substr(1);
    const config = atob(hash);
    try {
        return JSON.parse(config).hasOwnProperty('prosperity') ? JSON.parse(config) : undefined;
    } catch (e) {
        return undefined;
    }
}

const importFromHash = (setImportModalOpen: (modalOpen: boolean) => void) => {
    const hashConfig = parseHash();
    if (hashConfig) {
        localStorage.setItem(configurationLocalStorageKey, JSON.stringify(hashConfig));
        setImportModalOpen(false);
        restoreFromLocalStorage();
    }
    location.hash = '';
}

const restoreFromLocalStorage = () => {
    const storage = localStorage.getItem(configurationLocalStorageKey);

    const initialConfigurationState: ConfigurationState = {
        all: false,
        prosperity: 1,
        prosperityItemIds: [],
        itemsInUse: {},
        soloClass: [],
        discount: 0,
        displayAs: 'list',
        enableStoreStockManagement: false,
        lockSpoilerPanel: false,
    };

    let spoilerFilter = initialConfigurationState;

    const dispatch = useDispatch()
    dispatch(storeConfiguration(spoilerFilter));
}

export function Main() {
    const [importModalOpen, setImportModalOpen] = useState(false)
    const dispatch = useDispatch()
    
    useEffect(() => {
        if (parseHash()) {
            setImportModalOpen(true)
        }
    }, [])

    let panes = [
        { menuItem: 'Item List', render: () => <Tab.Pane><ItemView/></Tab.Pane> },
        { menuItem: 'Configuration', render: () => <Tab.Pane><Configuration/></Tab.Pane>},
        {
            menuItem: 'Share',
            render: () => <Tab.Pane><ShareTab/></Tab.Pane>
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
                <Modal.Actions>
                    <Button basic color='red' inverted onClick={() => {
                        location.hash = '';
                        setImportModalOpen(false);
                    }}>
                        <Icon name='remove'/> No
                    </Button>
                    <Button color='green' inverted onClick={() => importFromHash(setImportModalOpen)}>
                        <Icon name='checkmark'/> Yes
                    </Button>
                </Modal.Actions>
            </Modal>

            <div>
            <Tab panes={panes} defaultActiveIndex={0}/>
            </div>
            <em className={'pull-right ui text grey'}>Gloomhaven and all related properties, images and text are owned by <a href={'https://www.cephalofair.com/'} target={'_blank'} rel={'noopener'}>Cephalofair Games</a>.</em>
        </>
    )
}