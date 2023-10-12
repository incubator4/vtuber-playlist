import "./Timeline.css";

interface TimelineProps {
  color: {
    red: number;
    green: number;
    blue: number;
  };
  image: string;
}

const Timeline = (props: TimelineProps) => {
  const { red, green, blue } = props.color;
  const maskStyle = {
    backgroundImage: `radial-gradient(
      100% 50% at 100% 50%,
      rgba(${red}, ${green}, ${blue}, 0.7) 0%,
      rgba(0, 0, 0, 0) 100%
    )`,
  };

  const maskAfterStyle = {
    backgroundImage: `linear-gradient(
      180deg, rgba(${red}, ${green}, ${blue}, 0.25) 0%, #a8ccee 100%
    )`,
  };

  const animationDelay = (second: number) =>
    `calc((var(--rotate-speed) / var(--count)) * -${second * 1000}ms)`;

  return (
    <div className="void" id="void">
      <div className="crop">
        <ul className="card-list">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <li
                key={index}
                style={{
                  animationDelay: animationDelay(index),
                }}
              >
                <div
                  className="card"
                  style={{
                    animationDelay: animationDelay(index),
                  }}
                >
                  <a href="" style={{ color: `#535062` }}>
                    {/* <div>Index {index}</div>
                      <div>2020-2024</div>
                      <span>Model for generating</span> */}
                  </a>
                </div>
              </li>
            ))}
        </ul>
        <div className="last-circle"></div>
        <div className="second-circle"></div>
      </div>
      <div className="mask" style={maskStyle}>
        <div className="mask-after" style={maskAfterStyle} />
      </div>
      <div
        className="center-circle"
        style={{ backgroundImage: `url(${props.image})` }}
      ></div>
    </div>
  );
};

export default Timeline;
