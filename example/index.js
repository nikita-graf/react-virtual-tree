import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import bem from 'bem-cn';
import BasicExample from './basic';
import CustomNodeExample from './custom-node';
import './example.css';
import '../css/react-virtual-tree.css';

let block = bem('app');
let examples = [
  {
    title: 'Basic',
    component: <BasicExample/>,
  },
  {
    title: 'Custom Node',
    component: <CustomNodeExample/>,
  },
];

class App extends Component {

  state = {
    examples: examples,
    activeExample: examples[0],
  };

  changeExample(example) {
    this.setState({
      activeExample: example,
    });
  }

  render() {
    let {
      activeExample,
      examples,
    } = this.state;

    return (
      <div className={block}>
        <div className={block('menu')}>
          <h2 className={block('header')}>React Virtual Tree</h2>
          <h3 className={block('list-header')}>
            <a href="https://github.com/nikita-graf/react-virtual-tree#props">Docs</a>
          </h3>
          <h3 className={block('list-header')}>Examples</h3>
          <ul className={block('list')}>
            {
              examples.map((example, index) => {
                let className = block('list-item')({
                  active: example === activeExample,
                });

                return <a className={className}
                          key={index}
                          onClick={this.changeExample.bind(this, example)}>{example.title}</a>;
              })
            }
          </ul>
        </div>
        <div className={block('content')}>
          {activeExample.component}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App/>,
  document.body
);
