# [React Virtual Tree](http://nikita-graf.github.io/react-virtual-tree/)

Installation
---------------

Using npm:
```
$ npm install react-virtual-tree --save
```
Package provides ES6, ES5, UMD modules:
```javascript
import { VirtualTree, buildTree } from 'react-virtual-tree';
var VirtualTree = require('react-virtual-tree').VirtualTree;
var buildTree = require('react-virtual-tree').buildTree;
<script src="path-to-react-virtual-tree/dist/react-virtual-tree.min.js"></script>
```

### Prop Types
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| nodes | Nodes | ✓ | Nodes created by `buildTree` function  |

### Example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { VirtualTree, buildTree } from 'react-virtual-tree';
import 'react-virtual-tree/css/react-virtual-tree.css';

let nodes = buildTree({
  items: [
    { id: 1, name: 'name1', color: 'red', value: '1' },
    { id: 2, name: 'name1', color: 'red', value: '2' },
    { id: 3, name: 'name2', color: 'blue', value: '3' }
  ],
  levels: [
    {
      key: 'color',
    },
    {
      key: 'name',
    },
    {
      key: 'id',
    },
  ],
});

ReactDOM.render(
  <VirtualTree nodes={nodes}
               itemHeight={30}
               collapsed={true}
               renderContent={node => node.isLeaf() ? node.data.value : node.data[node.key] }>
  </VirtualTree>,
  document.body
);
```
