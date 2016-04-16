import React, { Component } from 'react';

const block = 'virtual-tree-node';

export default class VirtualTreeNode extends Component {

  toggleCollapse = () => {
    let { collapsed } = this.props;

    this.props[collapsed ? 'onExpand' : 'onCollapse']();
  };

  render() {
    let {
      node,
      collapsed,
      renderContent,
    } = this.props;
    let isLeaf = node.isLeaf();
    let leafClassName = isLeaf ? block + '_leaf' : '';
    let collapsedClassName = collapsed ? block + '_collapsed' : '';
    let className = `${block} ${leafClassName} ${collapsedClassName}`;
    let style = {
      paddingLeft: (node.level - 1) * 10 + 'px',
    };
    let arrow;

    if (!isLeaf) {
      arrow = <span className="virtual-tree-node__arrow" onClick={this.toggleCollapse}/>;
    }

    return (
      <div className={className} style={style}>
        {arrow}
        {renderContent(node)}
      </div>
    );
  }

}
