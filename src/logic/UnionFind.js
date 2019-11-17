export default class UnionFind {
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
