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
  ],
});

class TreeNode extends React.Component {
  render() {
    let { node } = this.props;

    if (node.children.length === 0) {
      return <span>{node.data.text}</span>;
    } else {
      return (
        <span style={{ fontWeight: 'bold' }}>
          {node.data.text}
        </span>
      );
    }
  }
}
console.log(tree);
ReactDOM.render(
  <VirtualTree nodes={tree}
               itemHeight={30}
               collapsed={true}>
    <TreeNode/>
  </VirtualTree>,
  document.body
);
