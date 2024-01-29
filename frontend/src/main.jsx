import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index";
// import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Provider store={store}>
        {/* <GoogleOAuthProvider clientId="632986354726-s92vbvmavvqnpi5mlmvdfvmggu3m5sma.apps.googleusercontent.com"> */}
        <App />
        {/* </GoogleOAuthProvider> */}
      </Provider>
    </BrowserRouter>
);
