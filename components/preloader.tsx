import "./preloader.css";

export default function Preloader() {
  return (
    <div className="preloader-overlay">
      <div className="preloader-content">
        <h1>Loading....</h1>
        <div id="cooking">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bubble" />
          ))}
          <div id="area">
            <div id="sides">
              <div id="pan" />
              <div id="handle" />
            </div>
            <div id="rice">
              <div id="chicken" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
