import "../Gallery/styles.scss";

const ThumbBaseUrl = `${process.env.REACT_APP_BASE_URL}/images/thumbnails`;

export default function Gallery({ posts }) {

  const renderImages = () => {
    if (!posts)
      return;

    return posts.map(p => (
        <img className="gallery-image" key={p.id} src={ `${ThumbBaseUrl}/thumb-${p.checksum}.${p.format}`} alt="gallery"/>
    ));
  }

  return (
    <div className="gallery-container">
    { renderImages() }
    </div>
  )
}
