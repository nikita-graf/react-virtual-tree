import React from 'react';
import bem from 'bem-cn';

let block = bem('virtual-tree-node');

export default class VirtualTreeNode extends React.Component {

  toggleCollapse = () => {
    let {node, index, collapsed} = this.props;

    this.props[collapsed ? 'onExpand' : 'onCollapse'](node, index);
  };

  render() {
    let {
      node,
      height,
      children,
      collapsed
    } = this.props;
    let hasChildren = node.children && node.children.length;
    let className = block({
      leaf: !hasChildren
    });
    let style = {
      paddingLeft: (node.level - 1) * 10 + 'px',
      height: height + 'px'
    };

    return (
      <li className={className} style={style}>
        {
          hasChildren &&
          <span className="plai">
            <div icon="ti-angle-down"
                 rotated={collapsed}
                 onClick={this.toggleCollapse}>
              "+"
            </div>
          </span>
        }
        {
          React.cloneElement(children, {
            node: node
          })
        }
      </li>
    );
  }

}