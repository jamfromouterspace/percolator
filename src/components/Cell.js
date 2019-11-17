import React from "react";

export default function Cell(props) {
  let className = "cell";
  if (props.open) className += " open";
  else if (props.fullyOpen) className += " fully-open";
  if (props.showIndices) {
    className += " indexed";
    return <div className={className}>{props.index + 1}</div>;
  }
  return <div className={className} />;
}
