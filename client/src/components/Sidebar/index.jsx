import "./styles.scss"

export default function Sidebar ({ tags, types }) {

  const renderTag = (tagType) => {
    if (!tags[tagType])
      return;

    return Object.keys(tags[tagType]).map(t => (
      <li key={ t }>{ t } ({ tags[tagType][t]}) </li>
    ))
  }

  const renderType = () => {
    if (!types)
      return;
    return Object.keys(types).map(t => (
      <li key={ t }>{ t } ({ types[t] }) </li>
    ))
  }

  return (
    <div className="sidebar">
      <h3>Types</h3>
        <ul>
          { renderType() }
        </ul>
      <h3>Tags</h3>
      <div className="copyright">
        <h4>Copyright</h4>
        <ul>
          { renderTag("copyright") }
        </ul>
      </div>
      <div className="character">
        <h4>Character</h4>
        <ul>
          { renderTag("character") }
        </ul>
      </div>
      <div className="general">
        <h4>General</h4>
        <ul>
          { renderTag("normal") }
        </ul>
      </div>
    </div>
  )
}
