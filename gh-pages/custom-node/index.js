import React, { Component } from 'react';
import { VirtualTree, buildTree } from '../../src';
import generateItems from '../generate-items';

class CustomNode extends Component {

  toggleCollapse = () => {
    let { collapsed } = this.props;

    this.props[collapsed ? 'onExpand' : 'onCollapse']();
  };

  render() {
    let {
      node,
      collapsed,
    } = this.props;
    let style = {
      paddingLeft: (node.level - 1) * 10 + 'px',
    };
    let control;

    if (!node.isLeaf()) {
      control = <span onClick={this.toggleCollapse}>{collapsed ? '+' : '-'}</span>;
    } else {
      style.fontWeight = 'bold';
    }

    return (
      <div style={style}>
        {control}
        <span>Item {node.data.value}</span>
      </div>
    );
  }

}

export default () => {
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

  return <VirtualTree nodes={tree}
                     itemHeight={30}
                     collapsed={true}
                     renderNode={({
                       node,
                       collapsed,
                       onCollapse,
                       onExpand,
                     }) => (
                        <CustomNode node={node}
                                    collapsed={collapsed}
                                    onCollapse={onCollapse}
                                    onExpand={onExpand}/>
                     )}/>
};
