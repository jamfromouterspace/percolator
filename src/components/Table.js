import React from "react";

export default function Table(props) {
  return (
    <table className="info-table">
      <thead>
        <tr>
          <th>N</th>
          <th>probability</th>
          <th>percolates?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.n}</td>
          <td>{props.probability}</td>
          <td>{props.percolates}</td>
        </tr>
      </tbody>
    </table>
  );
}
