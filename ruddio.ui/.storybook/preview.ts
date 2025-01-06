import type { Preview } from "@storybook/react";
import "@shared/styles/variables.module.scss";
import "@shared/styles/globals.module.scss";

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
