import { Menu, MenuList, MenuItem, useColorMode } from "@chakra-ui/react";
import { MdDeleteOutline } from "react-icons/md";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteConversation: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  onDeleteConversation,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Menu placement="top" isOpen={isOpen} onClose={onClose}>
      <MenuList bg={colorMode === "dark" ? "#2d2d2d" : "#f5f5f5"}>
        <MenuItem
          bg={colorMode === "dark" ? "#2d2d2d" : "#f5f5f5"}
          _hover={{
            bg: colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.50",
          }}
          icon={<MdDeleteOutline fontSize={20} />}
          onClick={(event) => {
            event.stopPropagation();
            onDeleteConversation();
          }}
        >
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default DropdownMenu;
