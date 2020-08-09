import { SoloClassShorthand, ItemViewDisplayType, ItemsInUse } from "./Types";

export const STORE_CONFIGURATION = 'STORE_CONFIGURATION';
export const STORE_PROSPERITY = 'STORE_PROSPERITY';
export const STORE_SOLO_CLASS = 'STORE_SOLO_CLASS'
export const STORE_PROSPERITY_ITEM = 'STORE_ITEM'
export const STORE_ALL = 'STORE_ALL'
export const STORE_ENABLE_STORE_STOCK_MANAGEMENT = 'STORE_ENABLE_STORE_STOCK_MANAGEMENT';
export const STORE_DISPLAY_AS = 'STORE_DISPLAY_AS';
export const STORE_DISCOUNT = 'STORE_DISCOUNT';
export const BUY_ITEM = 'BUY_ITEM';
export const SELL_ITEM = 'SELL_ITEM';

export function storeConfiguration(configurationState: ConfigurationState) {
    return { type: STORE_CONFIGURATION, configuration: configurationState}
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

export function storeAll(all: boolean) {
    return { type: STORE_ALL, all}
}

export function storeEnableStoreStockManagement(enableStoreStockManagement: boolean) {
    return {type: STORE_ENABLE_STORE_STOCK_MANAGEMENT, enableStoreStockManagement};
}

export function storeDiscount(discount: number) {
    return {type: STORE_DISCOUNT, discount};
}

export function buyItem(itemId: number, playerName: string) {
    return {type: BUY_ITEM, payload: {itemId, playerName}};
}

export function sellItem(itemId: number, playerName: string) {
    return {type: SELL_ITEM, payload: {itemId, playerName}};
}

export interface ConfigurationState {
    all: boolean
    prosperity: number
    prosperityItemIds: Array<number>
    itemsInUse: ItemsInUse
    soloClass: Array<SoloClassShorthand>
    discount: number
    enableStoreStockManagement: boolean
    hash: string
}

const initialConfigurationState: ConfigurationState = {
    all: false,
    prosperity: 1,
    prosperityItemIds: [],
    itemsInUse: {},
    soloClass: [],
    discount: 0,
    enableStoreStockManagement: false,
    hash: ''
};

const addPlayerToItem = (itemsInUse: ItemsInUse, itemId: number, playerName: string): ItemsInUse => {
    const updatedItemsInUse = {...itemsInUse}
    if (updatedItemsInUse[itemId]) {
        updatedItemsInUse[itemId] = [...updatedItemsInUse[itemId], playerName]
    } else {
        updatedItemsInUse[itemId] = [playerName]
    }

    return updatedItemsInUse
}

const removePlayerFromItem = (itemsInUse: ItemsInUse, itemId: number, playerName: string): ItemsInUse => {
  const updatedItemsInUse = {...itemsInUse}
  updatedItemsInUse[itemId] = updatedItemsInUse[itemId].filter(player => player !== playerName)
  return updatedItemsInUse;
}

export function configurationState(state = initialConfigurationState, action:any) {
    let newState = state;
    switch (action.type)
    {
        case STORE_CONFIGURATION:
            return newState = action.configuration;
        case STORE_PROSPERITY:
            return newState = { ...state, prosperity: action.prosperity};
        case STORE_SOLO_CLASS:
            return newState = { ...state, soloClass: action.soloClass};
        case STORE_PROSPERITY_ITEM:
            return newState = { ...state, prosperityItemIds: action.itemId};
        case STORE_ALL:
            return newState = { ...state, all: action.all};
        case STORE_ENABLE_STORE_STOCK_MANAGEMENT:
            return newState = {...state, enableStoreStockManagement: action.enableStoreStockManagement};
        case STORE_DISCOUNT:
            return newState = {...state, discount: action.discount};
        case BUY_ITEM:
            return newState = {...state, itemsInUse: addPlayerToItem(state.itemsInUse, action.payload.itemId, action.payload.playerName)}
        case SELL_ITEM:
            return newState = {...state, itemsInUse: removePlayerFromItem(state.itemsInUse, action.payload.itemId, action.payload.playerName)}
        default:
            return state;
    }
    return newState;
}

export default ConfigurationState;