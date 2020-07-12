import React, {Component} from 'react';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { Main } from "./components/main";
import dbApp from "./State/Reducer";

const store = createStore(dbApp,  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());

class App extends Component {

    render() {

        return (
            <Container>
                <Provider store={store}>
                    <Main/>
                </Provider>
            </Container>
        );

    }
}

export default App;
