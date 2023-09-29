import { Slot } from "expo-router";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

export default function HomeLayout() {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  );
}
