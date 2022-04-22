import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import cartAndSidebar from "./store/reducers/cartAndSidebar";
import authReducer from "./store/reducers/auth";
import brandReducer from "./store/reducers/brand";
import filterReducer from "./store/reducers/filter";
import cartReducer from "./store/reducers/cart";
import orderReducer from "./store/reducers/order";

const composeEnhancers =
  (process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;

const rootReducer = combineReducers({
  ui: cartAndSidebar,
  auth: authReducer,
  brand: brandReducer,
  filter: filterReducer,
  cart: cartReducer,
  order: orderReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

