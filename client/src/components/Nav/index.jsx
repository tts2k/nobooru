import "./styles.scss"

export default function Nav(props) {

  const navElements = props.elements.map (e => (
    <li key={e.label}><a href={e.url}>{e.label}</a></li>
  ));

  return (
    <nav className={props.className}>
      <ul>
        {navElements}
      </ul>
    </nav>
  )
}
