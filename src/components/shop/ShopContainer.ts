import { connect } from "react-redux"
import Shop from "./Shop"
import { storeItemsInUse } from "../../State/ConfigurationState"
import { ItemsInUse } from "../../State/Types"

const mapStateToProps = (state: any) => ({
    itemsInUse: state.spoilerFilter.itemsInUse,
    items: state.itemViewState.items
})

const mapDispatchToProps = (dispatch: any) => ({
    storeItems: (items: ItemsInUse) => dispatch(storeItemsInUse(items))
})

export default connect(mapStateToProps, mapDispatchToProps)(Shop)