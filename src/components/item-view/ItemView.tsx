import React, {Component} from 'react';
import {Button, Icon, Image, Popup, Table, Label, Message, Modal, Select} from 'semantic-ui-react';
import {Helpers} from "../../helpers";
import ConfigurationState from '../../State/ConfigurationState';
import { GloomhavenItem, SortProperty, GloomhavenItemSlot, SortState } from '../../State/Types';
import ItemViewState, { closeBuyItemModal } from '../../State/ItemViewState';
import { getItemImageSrc, getSlotImageSrc } from '../../helpers/ImageHelper';
import SearchOptions from '../search-options/SearchOptionsContainer';

export const gloomhavenItemSlots: Array<GloomhavenItemSlot> = ['Head', 'Body', 'Legs', 'One Hand', 'Two Hands', 'Small Item'];

type Props = { 
    itemViewState: ItemViewState,
    configurationState: ConfigurationState,
    items: Array<GloomhavenItem>,
    storeSortingProperty: (property: SortProperty) => void,
    showBuyItemModal: (itemId: number) => void,
    closeBuyItemModal: () => void,
    buyItem: (itemId: number, playerName: string) => void
}

type ModalState = {
    selectedPlayer?: string
}

const renderSummon = (item: GloomhavenItem) => {
    return item.summon === undefined ? null : (
        <React.Fragment>
            <div className={'item-summon'}>
                <div><img src={require('../../img/icons/general/heal.png')} className={'icon'} alt={'hp'}/>: {item.summon.hp}</div>
                <div><img src={require('../../img/icons/general/move.png')} className={'icon'} alt={'hp'}/>: {item.summon.move}</div>
                <div><img src={require('../../img/icons/general/attack.png')} className={'icon'} alt={'hp'}/>: {item.summon.attack}</div>
                <div><img src={require('../../img/icons/general/range.png')} className={'icon'} alt={'hp'}/>: {item.summon.range || '-'}</div>
            </div>
        </React.Fragment>
    );
}

class ItemView extends Component<Props, ModalState> {

    state = {
        selectedPlayer: undefined
    }

    itemsListAsImages() {
        const {items} = this.props
        const {itemsInUse} = this.props.configurationState

        return <React.Fragment>
            {items.map(item => (
                <div key={item.id} className={'item-card-wrapper'}>
                    <img key={item.id}
                        src={getItemImageSrc(item)}
                        alt={item.name}
                        className={'item-card'}/>

                    {itemsInUse[item.id]
                        ? <>{itemsInUse[item.id].length} / {item.count} <Icon name="user" /></>
                        : item.count
                    }
                </div>
            ))}
        </React.Fragment>
    }

    tableHeader() {
        const {storeSortingProperty} = this.props
        const {sorting} = this.props.itemViewState

        return <Table.Header>
            <Table.Row>
                <Table.HeaderCell className={'id-col'} textAlign={'right'} onClick={() => storeSortingProperty('id')} sorted={sorting.property === 'id' ? sorting.direction : undefined}>#</Table.HeaderCell>
                <Table.HeaderCell className={'name-col'} selectable={false} onClick={() => storeSortingProperty('name')} sorted={sorting.property === 'name' ? sorting.direction : undefined}>Name</Table.HeaderCell>
                <Table.HeaderCell className={'slot-col'} textAlign={'center'} onClick={() => storeSortingProperty('slot')} sorted={sorting.property === 'slot' ? sorting.direction : undefined}>Slot</Table.HeaderCell>
                <Table.HeaderCell className={'cost-col'} textAlign={'right'} onClick={() => storeSortingProperty('cost')} sorted={sorting.property === 'cost' ? sorting.direction : undefined}>Cost</Table.HeaderCell>
                <Table.HeaderCell className={'use-col'} onClick={() => storeSortingProperty('use')} sorted={sorting.property === 'use' ? sorting.direction : undefined}>Use</Table.HeaderCell>
                <Table.HeaderCell className={'text-col'}>Effect</Table.HeaderCell>
                <Table.HeaderCell className={'source-col'}>Source</Table.HeaderCell>
                <Table.HeaderCell
                    className={'store-inventory-col'}># Available</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
    }

    tableBody() {
        const {items, showBuyItemModal} = this.props
        const {discount, itemsInUse} = this.props.configurationState
        return <Table.Body>
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
                            {item.spent && <img className={'icon'} src={require('../../img/icons/general/spent.png')} alt={'icon spent'}/>}
                            {item.consumed && <img className={'icon'} src={require('../../img/icons/general/consumed.png')} alt={'icon consumed'}/>}
                        </Table.Cell>
                        <Table.Cell className={'text-col'}>
                            <span dangerouslySetInnerHTML={{__html:item.descHTML}}/>
                            {item.minusOneCardsAdded &&
                            <React.Fragment><br/><span>Add {Helpers.numberAmountToText(item.minusOneCardsAdded)}
                                <img className={'icon'}
                                        src={require('../../img/icons/general/modifier_minus_one.png')}
                                        alt={'modifier -1'}/> to your attack modifier deck.</span></React.Fragment>}
                            {item.faq && <Popup closeOnDocumentClick hideOnScroll trigger={<Icon name={'question circle'} className={'pink'}/>} header={'FAQ'} content={item.faq}/>}
                            {renderSummon(item)}
                        </Table.Cell>
                        <Table.Cell className={'source-col'}>
                            {item.source.split("\n").map(s => <React.Fragment key={s}><span dangerouslySetInnerHTML={{__html: s}}/><br/></React.Fragment>)}
                        </Table.Cell>
                        <Table.Cell className={'store-inventory-col'} textAlign={'right'}>
                            {itemsInUse[item.id] ? 
                            <Button as='div' labelPosition='right' onClick={() => showBuyItemModal(item.id)}>
                                <Button icon>
                                <Popup trigger={<Icon name="add user" />}
                                        content={itemsInUse[item.id]}
                                        position="right center"/>
                                </Button>
                                <Label as='a' basic pointing='left'>
                                    <span className="nowrap">{item.count - itemsInUse[item.id].length} / {item.count}</span>
                                </Label>
                            </Button>
                            : 
                            <Button as='div' labelPosition='right' onClick={() => showBuyItemModal(item.id)}>
                                <Button icon>
                                    <Icon name="add user"/>
                                </Button>
                                <Label as='a' basic pointing='left'>
                                    <span className="nowrap">{item.count} / {item.count}</span>
                                </Label>
                            </Button>}
                        </Table.Cell>
                    </Table.Row>
                );
            })}
        </Table.Body>
    }

    buyModal() {
        const playerNames = ["David", "Katie", "Paul", "Tim"].map(name => {return {key: name, value: name, text: name}})
        const {showBuyItemModal, buyItemId} = this.props.itemViewState
        const item = this.props.items.find(item => item.id === buyItemId)

        return ( item &&
            <Modal size="tiny" open={showBuyItemModal} onClose={this.props.closeBuyItemModal}>
            <Modal.Header>Buy Item</Modal.Header>
            <Modal.Content>
                <p>Name: {item.name}</p>
                <p>Cost: {item.cost}</p>
                <p>Player: 
                    <Select fluid label="Player"
                        placeholder='Select player' 
                        options={playerNames} 
                        onChange={(_, action) => this.setState({selectedPlayer: action.value as string})} />
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={this.props.closeBuyItemModal}>No </Button>
                <Button
                    positive
                    icon='checkmark'
                    labelPosition='right'
                    content='Yes'
                    onClick={() => this.props.buyItem(buyItemId!, this.state.selectedPlayer!)}
                />
            </Modal.Actions>
            </Modal>
        )
    }

    render() {
        const {items, itemViewState} = this.props
        const {displayType} = itemViewState
        
        return (
            <React.Fragment>
                <SearchOptions />
                {items.length === 0 ? (
                    <Message negative>
                        No items found matching your filters and/or search criteria
                    </Message>
                ) : (
                    displayType === 'list' ?
                        <Table basic sortable celled className={'items-table'} unstackable>
                            {this.tableHeader()}
                            {this.tableBody()}
                        </Table>
                    :  this.itemsListAsImages()
                    )
                }
                {this.buyModal()}
            </React.Fragment>
        )
    }
}

export default ItemView;

