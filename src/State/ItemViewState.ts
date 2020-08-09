import { GloomhavenItemSlot, SortDirection, SortProperty, GloomhavenItem, SortState, FilterState, ItemViewDisplayType } from "./Types";

export const STORE_ITEMS = 'STORE_ITEMS';
export const STORE_FILTER_SLOT = 'STORE_FILTER_SLOT';
export const STORE_FILTER_SEARCH = 'STORE_FILTER_SEARCH';
export const STORE_PLAYER_SEARCH = 'STORE_PLAYER_SEARCH';
export const STORE_SORTING_PROPERTY = 'STORE_SORTING_PROPERTY'
export const STORE_IMPORT_MODAL_OPEN = 'STORE_IMPORT_MODAL_OPEN';
export const STORE_DISPLAY_TYPE = 'STORE_DISPLAY_TYPE';
export const SHOW_BUY_ITEM_MODAL = "SHOW_BUY_ITEM_MODAL";
export const CLOSE_BUY_ITEM_MODAL = "CLOSE_BUY_ITEM_MODAL";

export function storeFilterSlot(slot?: GloomhavenItemSlot) {
    return { type: STORE_FILTER_SLOT, slot }
}

export function storeFilterSearch(search: string) {
    return { type: STORE_FILTER_SEARCH, search }
}

export function storePlayerFilter(player: string) {
    return { type: STORE_PLAYER_SEARCH, player }
}

export function storeSortingProperty(property: SortProperty) {
    return { type: STORE_SORTING_PROPERTY, property }
}

export function storeDisplayType(displayType: ItemViewDisplayType) {
    return { type: STORE_DISPLAY_TYPE, displayType }
}

export function showBuyItemModal(itemId: number) {
    return { type: SHOW_BUY_ITEM_MODAL, itemId }
}

export function closeBuyItemModal() {
    return { type: CLOSE_BUY_ITEM_MODAL }
}

export interface ItemViewState {
    filter: FilterState,
    sorting: SortState,
    buyItemId?: number,
    showBuyItemModal: boolean
    displayType: ItemViewDisplayType
}

const initialItemViewState : ItemViewState = {
    filter: {
        slot: undefined,
        search: '',
        player: ''
    },
    sorting: {
        direction: SortDirection.ascending,
        property: 'id'
    },
    showBuyItemModal: false,
    displayType: "list"
};


const getSortDirection = (property: SortProperty, sorting: SortState): SortDirection => {
    if (property === sorting.property) {
        return sorting.direction === SortDirection.ascending ? SortDirection.descending : SortDirection.ascending;
    } else {
        return SortDirection.ascending;
    }
}

export function itemViewState(state = initialItemViewState, action:any) {
    switch (action.type)
    {
        case STORE_FILTER_SLOT:
            return { ...state, filter: { ...state.filter, slot: action.slot}};
        case STORE_FILTER_SEARCH:
            return { ...state, filter: { ...state.filter, search: action.search}};
        case STORE_PLAYER_SEARCH:
            return {...state, filter: { ...state.filter, player: action.player}};
        case STORE_SORTING_PROPERTY:
            return { ...state, sorting: { direction: getSortDirection(action.property, state.sorting), property: action.property, }};
        case STORE_IMPORT_MODAL_OPEN:
            return { ...state, importModalOpen: action.importModalOpen};
        case STORE_DISPLAY_TYPE:
            return { ...state, displayType: action.displayType};
        case SHOW_BUY_ITEM_MODAL:
            return { ...state, showBuyItemModal: true, buyItemId: action.itemId };
        case CLOSE_BUY_ITEM_MODAL:
            return { ...state, showBuyItemModal: false};
        default:
            return state;
    }
}

export default ItemViewState;
