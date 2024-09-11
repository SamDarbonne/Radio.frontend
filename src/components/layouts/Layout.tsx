import { Outlet } from "react-router-dom";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Navbar from "./Navbar";
const { Header, Main } = AppShell;

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
        <div>GC Radio</div>
      </Header>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
    </AppShell>
  );
};

export default Layout;
