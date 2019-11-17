import React from "react";
import Cell from "./Cell";

export default function Grid(props) {
  const n = props.n;
  const renderGrid = () => {
    let grid = [];
    let row = [];
    let j = 0;
    for (let i = 0; i < n * n; i++) {
      const open = props.cells[i] === 1;
      const fullyOpen = props.cells[i] === 2;
      row.push(<Cell key={i} open={open} fullyOpen={fullyOpen} />);
      if ((i + 1) % n === 0) {
        j++;
        grid.push(
          <div key={j} className="row">
            {row}
          </div>
        );
        row = [];
      }
    }
    return grid;
  };
  return <div className="grid">{renderGrid()}</div>;
}
