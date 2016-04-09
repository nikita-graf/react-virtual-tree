import TreeNode from './tree-node';
import { sortNumeric } from './tree-sort';

export default class Tree extends TreeNode {
  constructor(items, nestingRules, filter) {
    super();

    let _this = this;
    let currentNode;
    let i;
    let k;
    let itemsLength = items.length;
    let rulesLength = nestingRules.length;
    let nestingRule;
    let newNode;
    let childNode;
    let item;
    let sortFns = nestingRules.map((nestingRule) =>
      typeof nestingRule.sort === 'function'
        ? nestingRule.sort
        : sortNumeric
    );

    for (i = 0; i < itemsLength; i++) {
      item = items[i];
      currentNode = _this;

      if (!filter(item)) {
        continue;
      }

      for (k = 0; k < rulesLength; k++) {
        nestingRule = nestingRules[k];
        newNode = new TreeNode(nestingRule.key, item, currentNode.level + 1);
        childNode = currentNode.getChildByKey(newNode.getKeyValue());

        if (!childNode) {
          childNode = newNode;
          currentNode.addChild(childNode);
          currentNode.sort(sortFns[k]);
        }

        currentNode = childNode;
      }
    }
  }
}
