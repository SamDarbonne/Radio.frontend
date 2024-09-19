import { Menu, ActionIcon } from "@mantine/core";
import api from "../fetch";

const SongRowActions = ({ id }: { id: string }) => {
  const handlePlay = () => {
    console.log("handling play");
    api.songs.play(id);
  };
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="default">...</ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={handlePlay}>Play</Menu.Item>
        <Menu.Item>Edit</Menu.Item>
        <Menu.Item color="red">Delete</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default SongRowActions;
