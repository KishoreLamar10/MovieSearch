import "./Skeleton.css";

const Skeleton = ({ type }) => {
  if (type === "card") {
    return (
      <div className="skeleton-card">
        <div className="skeleton-image pulse"></div>
        <div className="skeleton-info">
          <div className="skeleton-text title pulse"></div>
          <div className="skeleton-text pulse"></div>
          <div className="skeleton-text pulse"></div>
        </div>
      </div>
    );
  }

  if (type === "hero") {
    return (
      <div className="skeleton-hero pulse"></div>
    );
  }

  return <div className={`skeleton ${type} pulse`}></div>;
};

export default Skeleton;
