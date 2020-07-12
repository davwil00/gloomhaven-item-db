import SearchOptions from "./SearchOptions";
import { connect } from "react-redux";
import { storeDisplayAs, storeDiscount } from "../../State/ConfigurationState";
import { storeFilterSlot, storeFilterSearch, storeSortingProperty } from "../../State/ItemViewState";
import { GloomhavenItemSlot, SortProperty } from "../../State/Types";

const mapStateToProps = (state: any) => ({
  filter: state.itemViewState.filter,
  sorting: state.itemViewState.sorting,
  displayAs: state.configurationState.displayAs,
  discount: state.configurationState.discount
})

const mapDispatchToProps = (dispatch: any) => ({
  storeDisplayAs: (displayAs: string) => dispatch(storeDisplayAs(displayAs)),
  storeDiscount: (discount: number) => dispatch(storeDiscount(discount)),
  storeFilterSlot: (slot?: GloomhavenItemSlot) => dispatch(storeFilterSlot(slot)),
  storeFilterSearch: (search: string) => dispatch(storeFilterSearch(search)),
  storeSortingProperty: (property: SortProperty) => dispatch(storeSortingProperty(property))
 });

export default connect(mapStateToProps, mapDispatchToProps)(SearchOptions);
