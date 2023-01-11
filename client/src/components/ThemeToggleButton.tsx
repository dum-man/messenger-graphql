import { IconButton, useColorMode } from "@chakra-ui/react";
import { BsSun } from "react-icons/bs";
import { HiOutlineMoon } from "react-icons/hi";

const ThemeToggleButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label={colorMode === "dark" ? "Light" : "Dark"}
      bg={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.50"}
      _hover={{
        bg: colorMode === "dark" ? "whiteAlpha.300" : "blackAlpha.200",
      }}
      _active={{
        bg: colorMode === "dark" ? "whiteAlpha.400" : "blackAlpha.50",
      }}
      icon={
        colorMode === "dark" ? <BsSun size={20} /> : <HiOutlineMoon size={20} />
      }
      onClick={toggleColorMode}
    />
  );
};

export default ThemeToggleButton;
