import React, { useState, useEffect } from "react";
import CenteredTree from "./components/CenteredTree";
import Percolator from "./logic/Percolator";
import Grid from "./components/Grid";
import Table from "./components/Table";
import delay from "./logic/delay";
import "./App.css";

const DEFAULT_N = 4;
const SIM_N = 20;

let percolator = new Percolator(DEFAULT_N);

function App() {
  // Probability of being an open cell
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simStatus, setSimStatus] = useState("");
  const [isFull, setIsFull] = useState(false);
  const [probability, setProbability] = useState(0.0);
  const [avgProbability, setAvgProbability] = useState(null);
  const [percolates, setPercolates] = useState(false);
  const [forestData, setForestData] = useState({});
  const [showIndices, setShowIndices] = useState(true);
  const [n, setN] = useState(DEFAULT_N);
  const [showForest, setShowForest] = useState(true);
  const [error, setError] = useState(null);

  // Initialize everything on mount
  useEffect(() => {
    console.log("Mounted app.");
    setCells(percolator.cells);
    percolator.log();
    setLoading(false);
    setForestData(percolator.getForest());
  }, []);

  // Open random cell
  const handleOpenCell = () => {
    percolator.openCell();
    setCells([...percolator.cells]);
    setProbability(percolator.probability);
    setPercolates(percolator.percolates);
    setForestData(percolator.getForest());
    setIsFull(percolator.isFull());
    if (!simulating) percolator.log();
  };

  // Reset button
  const handleReset = () => {
    if (simulating) window.location.reload();
    else {
      percolator.reset(n);
      setError(null);
      setCells([...percolator.cells]);
      setProbability(percolator.probability);
      setPercolates(percolator.percolates);
      setForestData(percolator.getForest());
      setShowForest(true);
      setIsFull(false);
      setSimStatus("");
      setAvgProbability(null);
    }
  };

  // Change grid size
  const handleChangeN = async newN => {
    newN = parseInt(newN);
    if (newN > 40) {
      setError(`N = ${newN} will crash the app! Resetting to 20 (max)`);
      newN = 20;
      setShowForest(false);
    } else if (newN > 10) {
      setError("N is large (increase at your own risk!). Disabling tree viz.");
      setShowForest(false);
    } else {
      setError(null);
      setShowForest(true);
    }

    if (newN < 0) setError("N must be a positive integer");
    else if (newN) {
      setN(parseInt(newN));
      setIsFull(true);
      setError("Click reset");
    } else {
      setN("");
    }
  };

  const startSimulation = async () => {
    setSimulating(true);
    setShowIndices(false);
    let avgProb = 0;
    for (let i = 0; i < SIM_N; i++) {
      handleReset();
      setSimStatus(`ITERATION ${i + 1}/${SIM_N}`);
      await delay(50);
      while (!percolator.percolates) {
        handleOpenCell();
        await delay(50);
      }
      avgProb += percolator.probability;
    }
    avgProb /= SIM_N;
    console.log("AVERAGE PROBABILITY: ", avgProb);
    setAvgProbability(avgProb);
    setSimulating(false);
    setShowForest(false);
  };

  if (loading) return <h1>Loading...</h1>;
  return (
    <div style={{ textAlign: "center" }}>
      <div className="title-row">
        <div style={{ flex: 1 }}></div>
        <h1 className="title">Percolator</h1>
        <a style={{ flex: 1 }} href="https://github.com/closetothe/percolator">
          <img width="32" alt="view on github" src="github-mark.png" />
        </a>
      </div>
      <div className="app">
        <Grid n={n} cells={cells} showIndices={showIndices} />
        <Table
          n={n}
          probability={probability.toPrecision(4)}
          percolates={percolates.toString()}
          simulating={simulating}
          handleChangeN={handleChangeN}
        />
      </div>
      <h3 className="error">{error}</h3>
      <div className="buttons">
        <button
          disabled={error || isFull || simulating}
          onClick={handleOpenCell}
        >
          open random cell
        </button>
        <button onClick={handleReset || simulating}>reset</button>
        <button disabled={error || simulating} onClick={startSimulation}>
          start simulation
        </button>
        <button onClick={() => setShowIndices(!showIndices)}>
          {showIndices === false ? "show indices" : "hide indices"}
        </button>
      </div>
      {simulating ? <h3 id="simulation-status">{simStatus}</h3> : null}
      <h3>
        {avgProbability
          ? "Average probability of percolation: " + avgProbability
          : null}
      </h3>
      {showForest && !simulating ? (
        <div>
          <h3>(Only trees with more than one node are shown)</h3>
          <div className="forest">
            {forestData.map((tree, i) => {
              if (tree.children && tree.children.length > 0) {
                return (
                  <CenteredTree
                    key={i}
                    className="treeWrapper"
                    orientation="vertical"
                    data={tree}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
