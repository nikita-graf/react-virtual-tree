import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import VirtualTreeNode from './virtual-tree-node';
import FloatingHeightHelper from './helpers/fixed-height-helper';
import FixedHeightHelper from './helpers/fixed-height-helper';

export default class VirtualTree extends Component {

  constructor(props) {
    let {
      itemHeight,
    } = props;

    super(props);
    this.state = {
      height: 0,
      width: 0,
      position: 0,
      nodes: props.nodes,
    };
    this._reset();
    this._helper = typeof itemHeight === 'function'
      ? new FloatingHeightHelper(this)
      : new FixedHeightHelper(this);
  }

  componentWillMount() {
    this._helper.init(() => {
      this._updateScrollHeight();
    });
  }

  componentDidMount() {
    let element = findDOMNode(this);
    let updateScrollPosition;

    if (this.props.scrollContainer) {
      this.scrollContainer = element;

      // TODO css
      //element.css({
      //  overflowY: 'scroll',
      //  overflowX: 'hidden',
      //  width: '100%',
      //  height: '100%'
      //});
      updateScrollPosition = () => {
        let scrollPosition = this.scrollContainer.pageYOffset;

        this.setState({
          position: this._normalizeScrollPosition(scrollPosition),
        });
      };
    } else {
      this.scrollContainer = window;
      updateScrollPosition = () => {
        let offsetTop = element.getBoundingClientRect().top + window.pageYOffset
          - document.documentElement.clientTop;
        let windowScrollTop =  window.pageYOffset || document.documentElement.scrollTop;
        let scrollPosition = windowScrollTop - offsetTop;

        this.setState({
          position: this._normalizeScrollPosition(scrollPosition),
        });
      };
    }

    this.element = element;
    window.addEventListener('resize', this._updateViewport);
    this.scrollContainer.addEventListener('scroll', updateScrollPosition);
    this.unbind = () => {
      window.removeEventListener('resize', this._updateViewport);
      this.scrollContainer.removeEventListener('scroll', updateScrollPosition);
    };

    // TODO dry
    this._updateViewport();
    this._updateScrollHeight();
    setTimeout(() => {
      this._updateViewport();
      this._updateScrollHeight();
    }, 0);

    if (this.props.collapsed) {
      this.collapseAll();
    }
  }

  componentWillReceiveProps(nextProps) {
    let { nodes } = this.props;
    let { nodes: nextNodes } = nextProps;

    if (nextNodes !== nodes) {
      this._reset();
      this.setState({
        nodes: nextNodes.slice(0),
      }, () => {
        //this._updateScrollHeight();
        this._helper.init(() => {
          this._updateScrollHeight();
        });

        if (this.props.collapsed) {
          this.collapseAll();
        }
      });
    }
  }

  componentWillUnmount() {
    this.unbind();
  }

  _reset() {
    this._nodeToHiddenChilds = {};
    this._collapsedNodes = {};
  }

  _renderNode(params) {
    let { renderNode, renderContent } = this.props;

    return renderNode
      ? renderNode(params)
      : <VirtualTreeNode renderContent={renderContent} {...params}/>;
  }

  _normalizeScrollPosition(position) {
    let { scrollHeight } = this.state;

    if (position < 0) {
      position = 0;
    } else if (position > scrollHeight) {
      position = scrollHeight;
    }

    return Math.round(position);
  }

  // scrollTo(position, cb) {
  //   let newPosition = this._normalizeScrollPosition(position);
  //
  //   this.setState({
  //     position: newPosition,
  //   }, () => {
  //     (cb || _.identity)();
  //
  //     //TODO fix 80
  //     this.scrollContainer.scrollTop(newPosition > 0 ? newPosition + 80 : newPosition);
  //   });
  // }

  _updateScrollHeight() {
    this.setState({
      scrollHeight: this._helper.getScrollHeight(),
    });
  }

  _updateViewport = () => {
    this.setState({
      height: this.scrollContainer.innerHeight,
      width: this.element.offsetWidth,
    });
  };

  _getNodeIndexAtPosition(position) {
    let index = this._helper.getRawNodeIndexAtPosition(position);

    return this._normalizeNodeIndex(index);
  }

  _normalizeNodeIndex(index) {
    index = Math.min(this.state.nodes.length - 1, index);
    index = Math.max(0, index);

    return index;
  }

  _countChildrenAfterIndex(index) {
    let { nodes } = this.state;
    let startNode = nodes[index];
    let node;
    let length = 0;

    for (let i = index + 1; i < nodes.length; i++) {
      node = nodes[i];

      if (node.level <= startNode.level) {
        break;
      }

      length++;
    }

    return length;
  }

  collapseNode = (node, index) => {
    let { nodes } = this.state;
    let nodeChildrenCount = this._countChildrenAfterIndex(index);

    this._collapsedNodes[node.id] = true;
    this._nodeToHiddenChilds[node.id] = nodes.splice(index + 1, nodeChildrenCount);
    this._updateScrollHeight();
  };

  expandNode = (node, index) => {
    let { nodes } = this.state;
    let args = this._nodeToHiddenChilds[node.id].slice(0);

    args.unshift(0);
    args.unshift(index + 1);
    nodes.splice.apply(nodes, args);
    this._nodeToHiddenChilds[node.id] = null;
    this._collapsedNodes[node.id] = false;
    this._updateScrollHeight();
  };

  collapseAll() {
    let { nodes } = this.state;
    let rootChildren;

    if (!nodes.length) {
      return;
    }

    rootChildren = nodes[0].parent.children.slice(0);

    for (let id in this._nodeToHiddenChilds) {
      let hiddenNodes = this._nodeToHiddenChilds[id];

      if (hiddenNodes) {
        this._nodeToHiddenChilds[id] = nodes[0].parent.children.slice(0);
        hiddenNodes.forEach((node) => {
          if (node.children) {
            this._collapsedNodes[node.id] = true;
            this._nodeToHiddenChilds[node.id] = node.children.slice(0);
          }
        });
      }
    }

    for (let i = nodes.length - 1; i >= 0; i--) {
      let node = nodes[i];

      this._collapsedNodes[node.id] = true;

      if (node.children.length) {
        this._nodeToHiddenChilds[node.id] = node.children.slice(0);
      }
    }

    nodes.length = 0;
    rootChildren.forEach(child => nodes.push(child));

    this._updateScrollHeight();
  }

  expandAll() {
    let { nodes } = this.state;
    let expandNode = (node, index) => {
      let children = this._nodeToHiddenChilds[node.id];
      let nextIndex = index + 1;

      this._nodeToHiddenChilds[node.id] = null;
      this._collapsedNodes[node.id] = false;

      if (children) {
        let elementsAfter = nodes.slice(nextIndex);
        let elementsAfterLength = elementsAfter.length;

        nodes.length -= elementsAfterLength;

        for (let i = children.length - 1; i >= 0; i--) {
          let child = children[i];

          this._collapsedNodes[node.id] = false;
          nodes[nextIndex + i] = child;

          if (child.children.length) {
            expandNode(child, nextIndex + i);
          }
        }

        let startIndex = nodes.length;

        for (let i = 0; i < elementsAfterLength; i++) {
          nodes[startIndex + i] = elementsAfter[i];
        }
      }
    };

    for (let i = nodes.length - 1; i >= 0; i--) {
      expandNode(nodes[i], i);
    }

    this._updateScrollHeight();
  }

  _getPlaceholderHeight() {
    let { scrollHeight, position } = this.state;
    let containerHeight = this.scrollContainer ? this.scrollContainer.innerHeight : 0;
    let delta = position > 0 ? 0 : -containerHeight;

    return scrollHeight > containerHeight ?  scrollHeight + delta : 0;
  }

  _getPlaceholderStyle() {
    return {
      height: this._getPlaceholderHeight() + 'px',
    };
  }

  _getContainerStyle(position, scrollOffset) {
    let { width } = this.state;
    let {
      containerPosition = 'fixed',
    } = this.props;

    return position > 0
      ? {
        position: containerPosition,
        top: -(scrollOffset) + 'px',
        width: width + 'px',
      }
      : {
        position: 'static',
        top: 'auto',
        width: 'auto',
      };
  }

  render() {
    let { position, nodes } = this.state;
    let firstNodeIndex = this._normalizeNodeIndex(this._getNodeIndexAtPosition(position));
    let firstItemPosition = this._helper.getPositionByItemIndex(firstNodeIndex);
    let scrollOffset = position - firstItemPosition;
    let itemsCount = this._helper.getVisibleNodesCount(firstNodeIndex, scrollOffset);
    let lastNodeIndex = this._normalizeNodeIndex(firstNodeIndex + itemsCount);
    let nodesChunk = [];

    for (let i = firstNodeIndex; i <= lastNodeIndex; i++) {
      let node = nodes[i];

      nodesChunk.push(
        <li className="virtual-tree__node-container"
            key={node.id}
            style={{ height: this._helper.getItemHeight(node) }}>
          {
            this._renderNode({
              node,
              collapsed: this._collapsedNodes[node.id],
              onCollapse: this.collapseNode.bind(this, node, i),
              onExpand: this.expandNode.bind(this, node, i),
            })
          }
        </li>
      );
    }

    return (
      <div className="virtual-tree">
        <ul className="virtual-tree__container"
            style={this._getContainerStyle(position, scrollOffset)}>
          {nodesChunk}
        </ul>
        <div className="virtual-tree__placeholder"
             style={this._getPlaceholderStyle()}></div>
      </div>
    );
  }

}
