import "./Marquee.css";

const items = [
  "QUIET LUXURY",
  "MODERN FORM",
  "EVERYDAY EDIT",
  "AUREVYN AUTUMN COLLECTION",
];

const Marquee = () => {
  return (
    <section
      className="aurevyn-marquee"
      aria-label="Aurevyn collection statement"
    >
      <div className="aurevyn-marquee__viewport">
        <div className="aurevyn-marquee__track">
          <div className="aurevyn-marquee__group">
            {items.map((item, index) => (
              <span key={`first-${index}`}>
                {item}
                <i>✦</i>
              </span>
            ))}
          </div>

          <div className="aurevyn-marquee__group" aria-hidden="true">
            {items.map((item, index) => (
              <span key={`second-${index}`}>
                {item}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marquee;
