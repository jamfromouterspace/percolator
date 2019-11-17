# Percolator

This app was inspired by the coursera Algorithms 1 course (very first topic on union-find)

It uses React to display an N by N grid of cells that are either `closed`, `open` (can be connected to other open cells), or `fully open` (touches the top or bottom). It uses quick-union with a virtual node at the top and bottom to determine whether the grid `percolates` or not (i.e. top is connected to bottom). Underneath is a D3 visualization of the trees, and I also added a Monte Carlo "simulation" which fills cells until it percolates, then does that 20 times and determines the average probability of cells being open required for percolation (it's supposed to be something like 0.593, but in this the sim results vary a lot).

See Princeton's Coursera course on Algorithms (week 1) for an overview of the concepts involved here.

**Most of the interesting code is in `Percolator.js` and `UnionFind.js`**. The rest is just UI stuff. The simulation stuff is a bit hacky, and I'm using a lot more state than is necessary.

## Converting a flattened array of parent notes to an unflattened js object

The quick-union algorithm uses an array to represent trees, where `array[i] = parent of i`. If `array[i] == i`, then it is a root nodeFor example,

```
 0,1,2,3,4  -> indices for reference
[0,0,2,2,1] -> parents
results in the following forest:

  0      2
 / \    /
1   4  3
```

I needed to convert this array `[0,0,2,2,1]` into an object like this for d3:

```
[
  {
    name: 0,
    children: [
      {
        name: 1,
        children: []
      },
      {
        name: 4,
        children: []
      }
    ]
  },
  {
    name: 2,
    children: [
      {
        name: 3,
        children: []
      }
    ]
  }
]

```

Notice that as you loop through the array, you might enounter a parent id being referenced that you haven't seen yet. No matter, you can solve this in O(N) time.

Thanks to alexandru.pausan and M.A.K. Ripon on stack overflow for this solution.
https://stackoverflow.com/a/31247960.

The idea is to make use of pass-by-reference.

0. Initialize your resulting js object.
   `forest = []`
1. Create a hash map, mapping each node `i` to an object shape you want. Initialize the children to `[]`.

```
i : {
  name: i,
  children: []
}
```

This is still flat, but these are the actual objects we will be pushing to `forest`.

2. Loop through the input array. If node `i` is a root node, then push `map[i]` to `forest`. We can modify `map[i]` later, and the changes will be visible in `forest` since this is pass-by-reference. If not a root node, push `map[i]` to `map[parent of i].children`.
3. Return `forest`

See `Percolator.getForest` for my implementation
