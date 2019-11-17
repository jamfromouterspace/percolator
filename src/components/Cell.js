import React from "react";

export default function Cell(props) {
  let className = "cell";
  if (props.open) className += " open";
  else if (props.fullyOpen) className += " fully-open";
  return <div className={className} />;
}
