import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import i18n from "@shared/utils/i18n";

const root = createRoot(document.getElementById("root")!);

(async function () {
  await i18n.init();
  root.render(<App />);
})();
