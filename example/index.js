import React from 'react';
import ReactDOM from 'react-dom';
import {VirtualTree} from '../src';

ReactDOM.render(
  <VirtualTree nodes={nodes}
               itemHeight={30}
               collapsed={true}>
    <TreeNode/>
  </VirtualTree>,
  document.body
);