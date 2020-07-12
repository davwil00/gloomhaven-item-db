import SearchOptions from "./SearchOptions";
import { connect } from "react-redux";
import { storeDiscount } from "../../State/ConfigurationState";
import { storeFilterSlot, storeFilterSearch, storeSortingProperty, storeDisplayType } from "../../State/ItemViewState";
import { GloomhavenItemSlot, SortProperty, ItemViewDisplayType } from "../../State/Types";

const mapStateToProps = (state: any) => ({
  filter: state.itemViewState.filter,
  sorting: state.itemViewState.sorting,
  displayType: state.itemViewState.displayType,
  discount: state.configurationState.discount
})

const mapDispatchToProps = (dispatch: any) => ({
  storeDisplayType: (displayType: ItemViewDisplayType) => dispatch(storeDisplayType(displayType)),
  storeDiscount: (discount: number) => dispatch(storeDiscount(discount)),
  storeFilterSlot: (slot?: GloomhavenItemSlot) => dispatch(storeFilterSlot(slot)),
  storeFilterSearch: (search: string) => dispatch(storeFilterSearch(search)),
  storeSortingProperty: (property: SortProperty) => dispatch(storeSortingProperty(property))
 });

export default connect(mapStateToProps, mapDispatchToProps)(SearchOptions);
