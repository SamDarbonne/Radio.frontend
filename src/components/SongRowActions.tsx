import { Menu, ActionIcon, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import api, { SongDocument } from "../fetch";
import Card from "./Card";

import "../styles/SongsTable.css";

const SongRowActions = ({ data }: { data: SongDocument }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const handlePlay = () => {
    console.log("handling play");
    api.songs.play(data._id);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        padding={"0px"}
        withinPortal={true}
      >
        <Card item={data} />
      </Modal>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="default">...</ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={handlePlay}>Play</Menu.Item>
          <Menu.Item>Edit</Menu.Item>
          <Menu.Item onClick={open}>Show Card</Menu.Item>
          <Menu.Item color="red">Delete</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default SongRowActions;
