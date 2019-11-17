import React, { useState, useEffect } from "react";
import Tree from "react-d3-tree";
import Percolator from "./logic/Percolator";
import Grid from "./components/Grid";
import Table from "./components/Table";
import "./App.css";

const n = 4; // number of columns
const percolator = new Percolator(n);

function App() {
  // Probability of being an open cell
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [probability, setProbability] = useState(0.0);
  const [percolates, setPercolates] = useState(false);

  // Initialize on mount
  useEffect(() => {
    console.log("Mounted app.");
    setCells(percolator.cells);
    // percolator.log();
    setLoading(false);
  }, []);

  const handleOpenCell = () => {
    percolator.openCell();
    setCells([...percolator.cells]);
    setProbability(percolator.probability);
    setPercolates(percolator.percolates);
    percolator.log();
  };

  const handleReset = () => {
    percolator.reset();
    setCells([...percolator.cells]);
    setProbability(percolator.probability);
    setPercolates(percolator.percolates);
  };

  // useEffect(() => console.log("CELLS STATE CHANGE: ", cells), [cells]);

  if (loading) return <h1>Loading...</h1>;
  return (
    <div style={{ textAlign: "center" }}>
      <h1 className="title">Percolator</h1>
      <div className="app">
        <Grid n={n} cells={cells} />
        <Table
          n={n}
          probability={probability.toPrecision(4)}
          percolates={percolates.toString()}
        />
      </div>
      <div className="buttons">
        <button onClick={handleOpenCell}>Open random cell</button>
        <button onClick={handleReset}>Reset</button>
        <button disabled>Start simulation</button>
      </div>
    </div>
  );
}

export default App;
