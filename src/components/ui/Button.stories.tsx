import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "outline", "link", "destructive"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon", "icon-sm", "icon-lg"],
    },
  },
};

export default meta;

export const Primary = {
  args: {
    variant: "primary",
  },
};

export const Secondary = {
  args: {
    variant: "secondary",
  },
};

export const Ghost = {
  args: {
    variant: "ghost",
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
};
