import React from "react";
import Cell from "./Cell";

export default function Table(props) {
  return (
    <div className="tables">
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
            <td>
              <input
                disabled={props.simulating}
                type="number"
                value={props.n}
                onChange={e => props.handleChangeN(e.target.value)}
              />
            </td>
            <td>{props.probability}</td>
            <td className={props.percolates === "true" ? "yes" : "no"}>
              {props.percolates}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="info-table">
        <thead>
          <tr>
            <th>
              <Cell />
            </th>
            <th>
              <Cell open />
            </th>
            <th>
              <Cell fullyOpen />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>closed</td>
            <td>open</td>
            <td>
              fully open <br />
              (connects to top or bottom)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
