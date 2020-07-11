import React, {Component} from 'react';
import {Button, Checkbox, Form, Header, Icon, Image, Message, Modal, Popup, Tab, Table} from 'semantic-ui-react';
import {Helpers} from "./helpers";
import { SortDirection, SortProperty, SoloClassShorthand, GloomhavenItem, GloomhavenItemSlot, GloomhavenItemSourceType } from "./State/Types";
import { SpoilerFilter, OldSpoilerFilter } from './State/SpoilerFilter';
import { connect } from 'react-redux';
import { ItemViewState } from './State/ItemViewState';
import { storeItems, storeImportModalOpen, storeSortingProperty } from './State/ItemViewState';
import { storeSpoilerFilter, storeProsperity, storeSoloClass, storeItem, storeItemsInUse, storeAll, storeEnableStoreStockManagement } from './State/SpoilerFilter';
import { getItemImageSrc, getSlotImageSrc } from './helpers/ImageHelper';
import SearchOptions from './search-options/SearchOptionsContainer';
import ShareTab from './share/ShareTabContainer';
import SpoilerFilters from './spoiler-filters/SpoilerFiltersContainer';

export const gloomhavenItemSlots: Array<GloomhavenItemSlot> = ['Head', 'Body', 'Legs', 'One Hand', 'Two Hands', 'Small Item'];

interface ItemViewProps { itemViewState: ItemViewState, spoilerFilter: SpoilerFilter, dispatch: any}

class ItemView extends Component<ItemViewProps, ItemViewState> {

    filterLocalStorageKey = 'ItemView:spoilerFilter';

    constructor(props: ItemViewProps) {
        super(props);

        const items: Array<GloomhavenItem> = require('./data/items.json');

        let slots: Array<string> = [];
        let sources: Array<string> = [];
        let sourceTypes: Array<GloomhavenItemSourceType> = [];

        items.forEach(item => {

            item.descHTML = Helpers.parseEffectText(item.desc);

            let sourceType: string = item.source;

            item.sourceTypes = [];

            item.source.split("\n").forEach(itemSource => {
                if (itemSource.match(/^Prosperity Level \d/)) {
                    item.sourceTypes.push("Prosperity");
                } else if (itemSource.match(/^Reward from Solo Scenario /)) {
                    item.sourceTypes.push("Solo Scenario");
                } else if (itemSource.match(/^(Reward From )?Scenario #\d+/)) {
                    item.sourceTypes.push("Scenario");
                } else if (itemSource === "Random Item Design") {
                    item.sourceTypes.push("Random Item Design");
                } else if (itemSource.match(/^City Event \d+/)) {
                    item.sourceTypes.push("City Event");
                } else if (itemSource.match(/^Road Event \d+/)) {
                    item.sourceTypes.push("Road Event");
                }
            });

            item.source = item.source.replace(/Reward from /ig, '');
            item.source = item.source.replace(/ ?\((Treasure #\d+)\)/ig, "\n$1");
            item.source = item.source.replace(/Solo Scenario #\d+ — /i, 'Solo ');
            item.source = ItemView.deSpoilerItemSource(item.source);

            slots.push(item.slot);
            sources.push(item.source);

            sourceTypes = [...sourceTypes, ...item.sourceTypes];

            if (!sources.includes(sourceType)) sources.push(sourceType);
        });

        slots = Helpers.uniqueArray(slots);
        sourceTypes = Helpers.uniqueArray(sourceTypes);
        sources = Helpers.uniqueArray(sources);

        this.props.dispatch(storeItems(items));
        this.restoreFromLocalStorage(); // TODO restore from gist

        this.props.dispatch(storeImportModalOpen(ItemView.parseHash() != undefined));
    }

    static parseHash(): SpoilerFilter | undefined {
        const hash = location.hash.substr(1);
        const config = atob(hash);
        try {
            return JSON.parse(config).hasOwnProperty('prosperity') ? JSON.parse(config) : undefined;
        } catch (e) {
            return undefined;
        }
    }

    importFromHash() {
        const hashConfig = ItemView.parseHash();
        if (hashConfig !== undefined) {
            localStorage.setItem(this.filterLocalStorageKey, JSON.stringify(hashConfig));
            this.props.dispatch(storeImportModalOpen(false));
            this.restoreFromLocalStorage();
        }
        location.hash = '';
    }

    restoreFromLocalStorage() {
        const storage = localStorage.getItem(this.filterLocalStorageKey);

        const initialSpoilerFilter: SpoilerFilter = {
            all: false,
            prosperity: 1,
            item: [],
            itemsInUse: {},
            soloClass: [],
            discount: 0,
            displayAs: 'list',
            enableStoreStockManagement: false,
            lockSpoilerPanel: false,
        };

        let spoilerFilter = initialSpoilerFilter;

        if (typeof storage === 'string') {
            const configFromStorage: OldSpoilerFilter = JSON.parse(storage);

            // convert from old object style to array
            if (!configFromStorage.soloClass.hasOwnProperty('length')) {
                const soloClass: Array<SoloClassShorthand> = [];
                Object.keys(configFromStorage.soloClass).forEach(k => {
                    if (configFromStorage.soloClass[k] === true) {
                        soloClass.push(k as SoloClassShorthand);
                    }
                });
                configFromStorage.soloClass = soloClass;
            }
            // convert from old object style to array
            if (!configFromStorage.item.hasOwnProperty('length')) {
                const items: Array<number> = [];
                Object.keys(configFromStorage.item).forEach(k => {
                    if (configFromStorage.item[k] === true) {
                        items.push(parseInt(k));
                    }
                });
                configFromStorage.item = items;
            }

            spoilerFilter = Object.assign({}, initialSpoilerFilter, configFromStorage);
        }

        this.props.dispatch(storeSpoilerFilter(spoilerFilter));
    }

    static deSpoilerItemSource(source:string): string {
        return source.replace(/{(.{2})}/, (m, m1) => '<img class="icon" src="'+require('./img/classes/'+m1+'.png')+'" alt="" />');
    }

    setSorting(property: SortProperty) {
        const {sorting} = this.props.itemViewState;
        if (property === sorting.property) {
            sorting.direction = sorting.direction === SortDirection.ascending ? SortDirection.descending : SortDirection.ascending;
        } else {
            sorting.direction = SortDirection.ascending;
        }
        sorting.property = property;
        this.props.dispatch(storeSortingProperty(property));
    }

    getSpoilerFilteredItems() {
        const {items} = this.props.itemViewState;;
        const spoilerFilter = this.props.spoilerFilter;
        if (spoilerFilter.all) return items;
        return items.filter(item => {
            if (item.id <= (spoilerFilter.prosperity+1)*7) return true;
            if (item.id === 134 && spoilerFilter.soloClass.includes('BR')) return true;
            if (item.id === 135 && spoilerFilter.soloClass.includes('TI')) return true;
            if (item.id === 136 && spoilerFilter.soloClass.includes('SW')) return true;
            if (item.id === 137 && spoilerFilter.soloClass.includes('SC')) return true;
            if (item.id === 138 && spoilerFilter.soloClass.includes('CH')) return true;
            if (item.id === 139 && spoilerFilter.soloClass.includes('MT')) return true;
            if (item.id === 140 && spoilerFilter.soloClass.includes('SK')) return true;
            if (item.id === 141 && spoilerFilter.soloClass.includes('QM')) return true;
            if (item.id === 142 && spoilerFilter.soloClass.includes('SU')) return true;
            if (item.id === 143 && spoilerFilter.soloClass.includes('NS')) return true;
            if (item.id === 144 && spoilerFilter.soloClass.includes('PH')) return true;
            if (item.id === 145 && spoilerFilter.soloClass.includes('BE')) return true;
            if (item.id === 146 && spoilerFilter.soloClass.includes('SS')) return true;
            if (item.id === 147 && spoilerFilter.soloClass.includes('DS')) return true;
            if (item.id === 148 && spoilerFilter.soloClass.includes('SB')) return true;
            if (item.id === 149 && spoilerFilter.soloClass.includes('EL')) return true;
            if (item.id === 150 && spoilerFilter.soloClass.includes('BT')) return true;
            return spoilerFilter.item.includes(item.id);
        });
    }

    getFilteredItems() {
        const {filter} = this.props.itemViewState;
        let items = this.getSpoilerFilteredItems();
        items = items.filter(item => {
            let hit = true;
            if (filter.slot) hit = hit && item.slot === filter.slot;
            if (filter.search.length > 2 && hit) hit = hit && (!!item.name.match(new RegExp(filter.search, 'i')) || !!item.desc.match(new RegExp(filter.search, 'i')));
            return hit;
        });
        return items;
    }

    getSortedAndFilteredItems() {
        const {sorting} = this.props.itemViewState;;
        const items = this.getFilteredItems();
        return items.sort((itemA, itemB) => {
            let value = 0;
            switch (sorting.property) {
                case "name":
                    value = itemA[sorting.property].localeCompare(itemB[sorting.property]);
                    break;
                case "slot":
                    if (gloomhavenItemSlots.indexOf(itemA.slot) === gloomhavenItemSlots.indexOf(itemB.slot)) {
                        value = 0
                    } else {
                        value = gloomhavenItemSlots.indexOf(itemA.slot) > gloomhavenItemSlots.indexOf(itemB.slot) ? 1 : -1
                    }
                    break;
                case "cost":
                case "id":
                    if (itemA[sorting.property] === itemB[sorting.property]) return 0;
                    value = itemA[sorting.property] > itemB[sorting.property] ? 1 : -1;
                    break;
                case "use":
                    // assign a dummy value to sort by
                    const itemAuse = itemA.spent ? 'c' : (itemA.consumed ? 'b' : 'a');
                    const itemBuse = itemB.spent ? 'c' : (itemB.consumed ? 'b' : 'a');
                    value = itemAuse.localeCompare(itemBuse);
                    break;
            }
            return sorting.direction === SortDirection.ascending ? value : value * -1;
        });
    }

    getItemById(id: number): GloomhavenItem {
        const {items} = this.props.itemViewState;
        const item = items.find(i => i.id === id);
        if (item === undefined) throw new Error('invalid item id');
        return item;
    }

    toggleItemInUse(id: number, bit: number) {

        const {itemsInUse} = this.props.spoilerFilter;

        itemsInUse[id] = itemsInUse[id] & bit ? itemsInUse[id] ^ bit : itemsInUse[id] | bit;

        if (itemsInUse[id] === 0) {
            delete (itemsInUse[id]);
        }

        this.props.dispatch(storeItemsInUse(itemsInUse));
    }

    toggleShowAll() {
        const {all} = this.props.spoilerFilter;
        this.props.dispatch(storeAll(!all));
    }


    static renderSummon(item: GloomhavenItem) {
        return item.summon === undefined ? null : (
            <React.Fragment>
                <div className={'item-summon'}>
                    <div><img src={require('./img/icons/general/heal.png')} className={'icon'} alt={'hp'}/>: {item.summon.hp}</div>
                    <div><img src={require('./img/icons/general/move.png')} className={'icon'} alt={'hp'}/>: {item.summon.move}</div>
                    <div><img src={require('./img/icons/general/attack.png')} className={'icon'} alt={'hp'}/>: {item.summon.attack}</div>
                    <div><img src={require('./img/icons/general/range.png')} className={'icon'} alt={'hp'}/>: {item.summon.range || '-'}</div>
                </div>
            </React.Fragment>
        );
    }

    renderTable() {
        const { sorting } = this.props.itemViewState;
        const { displayAs, all, discount, enableStoreStockManagement, lockSpoilerPanel, itemsInUse} = this.props.spoilerFilter;
        const items = this.getSortedAndFilteredItems();
        const itemsListAsImages = () => (
            <React.Fragment>
                {items.map(item => (
                    <div key={item.id} className={'item-card-wrapper'}>
                        <img key={item.id}
                            src={getItemImageSrc(item)}
                            alt={item.name}
                            className={'item-card'}/>

                        {enableStoreStockManagement
                            ? [...Array(item.count).keys()].map(index =>
                                <Checkbox key={index}
                                          className={'i'+index}
                                          toggle
                                          disabled={lockSpoilerPanel}
                                          checked={!!(itemsInUse[item.id] & Math.pow(2, index))}
                                          onChange={() => this.toggleItemInUse(item.id, Math.pow(2, index))}/>
                            )
                            : item.count
                        }
                    </div>
                    ))}
            </React.Fragment>
        );
        const table = () => items.length === 0
            ? (
                <Message negative>
                    No items found matching your filters and/or search criteria
                </Message>
            )
            : (
                <React.Fragment>
                    <Table basic sortable celled className={'items-table'} unstackable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell className={'id-col'} textAlign={'right'} onClick={() => this.setSorting('id')} sorted={sorting.property === 'id' ? sorting.direction : undefined}>#</Table.HeaderCell>
                                <Table.HeaderCell className={'name-col'} selectable={false} onClick={() => this.setSorting('name')} sorted={sorting.property === 'name' ? sorting.direction : undefined}>Name</Table.HeaderCell>
                                <Table.HeaderCell className={'slot-col'} textAlign={'center'} onClick={() => this.setSorting('slot')} sorted={sorting.property === 'slot' ? sorting.direction : undefined}>Slot</Table.HeaderCell>
                                <Table.HeaderCell className={'cost-col'} textAlign={'right'} onClick={() => this.setSorting('cost')} sorted={sorting.property === 'cost' ? sorting.direction : undefined}>Cost</Table.HeaderCell>
                                <Table.HeaderCell className={'use-col'} onClick={() => this.setSorting('use')} sorted={sorting.property === 'use' ? sorting.direction : undefined}>Use</Table.HeaderCell>
                                <Table.HeaderCell className={'text-col'}>Effect</Table.HeaderCell>
                                <Table.HeaderCell className={'source-col'}>Source</Table.HeaderCell>
                                <Table.HeaderCell
                                    className={'store-inventory-col'}>{enableStoreStockManagement ? 'In Use' : 'Stock'}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {items.map(item => {
                                const cost = discount !== 0
                                    ? (<strong className={"ui text " + (item.cost > 0 ? 'blue' : 'orange')}>{item.cost + discount}g</strong>)
                                    : (<strong>{item.cost}g</strong>);
                                return (
                                    <Table.Row key={item.id}>
                                        <Table.Cell className={'id-col'} textAlign={'right'}>#{(item.id + '').padStart(3, '0')}</Table.Cell>
                                        <Table.Cell className={'name-col'}>{item.name}</Table.Cell>
                                        <Table.Cell className={'slot-col'} textAlign={'center'}><Image src={getSlotImageSrc(item.slot)}/></Table.Cell>
                                        <Table.Cell className={'cost-col'} textAlign={'right'}>{cost}</Table.Cell>
                                        <Table.Cell className={'use-col'} textAlign={'center'}>
                                            {item.spent && <img className={'icon'} src={require('./img/icons/general/spent.png')} alt={'icon spent'}/>}
                                            {item.consumed && <img className={'icon'} src={require('./img/icons/general/consumed.png')} alt={'icon consumed'}/>}
                                        </Table.Cell>
                                        <Table.Cell className={'text-col'}>
                                            <span dangerouslySetInnerHTML={{__html:item.descHTML}}/>
                                            {item.minusOneCardsAdded &&
                                            <React.Fragment><br/><span>Add {Helpers.numberAmountToText(item.minusOneCardsAdded)}
                                                <img className={'icon'}
                                                     src={require('./img/icons/general/modifier_minus_one.png')}
                                                     alt={'modifier -1'}/> to your attack modifier deck.</span></React.Fragment>}
                                            {item.faq && <Popup closeOnDocumentClick hideOnScroll trigger={<Icon name={'question circle'} className={'pink'}/>} header={'FAQ'} content={item.faq}/>}
                                            {ItemView.renderSummon(item)}
                                        </Table.Cell>
                                        <Table.Cell className={'source-col'}>
                                            {item.source.split("\n").map(s => <React.Fragment key={s}><span dangerouslySetInnerHTML={{__html: s}}/><br/></React.Fragment>)}
                                        </Table.Cell>
                                        <Table.Cell className={'store-inventory-col'} textAlign={'right'}>
                                            {enableStoreStockManagement
                                                ? [...Array(item.count).keys()].map(index =>
                                                    <Checkbox key={index}
                                                              disabled={lockSpoilerPanel}
                                                              checked={!!(itemsInUse[item.id] & Math.pow(2, index))}
                                                              onChange={() => this.toggleItemInUse(item.id, Math.pow(2, index))}/>
                                                )
                                                : item.count
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                </React.Fragment>
            );

        return (
            <React.Fragment>
                <SearchOptions />

                {all &&  (
                    <Message negative>
                        <Message.Header><Icon name="exclamation triangle"/>Spoiler alert</Message.Header>
                        You are currently viewing all possible items.
                    </Message>
                )}

                {displayAs === 'list' ? table() : itemsListAsImages()}

            </React.Fragment>
        );
    }

    render() {

        const {importModalOpen} = this.props.itemViewState; 
        const {all, lockSpoilerPanel} = this.props.spoilerFilter;

        let panes = [
            { menuItem: 'Item List', render: () => <Tab.Pane className={all ? 'spoiler' : ''}>{this.renderTable()}</Tab.Pane> },
            { menuItem: 'Configuration', render: () => <Tab.Pane className={all ? 'spoiler' : ''}><SpoilerFilters/></Tab.Pane>},
            {
                menuItem: 'Share',
                render: () => <Tab.Pane
                    className={all ? 'spoiler' : ''}><ShareTab/></Tab.Pane>
            },
        ];

        if (lockSpoilerPanel) {
            panes = [panes[0]];
        }

        return (
            <React.Fragment>

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
                            this.props.dispatch(storeImportModalOpen(false));
                        }}>
                            <Icon name='remove'/> No
                        </Button>
                        <Button color='green' inverted onClick={() => this.importFromHash()}>
                            <Icon name='checkmark'/> Yes
                        </Button>
                    </Modal.Actions>
                </Modal>

                <div className={all ? 'spoiler' : ''}>
                    <Tab panes={panes} defaultActiveIndex={0}/>
                </div>
                <em className={'pull-right ui text grey'}>Gloomhaven and all related properties, images and text are owned by <a href={'https://www.cephalofair.com/'} target={'_blank'} rel={'noopener'}>Cephalofair Games</a>.</em>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state:any) => {
    return { itemViewState: state.itemViewState, spoilerFilter: state.spoilerFilter, dispatch: state.dispatch };
  };

const ConnectedApp = connect(
    mapStateToProps,
  )(ItemView);

export default ConnectedApp;

