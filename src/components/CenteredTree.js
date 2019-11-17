// Forked from https://codesandbox.io/s/vvz51w5n63

import React from "react";
import Tree from "react-d3-tree";

export default class CenteredTree extends React.PureComponent {
  state = {};
  initialValue = {};

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 50
        // y: dimensions.height / 2
      }
    });
    this.reset = this.reset.bind(this);
  }

  reset() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: 50
        // y: dimensions.height / 2
      }
    });
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={tc => (this.treeContainer = tc)}
      >
        <button className="small" onClick={this.reset}>
          center
        </button>
        <Tree
          data={this.props.data}
          translate={this.state.translate}
          orientation={this.props.orientation}
        />
      </div>
    );
  }
}
