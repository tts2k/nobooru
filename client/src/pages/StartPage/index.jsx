import Nav from "../../components/Nav";
import "./style.scss";

const navElements = [
  {
    label: "Browse",
    url: "/browse"
  },
  {
    label: "My Account",
    url: "#"
  }
]

export default function StartPage() {

  return (
    <div className="start-container">
      <h1>Nobooru</h1>
      <Nav elements={navElements}/>
      <div className="start-search-bar">
        <input type="text"/>
        <button>Search</button>
      </div>
    </div>
  )
}
