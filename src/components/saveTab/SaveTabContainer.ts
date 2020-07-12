import { connect } from "react-redux";
import SaveTab from "./SaveTab";
import { storeShareLockSpoilerPanel } from "../../State/ItemViewState";

const mapStateToProps = (state: any) => ({
    shareLockSpoilerPanel: state.itemViewState.shareLockSpoilerPanel,
    spoilerFilter: state.spoilerFilter
})

const mapDispatchToProps = (dispatch: any) => ({
    storeShareLockSpoilerPanel: (shareLockSpoilerPanel: boolean) => dispatch(storeShareLockSpoilerPanel(shareLockSpoilerPanel))
})

export default connect(mapStateToProps, mapDispatchToProps)(SaveTab)