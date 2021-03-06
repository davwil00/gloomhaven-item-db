import Configuration from "./Configuration";
import { storeProsperity, storeEnableStoreStockManagement, storeProsperityItem, storeSoloClass, storeDiscount, addPlayer, removePlayer } from "../../State/ConfigurationState";
import { SoloClassShorthand } from "../../State/Types";
import { connect } from "react-redux";

const mapStateToProps = (state: any) => ({
    configurationState: state.configurationState,
    discount: state.configurationState.discount
})

const mapDispatchToProps = (dispatch: any) => ({
    storeProsperity: (prosperity: number) => dispatch(storeProsperity(prosperity)),
    storeEnableStoreStockManagement: (enableStoreStockManagement: boolean) => dispatch(storeEnableStoreStockManagement(enableStoreStockManagement)),
    storeProsperityItem: (item: Array<number>) => dispatch(storeProsperityItem(item)),
    storeSoloClass: (soloClass: Array<SoloClassShorthand>) => dispatch(storeSoloClass(soloClass)),
    storeDiscount: (discount: number) => dispatch(storeDiscount(discount)),
    addPlayer: (playerName: string) => dispatch(addPlayer(playerName)),
    removePlayer: (playerName: string) => dispatch(removePlayer(playerName))
})

export default connect(mapStateToProps, mapDispatchToProps)(Configuration)