import React, { Component } from "react";
import { Form, Button, Input } from "semantic-ui-react";
import { SortProperty, GloomhavenItemSlot, SortState, FilterState, ItemViewDisplayType } from "../../State/Types"
import { gloomhavenItemSlots } from "../item-view/ItemView";
import { getSlotImageSrc } from "../../helpers/ImageHelper";

type Props = {
    filter: FilterState,
    sorting: SortState
    displayType: ItemViewDisplayType,
    discount: number,
    players: Array<string>,
    storeDisplayType: (displayType: ItemViewDisplayType) => void,
    storeDiscount: (discount: number) => void,
    storeSortingProperty: (property: SortProperty) => void,
    storeFilterSlot: (slot?: GloomhavenItemSlot) => void,
    storeFilterSearch: (search: string) => void,
    storeFilterPlayer: (player: string) => void
}

class SearchOptions extends Component<Props> {
    render() {
        const { displayType, discount, sorting, filter, players } = this.props;
        return (
            <React.Fragment>

                <Form>
                    <Form.Group inline>
                        <label>Render as:</label>
                        <Button.Group>
                            <Button color={displayType === 'list' ? 'blue' : undefined} onClick={() => {
                                    this.props.storeDisplayType('list');
                                }}>List</Button>
                            <Button.Or/>
                            <Button color={displayType === 'images' ? 'blue' : undefined} onClick={() => {
                                    this.props.storeDisplayType('images');
                                }}>Images</Button>
                        </Button.Group>
                    </Form.Group>
                    {displayType === 'images' && <Form.Group inline>
                        <label>Sort By:</label>
                        <Form.Select
                            value={sorting.property}
                            options={[
                                {value: 'id', text: 'Item Number'},
                                {value: 'slot', text: 'Equipment Slot'},
                                {value: 'cost', text: 'Cost'},
                                {value: 'name', text: 'Name'},
                                {value: 'source', text: 'Source'},
                                {value: 'use', text: 'Use'}
                            ]}
                            onChange={(obj, e) => this.props.storeSortingProperty(e.value as SortProperty)}
                        />
                    </Form.Group>}
                    <Form.Group inline>
                        <label>Filter Slot:</label>
                        <Form.Radio label={'all'} checked={filter.slot === undefined} onChange={() => this.setFilterSlot(undefined)}/>
                        {gloomhavenItemSlots.map(slot => <Form.Radio key={slot} label={<img className={'icon'} src={getSlotImageSrc(slot)} alt={slot}/>} checked={filter.slot === slot} onChange={() => this.setFilterSlot(slot)} alt={slot}/>)}
                    </Form.Group>
                    <Form.Group inline>
                        <label>Find Item:</label>
                        <Input
                            value={filter.search}
                            onChange={(e) => this.props.storeFilterSearch(e.target.value)}
                            icon={{name: 'close', link: true, onClick: () => this.props.storeFilterSearch('')}}
                            placeholder={'Search...'}
                        />
                    </Form.Group>
                    <Form.Group inline>
                      <label>Player:</label>
                      <Form.Field inline control="select" onChange={(e: React.FormEvent<HTMLInputElement>) => this.props.storeFilterPlayer(e.currentTarget.value)}>
                        <option value=''>Select a player</option>
                        {players.map(player => <option key={player} value={player}>{player}</option>)}
                      </Form.Field>
                    </Form.Group>
                </Form>
            </React.Fragment>
        );
    }

    setFilterSlot(slot?: GloomhavenItemSlot) {
        // this.props.filter.slot = slot;
        this.props.storeFilterSlot(slot);
    }
}

export default SearchOptions