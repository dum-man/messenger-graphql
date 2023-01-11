import { extendTheme, StyleFunctionProps, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

export const theme = extendTheme(
  { config },
  {
    colors: {
      brand: {
        100: "#3d84f7",
      },
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          bg: props.colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.50",
          color:
            props.colorMode === "dark" ? "whiteAlpha.800" : "blackAlpha.800",
        },
      }),
    },
  }
);
