import CommonHelper from './common-helper';

export default class FloatingHeightHelper extends CommonHelper {
  init(ready) {
    let {items} = this.component.state;
    let itemIndexToHeight = {};
    let itemIndexToPosition = {};
    let positionToItemIndex = {};
    let totalHeight = 0;

    items.forEach((item, index) => {
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
      positionToItemIndex
    }, ready);
  }

  getItemHeight(item) {
    let {itemHeight} = this.component.props;

    return itemHeight(item);
  }

  getVisibleNodesCount(firstNodeIndex, scrollOffset) {
    let {items, height} = this.component.state;
    let maxHeight = scrollOffset + height;
    let totalHeight = 0;
    let i = firstNodeIndex;
    let count = 0;

    while (totalHeight < maxHeight && i < items.length) {
      totalHeight += this.getItemHeight(items[i]);
      i++;
      count++;
    }

    return count;
  }

  getPositionByItemIndex(index) {
    let {itemIndexToPosition, itemIndexToHeight} = this.component.state;

    return itemIndexToPosition[index] - itemIndexToHeight[index];
  }

  getRawNodeIndexAtPosition(position) {
    return this.component.state[position];
  }

  getScrollHeight() {
    let {items, itemIndexToPosition} = this.component.state;
    let lastIndex = items.length - 1;

    return itemIndexToPosition[lastIndex];
  }
}
