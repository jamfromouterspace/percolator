import React, { useState, useEffect } from "react";
import "./App.css";

class UF {
  // Standard quick-union implementation of UF
  constructor(N) {
    this.N = N;
    this.id = [];
    for (let i = 0; i < N; i++) this.id.push(i);
  }

  root(i) {
    while (this.id[i] !== i) i = this.id[i];
    return i;
  }

  union(p, q) {
    const rootp = this.root(p);
    const rootq = this.root(q);
    if (rootp === rootq) return;
    this.id[rootp] = this.id[rootq];
  }

  connected(p, q) {
    return this.root(p) === this.root(q);
  }

  log() {
    console.log("ROOTS:");
    console.log(this.id);
  }
}

class Percolator {
  constructor(N) {
    this.init(N);
  }

  init(N) {
    this.N = N;
    this.Nsq = N * N;
    this.percolates = false;
    this.probability = 0.0;
    // Cell states:
    // 0 - closed
    // 1 - open
    // 2 - fully open (touches top or bottom)
    this.cells = [];
    // Keep track of the empty sites
    // so that we can open them up randomly
    // (we don't want to re-open an already-open site)
    this.emptyCells = [];
    // Keep track of open cells so we can constantly
    // update the cell colors if they're fully connected
    // (see populateFullyOpen)
    this.openCells = new Set();
    for (let i = 0; i < N * N; i++) {
      this.cells.push(0);
      this.emptyCells.push(i);
    }
    // We create a union find tree with two extra (virtual) nodes
    // one for the top and one for the bottom
    this.uf = new UF(N * N + 2);
    // Shuffle emptySites - O(N)
    this.emptyCells = this.shuffle(this.emptyCells);
    // Then when we can pop one from the list when we open a site - O(1)
  }

  isOpen(i) {
    return this.cells[i] !== 0;
  }

  isTopCell = i => i < this.N;
  isBottomCell = i => i >= this.Nsq - this.N;

  getAdjacent(i) {
    const N = this.N;
    let adj = [];
    // Top cell
    if (!this.isTopCell(i)) adj.push(i - N);
    // Right cell
    if ((i + 1) % N !== 0) adj.push(i + 1);
    // Bottom cell
    if (!this.isBottomCell(i)) adj.push(i + N);
    // Left cell
    if (i % N !== 0) adj.push(i - 1);
    return adj;
  }

  shuffle(array) {
    // Fisher-yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  // Open a random cell
  openCell() {
    // All cells are already open
    if (this.emptyCells.length === 0) return;

    // Pop from randomized emptyCells stack
    const i = this.emptyCells[this.emptyCells.length - 1];
    console.log("OPENING CELL " + i);
    this.emptyCells.pop();
    this.openCells.add(i);
    // Update probability
    this.probability = Math.abs(this.Nsq - this.emptyCells.length) / this.Nsq;
    if (this.isTopCell(i)) {
      // Connect to top virtual node if i is a top-row cell
      this.cells[i] = 2;
      this.uf.union(i + 1, 0);
    } else if (this.isBottomCell(i)) {
      // Connect to bottom virtual node if i is a bottom-row cell
      this.cells[i] = 2;
      this.uf.union(i + 1, this.Nsq + 1);
    } else {
      this.cells[i] = 1;
    }

    // Reduce set size (we only need the non-fully open cells)
    if (this.cells[i] === 2) this.openCells.delete(i);

    const adjacentCells = this.getAdjacent(i);
    console.log("ADJ: ", adjacentCells);
    for (const j of adjacentCells) {
      // If adjacent cell is open, connect it to the newly opened cell
      // Note that we need to do +1 because uf internally has
      // a virtual node at 0
      if (this.cells[j] > 0) {
        this.uf.union(j + 1, i + 1);
        // Alternatively, if j was a top/bottom cell and i wasn't, then i is connected to the top/bottom
        if (this.cells[j] === 2 && this.cells[i] !== 2) {
          this.cells[i] = 2;
          this.openCells.delete(i);
        }
      }
    }

    // If i is a fully-connected cell, populate all connected cells
    // to be fully-connected (if it isn't already)
    this.populateFullyConnected();

    // Now check if it percolates
    this.percolates = this.uf.connected(0, this.Nsq + 1);
  }

  populateFullyConnected() {
    const open = [...this.openCells];
    for (const i of open) {
      // Connected to top virtal node
      console.log(i);
      if (
        this.uf.connected(i + 1, 0) ||
        this.uf.connected(i + 1, this.Nsq + 1)
      ) {
        this.cells[i] = 2;
        this.openCells.delete(i);
      }
    }
  }

  reset() {
    this.init(this.N);
  }

  getForest() {
    // Unflatten forest from id array
    // Returns nested json object representing tree
    const id = this.uf.id;
    let map = {};
    let forest = [];
    // Initialize the objects that will be returned later
    // (still flat, but in a hash map)
    // We will take advantage of pass by reference
    for (let i = 0; i < id.length; i++) {
      let name;
      if (i === 0) name = "Virtual Top";
      else if (i === this.Nsq + 1) name = "Virtual Bottom";
      else name = i;
      map[i] = {
        name,
        children: []
      };
    }

    for (let i = 0; i < id.length; i++) {
      if (id[i] === i) {
        // Root node
        forest.push(map[i]);
      } else {
        // Non-root node
        // Populate children array of parent
        map[id[i]].children.push(map[i]);
      }
    }

    return forest;
  }

  log() {
    this.uf.log();
    console.log({
      cells: this.cells,
      emptyCells: this.emptyCells,
      forest: this.getForest()
    });
  }
}

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

function Grid(props) {
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

function Cell(props) {
  let className = "cell";
  if (props.open) className += " open";
  else if (props.fullyOpen) className += " fully-open";
  return <div className={className} />;
}

const Table = props => {
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
};

export default App;
