import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./font.css";
import { moduleregistri } from "./config/agGrid/ModuleRegistry.ts";
import { ToastProvider } from "./components/ui/toast.tsx";

moduleregistri();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ToastProvider
    autoDismissTimeout={3000}
    // components={{ Toast: Snack }}
    placement="top-center"
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ToastProvider>
);
