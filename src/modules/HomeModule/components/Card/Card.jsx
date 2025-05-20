import CountUp from "react-countup";

export default function Card({ cardTitle, stats }) {
  return (
    <div
      className=" text-white rounded-4 p-4"
      style={{
        display: "flex",
        flex: "1",
        flexDirection: "column",
        background: "#009247",
      }}
    >
      <h4 className="mb-3 fw-bold text-capitaliz">{cardTitle}</h4>
      <div className="bg-white text-dark d-flex justify-content-around align-items-center rounded-3 py-3 flex-wrap">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="text-center px-4 py-2 flex-fill border-end"
            style={{ minWidth: "150px" }}
          >
            <i className={`bi ${item.icon} fs-4 text-success`}></i>
            <h3 className="fw-bold mt-2">
              <CountUp end={item.value} duration={1.5} delay={idx * 0.3} />
            </h3>
            <div className="text-muted">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
