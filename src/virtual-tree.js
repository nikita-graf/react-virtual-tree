import React from 'react';
import ReactDOM from 'react-dom';
import bem from 'bem-cn';
import VirtualTreeNode from './virtual-tree-node';
import FloatingHeightHelper from './helpers/fixed-height-helper';
import FixedHeightHelper from './helpers/fixed-height-helper';

let block = bem('virtual-tree');

export default class VirtualTree extends React.Component {

  constructor(props) {
    let {
      containerAdjust = 'fixed',
    } = props;

    super(props);
    this.state = {
      height: 0,
      width: 0,
      position: 0,
      prevPosition: 0,
      nodes: props.nodes,
    };
    this.nodeToHiddenChilds = {};
    this.collapsedNodes = {};
    this.helper = typeof itemHeight === 'function'
      ? new FloatingHeightHelper(this)
      : new FixedHeightHelper(this);
    this.adjustContainerStyle = containerAdjust === 'fixed'
      ? this.adjustContainerFixedStyle
      : this.adjustContainerAbsoluteStyle;
  }

  // TODO move to helpers
  adjustContainerFixedStyle(style, position, scrollOffset) {
    style.position = 'fixed';
    style.top = -(scrollOffset) + 'px';
  }

  adjustContainerAbsoluteStyle(style, position, scrollOffset) {
    style.position = 'absolute';
    style.top = -(scrollOffset) + 'px';
  }

  componentWillMount() {
    this.helper.init(() => {
      this.updateScrollHeight();
    });
  }

  componentDidMount() {
    let element = React.findDOMNode(this);
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
          position: this.normalizeScrollPosition(scrollPosition),
        });
      };
    } else {
      this.scrollContainer = window;
      updateScrollPosition = () => {
        // TODO offsetTop
        let offsetTop = element.offset().top;
        let windowScrollTop =  window.pageYOffset || document.documentElement.scrollTop;
        let scrollPosition = windowScrollTop - offsetTop;

        this.setState({
          position: this.normalizeScrollPosition(scrollPosition),
        });
      };
    }

    this.element = element;
    window.addEventListener('resize', this.updateViewport);
    this.scrollContainer.addEventListener('scroll', updateScrollPosition);
    this.unbind = () => {
      window.removeEventListener('resize', this.updateViewport);
      this.scrollContainer.removeEventListener('scroll', updateScrollPosition);
    };

    // TODO dry
    this.updateViewport();
    this.updateScrollHeight();
    setTimeout(() => {
      this.updateViewport();
      this.updateScrollHeight();
    }, 0);

    if (this.props.collapsed) {
      this.collapseAll();
    }
  }

  componentWillReceiveProps(nextProps) {
    let { nodes } = this.props;
    let { nodes: nextNodes } = nextProps;

    if (nextNodes !== nodes) {
      this.nodeToHiddenChilds = {};
      this.collapsedNodes = {};

      this.setState({
        nodes: nextNodes.slice(0),
      }, () => {
        //this.updateScrollHeight();
        this.helper.init(() => {
          this.updateScrollHeight();
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

  normalizeScrollPosition(position) {
    let { scrollHeight } = this.state;

    if (position < 0) {
      position = 0;
    } else if (position > scrollHeight) {
      position = scrollHeight;
    }

    return Math.round(position);
  }

  scrollTo(position, cb) {
    let newPosition = this.normalizeScrollPosition(position);

    this.setState({
      position: newPosition,
    }, () => {
      (cb || _.identity)();

      //TODO fix 80
      this.scrollContainer.scrollTop(newPosition > 0 ? newPosition + 80 : newPosition);
    });
  }

  updateScrollHeight() {
    this.setState({
      scrollHeight: this.helper.getScrollHeight(),
    });
  }

  updateViewport = () => {
    this.setState({
      height: this.scrollContainer.innerHeight,
      width: this.element.width(),
    });
  };

  getNodeIndexAtPosition(position) {
    let index = this.helper.getRawNodeIndexAtPosition(position);

    return this.normalizeNodeIndex(index);
  }

  normalizeNodeIndex(index) {
    index = Math.min(this.state.nodes.length - 1, index);
    index = Math.max(0, index);

    return index;
  }

  countChildrenAfterIndex(index) {
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
    let nodeChildrenCount = this.countChildrenAfterIndex(index);

    this.collapsedNodes[node.id] = true;
    this.nodeToHiddenChilds[node.id] = nodes.splice(index + 1, nodeChildrenCount);
    this.updateScrollHeight();
  };

  expandNode = (node, index) => {
    let { nodes } = this.state;
    let args = this.nodeToHiddenChilds[node.id].slice(0);

    args.unshift(0);
    args.unshift(index + 1);
    nodes.splice.apply(nodes, args);
    this.nodeToHiddenChilds[node.id] = null;
    this.collapsedNodes[node.id] = false;
    this.updateScrollHeight();
  };

  collapseAll() {
    let { nodes } = this.state;
    let rootChildren;

    if (!nodes.length) {
      return;
    }

    rootChildren = nodes[0].parent.children.slice(0);

    for (let id in this.nodeToHiddenChilds) {
      let hiddenNodes = this.nodeToHiddenChilds[id];

      if (hiddenNodes) {
        this.nodeToHiddenChilds[id] = nodes[0].parent.children.slice(0);
        hiddenNodes.forEach((node) => {
          if (node.children) {
            this.collapsedNodes[node.id] = true;
            this.nodeToHiddenChilds[node.id] = node.children.slice(0);
          }
        });
      }
    }

    for (let i = nodes.length - 1; i >= 0; i--) {
      let node = nodes[i];

      this.collapsedNodes[node.id] = true;

      if (node.children.length) {
        this.nodeToHiddenChilds[node.id] = node.children.slice(0);
      }
    }

    nodes.length = 0;
    rootChildren.forEach(child => nodes.push(child));

    this.updateScrollHeight();
  }

  expandAll() {
    let { nodes } = this.state;
    let expandNode = (node, index) => {
      let children = this.nodeToHiddenChilds[node.id];
      let nextIndex = index + 1;

      this.nodeToHiddenChilds[node.id] = null;
      this.collapsedNodes[node.id] = false;

      if (children) {
        let elementsAfter = nodes.slice(nextIndex);
        let elementsAfterLength = elementsAfter.length;

        nodes.length -= elementsAfterLength;

        for (let i = children.length - 1; i >= 0; i--) {
          let child = children[i];

          this.collapsedNodes[node.id] = false;
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

    this.updateScrollHeight();
  }

  getPlaceholderHeight() {
    let { scrollHeight, position } = this.state;
    let containerHeight = this.scrollContainer ? this.scrollContainer.innerHeight : 0;
    let delta = position > 0 ? 0 : -containerHeight;

    return scrollHeight > containerHeight ?  scrollHeight + delta : 0;
  }

  render() {
    let { width, height, position, nodes } = this.state;
    let { children } = this.props;
    let containerStyle = {};
    let placeholderStyle = {
      height: this.getPlaceholderHeight() + 'px',
    };
    let firstNodeIndex = this.normalizeNodeIndex(this.getNodeIndexAtPosition(position));
    let firstItemPosition = this.helper.getPositionByItemIndex(firstNodeIndex);
    let scrollOffset = position - firstItemPosition;
    let itemsCount = this.helper.getVisibleNodesCount(firstNodeIndex, scrollOffset);
    let lastNodeIndex = this.normalizeNodeIndex(firstNodeIndex + itemsCount);
    let nodesChunk = [];

    for (let i = firstNodeIndex; i <= lastNodeIndex; i++) {
      let node = nodes[i];

      nodesChunk.push(
        <VirtualTreeNode node={node}
                         collapsed={this.collapsedNodes[node.id]}
                         index={i}
                         key={node.id}
                         height={this.helper.getItemHeight(node)}
                         onCollapse={this.collapseNode}
                         onExpand={this.expandNode}>
          {
            React.cloneElement(children, {
              ref: i,
            })
          }
        </VirtualTreeNode>
      );
    }

    if (position > 0) {
      this.adjustContainerStyle(containerStyle, position, scrollOffset);
      containerStyle.width = width + 'px';
    } else {
      containerStyle.position = 'static';
      containerStyle.top = 'auto';
      containerStyle.width = 'auto';
    }

    return (
      <div className="virtual-tree">
        <div style={containerStyle}>
          <ul>
            {nodesChunk}
          </ul>
        </div>
        <div style={placeholderStyle}></div>
      </div>
    );
  }

}

//TODO revert
//classMixin(PlainTree, React.addons.PureRenderMixin);
