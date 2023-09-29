import { Slot } from "expo-router";
import { Header } from "./components/header";

export default function HomeLayout() {
  return (
    <>
      <Header />
      <Slot />
    </>
  );
}
