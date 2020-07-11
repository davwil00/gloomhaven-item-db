import { GloomhavenItemSlot, SortDirection, SortProperty, GloomhavenItem, SortState, FilterState } from "./Types";

export const STORE_ITEMS = 'STORE_ITEMS';
export const STORE_FILTER_SLOT = 'STORE_FILTER_SLOT';
export const STORE_FILTER_SEARCH = 'STORE_FILTER_SEARCH';
export const STORE_SORTING_PROPERTY = 'STORE_SORTING_PROPERTY'
export const STORE_IMPORT_MODAL_OPEN = 'STORE_IMPORT_MODAL_OPEN';
export const STORE_SHARE_LOCK_SPOILER_PANEL = 'STORE_SHARE_LOCK_SPOILER_PANEL';

export function storeItems(items: Array<GloomhavenItem>) {
    return { type: STORE_ITEMS, items}
}

export function storeFilterSlot(slot?: GloomhavenItemSlot) {
    return { type: STORE_FILTER_SLOT, slot}
}

export function storeFilterSearch(search: string) {
    return { type: STORE_FILTER_SEARCH, search}
}

export function storeSortingProperty(property: SortProperty) {
    return { type: STORE_SORTING_PROPERTY, property}
}

export function storeImportModalOpen(importModalOpen: boolean) {
    return { type: STORE_IMPORT_MODAL_OPEN, importModalOpen}
}


export function storeShareLockSpoilerPanel(shareLockSpoilerPanel: boolean) {
    return { type: STORE_SHARE_LOCK_SPOILER_PANEL, shareLockSpoilerPanel}
}

export interface ItemViewState {
    items: Array<GloomhavenItem>
    filter: FilterState,
    sorting: SortState,
    importModalOpen: boolean
    shareLockSpoilerPanel: boolean
}

const initialItemViewState : ItemViewState = {
    items: [],
    filter: {
        slot: undefined,
        search: ''
    },
    sorting: {
        direction: SortDirection.ascending,
        property: 'id'
    },
    importModalOpen: false,
    shareLockSpoilerPanel: false
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
        case STORE_ITEMS:
            return { ...state, items: action.items};
        case STORE_FILTER_SLOT:
            return { ...state, filter: { ...state.filter, slot: action.slot}};
        case STORE_FILTER_SEARCH:
            return { ...state, filter: { ...state.filter, search: action.search}};
        case STORE_SORTING_PROPERTY:
            return { ...state, sorting: { direction: getSortDirection(action.property, state.sorting), property: action.property, }};
        case STORE_IMPORT_MODAL_OPEN:
            return { ...state, importModalOpen: action.importModalOpen};
        case STORE_SHARE_LOCK_SPOILER_PANEL:
            return { ...state, shareLockSpoilerPanel: action.shareLockSpoilerPanel};
        default:
            return state;
    }
}

export default ItemViewState;
