import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { CONFIG } from "./config";
import { Provider } from "react-redux";
import store from "@shared/store";
import "@shared/styles/variables.scss";
import "@shared/styles/globals.scss";
import "react-modal-global/styles/modal.scss";
import "swiper/css";
import "swiper/css/navigation";
import { AppLayout } from "./features/shared/components/AppLayout";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GoogleOAuthProvider clientId={CONFIG.GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <Provider store={store}>
            <AppLayout />
          </Provider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;
