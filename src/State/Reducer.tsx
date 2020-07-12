import {combineReducers } from "redux";
import {configurationState} from "./ConfigurationState"
import {itemViewState} from "./ItemViewState"

const dbApp = combineReducers( { itemViewState, configurationState} );

export default dbApp;
