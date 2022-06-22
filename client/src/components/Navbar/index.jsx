import { useSelector } from "react-redux";
import Nav from "../Nav";

import "./styles.scss";

const navElements = [
  { label: "Home", url: "/" },
  { label: "Browse", url: "/browse" },
  { label: "Upload", url: "/upload" },
  { label: "My Account", url: "/user" },
]

export default function Navbar() {
  const navbarHide = useSelector((state) => state.navbar.navbarHide);

  return (
    <Nav elements={navElements} className={`main-nav ${navbarHide ? 'nav-hidden' : ''}`}/>
  )
}
