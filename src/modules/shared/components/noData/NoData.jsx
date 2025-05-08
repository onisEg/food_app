import React from "react";

export default function NoData() {
  return (
    <div className="w-100 text-center py-3">
      <img src="/noData.svg" alt="No Data" />
      <h2>No Data!</h2>
      <p className="text-muted">
        There is no Categories available at the moment.
      </p>
    </div>
  );
}
