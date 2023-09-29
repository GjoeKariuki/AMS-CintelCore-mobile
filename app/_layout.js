import { Slot } from "expo-router";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { UserProvider } from "../lib/contexts";

export default function HomeLayout() {
  return (
    <>
      <UserProvider>
        <Header />
        <Slot />
        <Footer />
      </UserProvider>
    </>
  );
}
