import { connect } from "react-redux"
import ItemView, { gloomhavenItemSlots } from "./ItemView"
import { GloomhavenItem, SortProperty, FilterState, SortState, GloomhavenItemSourceType, SortDirection } from "../../State/Types"
import ItemViewState, { storeSortingProperty, showBuyItemModal, closeBuyItemModal } from "../../State/ItemViewState"
import ConfigurationState, { buyItem } from "../../State/ConfigurationState"
import { Helpers } from "../../helpers"

const deSpoilerItemSource = (source:string): string => {
    return source.replace(/{(.{2})}/, (m, m1) => '<img class="icon" src="'+require('../../img/classes/'+m1+'.png')+'" alt="" />');
}

const buildItemsArray = (): Array<GloomhavenItem> => {
    const allItems: Array<GloomhavenItem> = require('../../data/items.json');
    let slots: Array<string> = [];
    let sources: Array<string> = [];
    let sourceTypes: Array<GloomhavenItemSourceType> = [];

    allItems.forEach(item => {
        item.descHTML = Helpers.parseEffectText(item.desc);
        const sourceType: string = item.source;
        item.sourceTypes = [];

        item.source.split("\n").forEach((itemSource: string) => {
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
        item.source = deSpoilerItemSource(item.source);

        slots.push(item.slot);
        sources.push(item.source);

        sourceTypes = [...sourceTypes, ...item.sourceTypes];

        if (!sources.includes(sourceType)) {
            sources.push(sourceType);
        }
    });

    slots = Helpers.uniqueArray(slots);
    sourceTypes = Helpers.uniqueArray(sourceTypes);
    sources = Helpers.uniqueArray(sources);

    return allItems;
}

const getAvailableItems = (configurationState: ConfigurationState): Array<GloomhavenItem> => {
    const {prosperity, soloClass, prosperityItemIds} = configurationState
    return buildItemsArray().filter((item: GloomhavenItem) => {
        if (item.id <= (prosperity+1)*7) return true;
        if (item.id === 134 && soloClass.includes('BR')) return true;
        if (item.id === 135 && soloClass.includes('TI')) return true;
        if (item.id === 136 && soloClass.includes('SW')) return true;
        if (item.id === 137 && soloClass.includes('SC')) return true;
        if (item.id === 138 && soloClass.includes('CH')) return true;
        if (item.id === 139 && soloClass.includes('MT')) return true;
        if (item.id === 140 && soloClass.includes('SK')) return true;
        if (item.id === 141 && soloClass.includes('QM')) return true;
        if (item.id === 142 && soloClass.includes('SU')) return true;
        if (item.id === 143 && soloClass.includes('NS')) return true;
        if (item.id === 144 && soloClass.includes('PH')) return true;
        if (item.id === 145 && soloClass.includes('BE')) return true;
        if (item.id === 146 && soloClass.includes('SS')) return true;
        if (item.id === 147 && soloClass.includes('DS')) return true;
        if (item.id === 148 && soloClass.includes('SB')) return true;
        if (item.id === 149 && soloClass.includes('EL')) return true;
        if (item.id === 150 && soloClass.includes('BT')) return true;
        return prosperityItemIds.includes(item.id);
    });
}

const filterItems = (filter: FilterState, configurationState: ConfigurationState) => {
    return getAvailableItems(configurationState).filter((item: GloomhavenItem) => {
        let hit = true;
        if (filter.slot) hit = hit && item.slot === filter.slot;
        if (filter.search.length > 2 && hit) hit = hit && (!!item.name.match(new RegExp(filter.search, 'i')) || !!item.desc.match(new RegExp(filter.search, 'i')));
        const itemUsers = configurationState.itemsInUse[item.id]
        if (filter.player) hit = hit && itemUsers && itemUsers.includes(filter.player);
        return hit;
    });
}

const sortItems = (items: Array<GloomhavenItem>, sorting: SortState) => {
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

const mapStateToProps = (state:any) => {
    const itemViewState: ItemViewState = state.itemViewState;
    const configurationState: ConfigurationState = state.configurationState;

    return {
        itemViewState,
        configurationState,
        items: sortItems(filterItems(itemViewState.filter, configurationState), itemViewState.sorting)
    }
}

const mapDispatchToProps = (dispatch: any) => ({
    storeSortingProperty: (property: SortProperty) => dispatch(storeSortingProperty(property)),
    showBuyItemModal: (itemId: number) => dispatch(showBuyItemModal(itemId)),
    closeBuyItemModal: () => dispatch(closeBuyItemModal()),
    buyItem: (itemId: number, playerName: string) => {
        dispatch(buyItem(itemId, playerName))
        dispatch(closeBuyItemModal())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemView)