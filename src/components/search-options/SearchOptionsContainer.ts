import SearchOptions from "./SearchOptions";
import { connect } from "react-redux";
import { storeDiscount } from "../../State/ConfigurationState";
import { storeFilterSlot, storeFilterSearch, storeSortingProperty, storeDisplayType, storePlayerFilter, storeShowAvailable } from "../../State/ItemViewState";
import { GloomhavenItemSlot, SortProperty, ItemViewDisplayType } from "../../State/Types";

const mapStateToProps = (state: any) => ({
  filter: state.itemViewState.filter,
  sorting: state.itemViewState.sorting,
  displayType: state.itemViewState.displayType,
  discount: state.configurationState.discount,
  players: state.configurationState.players,
})

const mapDispatchToProps = (dispatch: any) => ({
  storeDisplayType: (displayType: ItemViewDisplayType) => dispatch(storeDisplayType(displayType)),
  storeDiscount: (discount: number) => dispatch(storeDiscount(discount)),
  storeFilterSlot: (slot?: GloomhavenItemSlot) => dispatch(storeFilterSlot(slot)),
  storeFilterSearch: (search: string) => dispatch(storeFilterSearch(search)),
  storeFilterPlayer: (player: string) => dispatch(storePlayerFilter(player)),
  storeSortingProperty: (property: SortProperty) => dispatch(storeSortingProperty(property)),
  storeShowAvailable: (showAvailable: boolean) => dispatch(storeShowAvailable(showAvailable))
 });

export default connect(mapStateToProps, mapDispatchToProps)(SearchOptions);
