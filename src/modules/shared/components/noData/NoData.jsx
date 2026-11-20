import PropTypes from "prop-types";

export default function NoData({ DataName }) {
  const label = DataName || "Data";
  return (
    <div className="w-100 text-center py-3">
      <img src="/noData.svg" alt="No Data" />
      <h2>No Data!</h2>
      <p className="text-muted">There is no {label} available at the moment.</p>
    </div>
  );
}

NoData.propTypes = {
  DataName: PropTypes.string,
};
