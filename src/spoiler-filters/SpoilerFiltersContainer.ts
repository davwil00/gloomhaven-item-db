import SpoilerFilters from "./SpoilerFilters";
import { storeProsperity, storeEnableStoreStockManagement, storeItem, storeSoloClass } from "../State/SpoilerFilter";
import { SoloClassShorthand } from "../State/Types";
import { connect } from "react-redux";

const mapStateToProps = (state: any) => ({
    spoilerFilter: state.spoilerFilter
})

const mapDispatchToProps = (dispatch: any) => ({
    storeProsperity: (prosperity: number) => dispatch(storeProsperity(prosperity)),
    storeEnableStoreStockManagement: (enableStoreStockManagement: boolean) => dispatch(storeEnableStoreStockManagement(enableStoreStockManagement)),
    storeItem: (item: Array<number>) => dispatch(storeItem(item)),
    storeSoloClass: (soloClass: Array<SoloClassShorthand>) => dispatch(storeSoloClass(soloClass))
})

export default connect(mapStateToProps, mapDispatchToProps)(SpoilerFilters)