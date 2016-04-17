import React from 'react';
import { VirtualTree, buildTree } from '../../src';
import generateItems from '../generate-items';

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

export default () => (
  <VirtualTree nodes={tree}
               itemHeight={30}
               collapsed={true}
               renderContent={node => node.isLeaf() ? node.data.value : node.data[node.key] }>
  </VirtualTree>
);
