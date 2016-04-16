import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { VirtualTree, buildTree } from '../src';
import generateItems from './generate-items';

let tree = buildTree({
  items: generateItems(),
  levels: [
    {
      key: 'type1',
    },
    {
      key: 'type2',
    },
    {
      key: 'type3',
    },
    {
      key: 'id',
    },
  ],
});

// class TreeNode extends Component {
//
//   render() {
//     let { node } = this.props;
//
//     if (node.isLeaf() === 0) {
//       return <span>Item {node.data.value}</span>;
//     } else {
//       return (
//         <span style={{ fontWeight: 'bold' }}>
//           Item {node.data.value}
//         </span>
//       );
//     }
//   }
//
// }

// <VirtualTree nodes={tree}
//              itemHeight={30}
//              collapsed={true}
//              renderNode={({
//               node,
//               collapsed,
//               onCollapse,
//               onExpand,
//              }) => <TreeNode node collapsed onCollapse onExpand/>}>
// </VirtualTree>,

ReactDOM.render(
  <VirtualTree nodes={tree}
               itemHeight={30}
               collapsed={true}
               renderContent={node => node.isLeaf() ? node.data.value : node.data[node.key] }>
  </VirtualTree>,
  document.body
);
