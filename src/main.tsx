import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./stores";
import AppRoutes from "./routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
