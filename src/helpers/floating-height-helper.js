import CommonHelper from './common-helper';

export default class FloatingHeightHelper extends CommonHelper {
  init(ready) {
    let { nodes } = this.component.state;
    let itemIndexToHeight = {};
    let itemIndexToPosition = {};
    let positionToItemIndex = {};
    let totalHeight = 0;

    nodes.forEach((item, index) => {
      let nodeHeight = this.getItemHeight(item);

      for (let i = totalHeight; i <= totalHeight + nodeHeight; i++) {
        positionToItemIndex[i] = index;
      }

      totalHeight += nodeHeight;
      itemIndexToHeight[index] = nodeHeight;
      itemIndexToPosition[index] = totalHeight;
    });

    this.component.setState({
      itemIndexToHeight,
      itemIndexToPosition,
      positionToItemIndex,
    }, ready);
  }

  getItemHeight(item) {
    let { itemHeight } = this.component.props;

    return itemHeight(item);
  }

  getVisibleNodesCount(firstNodeIndex, scrollOffset) {
    let { nodes, height } = this.component.state;
    let maxHeight = scrollOffset + height;
    let totalHeight = 0;
    let i = firstNodeIndex;
    let count = 0;

    while (totalHeight < maxHeight && i < nodes.length) {
      totalHeight += this.getItemHeight(nodes[i]);
      i++;
      count++;
    }

    return count;
  }

  getPositionByItemIndex(index) {
    let { itemIndexToPosition, itemIndexToHeight } = this.component.state;

    return itemIndexToPosition[index] - itemIndexToHeight[index];
  }

  getRawNodeIndexAtPosition(position) {
    return this.component.state[position];
  }

  getScrollHeight() {
    let { nodes, itemIndexToPosition } = this.component.state;
    let lastIndex = nodes.length - 1;

    return itemIndexToPosition[lastIndex];
  }
}
