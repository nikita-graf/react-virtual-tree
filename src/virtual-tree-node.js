import React from 'react';
import bem from 'bem-cn';

let block = bem('virtual-tree-node');

export default class VirtualTreeNode extends React.Component {

  toggleCollapse = () => {
    let { node, index, collapsed } = this.props;

    this.props[collapsed ? 'onExpand' : 'onCollapse'](node, index);
  };

  render() {
    let {
      node,
      height,
      children,
      collapsed,
    } = this.props;
    let hasChildren = node.children && node.children.length;
    let className = block({
      leaf: !hasChildren,
      collapsed: collapsed,
    });
    let style = {
      paddingLeft: (node.level - 1) * 10 + 'px',
      height: height + 'px',
    };
    let arrow;

    if (hasChildren) {
      arrow = <span className={block('arrow')} onClick={this.toggleCollapse}/>
    }

    return (
      <li className={className} style={style}>
        {arrow}
        {
          React.cloneElement(children, {
            node: node,
          })
        }
      </li>
    );
  }

}
