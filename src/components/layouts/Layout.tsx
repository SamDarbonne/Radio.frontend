import { Outlet } from "react-router-dom";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
const { Header, Navbar, Main } = AppShell;

const Layout = () => {
  const [navbarOpen, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 220,
        breakpoint: "sm",
        collapsed: { mobile: !navbarOpen },
      }}
      padding="md"
    >
      <Header>
        <Burger
          opened={navbarOpen}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
        Header
      </Header>
      <Navbar p="md">Navbar</Navbar>
      <Main>
        <Outlet />
      </Main>
    </AppShell>
  );
};

export default Layout;
