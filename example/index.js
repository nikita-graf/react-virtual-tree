import React from 'react';
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

class TreeNode extends React.Component {
  render() {
    let { node } = this.props;

    if (node.children.length === 0) {
      return <span>Item {node.data.value}</span>;
    } else {
      return (
        <span style={{ fontWeight: 'bold' }}>
          Item {node.data.value}
        </span>
      );
    }
  }
}

ReactDOM.render(
  <VirtualTree nodes={tree}
               itemHeight={30}
               collapsed={true}>
    <TreeNode/>
  </VirtualTree>,
  document.body
);
