import WebSocketProvider from "@/components/WebSocketProvider";
import store, { persistor } from "@/redux/store";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <WebSocketProvider />
      <PersistGate loading={null} persistor={persistor}></PersistGate>
      <Component {...pageProps} />
    </Provider>
  )
}
