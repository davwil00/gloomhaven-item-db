import { SoloClassShorthand, ItemViewDisplayType, ItemsInUse } from "./Types";
import { configurationLocalStorageKey } from "../components/main";

export const STORE_CONFIGURATION = 'STORE_CONFIGURATION';
export const STORE_PROSPERITY = 'STORE_PROSPERITY';
export const STORE_SOLO_CLASS = 'STORE_SOLO_CLASS'
export const STORE_PROSPERITY_ITEM = 'STORE_ITEM'
export const STORE_ITEMS_IN_USE = 'STORE_ITEMS_IN_USE'
export const STORE_ALL = 'STORE_ALL'
export const STORE_ENABLE_STORE_STOCK_MANAGEMENT = 'STORE_ENABLE_STORE_STOCK_MANAGEMENT';
export const STORE_DISPLAY_AS = 'STORE_DISPLAY_AS';
export const STORE_DISCOUNT = 'STORE_DISCOUNT';

export function storeConfiguration(configurationState: ConfigurationState) {
    return { type: STORE_CONFIGURATION, spoilerFilter: configurationState}
}

export function storeProsperity(prosperity: number) {
    return { type: STORE_PROSPERITY, prosperity}
}

export function storeSoloClass(soloClass: Array<SoloClassShorthand>) {
    return { type: STORE_SOLO_CLASS, soloClass}
}

export function storeProsperityItem(itemId: Array<number>) {
    return { type: STORE_PROSPERITY_ITEM, itemId}
}

export function storeItemsInUse(itemsInUse: ItemsInUse) {
    return { type: STORE_ITEMS_IN_USE, itemsInUse}
}

export function storeAll(all: boolean) {
    return { type: STORE_ALL, all}
}

export function storeEnableStoreStockManagement(enableStoreStockManagement: boolean) {
    return {type: STORE_ENABLE_STORE_STOCK_MANAGEMENT, enableStoreStockManagement};
}

export function storeDisplayAs(displayAs: string) {
    return {type: STORE_DISPLAY_AS, displayAs};
}

export function storeDiscount(discount: number) {
    return {type: STORE_DISCOUNT, discount};
}

export interface ConfigurationState {
    all: boolean
    prosperity: number
    prosperityItemIds: Array<number>
    itemsInUse: ItemsInUse
    soloClass: Array<SoloClassShorthand>
    discount: number
    displayAs: ItemViewDisplayType
    enableStoreStockManagement: boolean
    lockSpoilerPanel: boolean
}

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

export function configurationState(state = initialConfigurationState, action:any) {
    let newState = state;
    switch (action.type)
    {
        case STORE_CONFIGURATION:
            newState = action.spoilerFilter;
            break;
        case STORE_PROSPERITY:
            newState = { ...state, prosperity: action.prosperity};
            break;
        case STORE_SOLO_CLASS:
            newState = { ...state, soloClass: action.soloClass};
            break;
        case STORE_PROSPERITY_ITEM:
            newState = { ...state, prosperityItemIds: action.itemId};
            break;
        case STORE_ITEMS_IN_USE:
            newState = { ...state, itemsInUse: action.itemsInUse};
            break;
        case STORE_ALL:
            newState = { ...state, all: action.all};
            break;
        case STORE_ENABLE_STORE_STOCK_MANAGEMENT:
            newState = {...state, enableStoreStockManagement: action.enableStoreStockManagement};
            break;
        case STORE_DISPLAY_AS:
            newState = {...state, displayAs: action.displayAs};
            break;
        case STORE_DISCOUNT:
            newState = {...state, discount: action.discount};
            break;
        default:
            return state;
    }
    localStorage.setItem(configurationLocalStorageKey, JSON.stringify(newState));
    return newState;
}

export default ConfigurationState;