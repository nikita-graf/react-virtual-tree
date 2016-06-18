# [React Virtual Tree](http://nikita-graf.github.io/react-virtual-tree/)

### Installation
Using npm:
```
$ npm install react-virtual-tree --save
```
Package provides different types of modules:
```javascript
//ES6
import { VirtualTree, buildTree } from 'react-virtual-tree';

//ES5
var VirtualTree = require('react-virtual-tree').VirtualTree;
var buildTree = require('react-virtual-tree').buildTree;

//UMD
<script src="path-to-react-virtual-tree/dist/react-virtual-tree.min.js"></script>
```

### Props
| Prop | Type | Required | Description |
|:---|:---|:---:|:---|
| nodes | Nodes | ✓ | Nodes created by `buildTree` function  |
| itemHeight | Int, Function | ✓ | Height of node. Could be a function that returns height for each node. |
| collapsed | Boolean |  | Collapse tree or not at first render |
| renderContent | Function |  | Returns content of node  |
| renderNode | Function |  | Returns custom component for node  |
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
