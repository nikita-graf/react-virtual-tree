let nodeId = 1;

function sortAlphabetically(a, b) {
  let aKeyValue = a.getKeyValue().toLowerCase();
  let bKeyValue = b.getKeyValue().toLowerCase();

  if(aKeyValue < bKeyValue) {
    return -1;
  }

  if(aKeyValue > bKeyValue) {
    return 1;
  }

  return 0;
}


class TreeNode {
  constructor(key, data, level) {
    this.id = nodeId++;
    this.level = level || 0;
    this.key = key;
    this.data = data;
    this.keyValueGetterName = typeof key === 'string'
      ? 'stringKeyValueGetter'
      : 'arrayKeyValueGetter';
    this.clear();
  }

  incChildrenCount() {
    this.allChildrenCount++;
  }

  addChild(node) {
    let nodeKey = node.getKeyValue();
    let child = this.childrenKeys[nodeKey];

    if (child) {
      return child;
    } else {
      this.childrenKeys[nodeKey] = node;
      this.children.push(node);
      node.parent = this;
    }
  }

  stringKeyValueGetter() {
    return this.data[this.key];
  }

  arrayKeyValueGetter() {
    let result = '';

    for (let i = 0, length =  this.key.length; i < length; i++) {
      result += this.data[this.key[i]];
    }

    return result;
  }

  getKeyValue() {
    return this[this.keyValueGetterName]();
  }

  sort(sortFn) {
    this.children.sort(sortFn);
  }

  getChildByKey(key) {
    return this.childrenKeys[key];
  }

  clear() {
    this.children = [];
    this.childrenKeys = {};
    this.allChildrenCount = 0;
  }

  isLeaf() {
    return !this.children.length;
  }

  traverseRoot(callback, node) {
    let parent = this.parent;

    node || (node = this);

    if (parent) {
      callback(parent, node);
      parent.traverseRoot(callback, node);
    }
  }

  traverse(callback) {
    if (this.data) {
      callback(this);
    }

    if (this.children.length) {
      this.children.forEach(function(child) {
        child.traverse(callback);
      });
    }
  }
}

export default class Tree extends TreeNode {
  constructor(items, nestingRules, filter, aggreg) {
    super();

    let rootNode = this;
    let currentNode;
    let i;
    let k;
    let itemsLength = items.length;
    let rulesLength = nestingRules.length;
    let nestingRule;
    let newNode;
    let childNode;
    let item;
    let sortFns = nestingRules.map((nestingRule) => {
      return typeof nestingRule.sortFn === 'function'
        ? nestingRule.sortFn
        : sortAlphabetically;
    });

    filter = filter || (n => n);

    for (i = 0; i < itemsLength; i++) {
      item = items[i];
      currentNode = rootNode;

      if (!filter(item)) {
        continue;
      }

      for (k = 0;  k < rulesLength; k++) {
        nestingRule = nestingRules[k];
        newNode = new TreeNode(nestingRule.attr, item, currentNode.level + 1);
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