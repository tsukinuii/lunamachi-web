import "../src/app/globals.css";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#F8FBFF" },
        { name: "dark", value: "#0B1120" },
      ],
    },
  },
};

export default preview;
