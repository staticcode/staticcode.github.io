'use strict';

exports.__esModule = true;
exports['default'] = (
`
.__react_component_tooltip {
  border-radius: 3px;
  display: inline-block;
  font-size: 11px;
  left: -999em;
  opacity: 0;
  padding: 8px 21px;
  position: fixed;
  pointer-events: none;
  transition: opacity 0.3s ease-out, margin-top 0.3s ease-out, margin-left 0.3s ease-out;
  top: -999em;
  visibility: hidden;
  z-index: 999;
  white-space: nowrap;
}

.__react_component_tooltip:after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
}

.__react_component_tooltip:before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
}

.__react_component_tooltip.show {
  opacity: 1;
  margin-top: 0px;
  margin-left: 0px;
  visibility: visible;
}

.__react_component_tooltip.type-dark {
  color: #fff;
  background-color: #222;
}

.__react_component_tooltip.type-dark.place-top:after {
  border-top: 8px solid #222;
}

.__react_component_tooltip.type-dark.place-bottom:after {
  border-bottom: 8px solid #222;
}

.__react_component_tooltip.type-dark.place-left:after {
  border-left: 6px solid #222;
}

.__react_component_tooltip.type-dark.place-right:after {
  border-right: 6px solid #222;
}

.__react_component_tooltip.type-success {
  color: #fff;
  background-color: #8DC572;
}

.__react_component_tooltip.type-success.place-top:after {
  border-top: 8px solid #8DC572;
}

.__react_component_tooltip.type-success.place-bottom:after {
  border-bottom: 8px solid #8DC572;
}

.__react_component_tooltip.type-success.place-left:after {
  border-left: 6px solid #8DC572;
}

.__react_component_tooltip.type-success.place-right:after {
  border-right: 6px solid #8DC572;
}

.__react_component_tooltip.type-warning {
  color: #fff;
  background-color: #F0AD4E;
}

.__react_component_tooltip.type-warning.place-top:after {
  border-top: 8px solid #F0AD4E;
}

.__react_component_tooltip.type-warning.place-bottom:after {
  border-bottom: 8px solid #F0AD4E;
}

.__react_component_tooltip.type-warning.place-left:after {
  border-left: 6px solid #F0AD4E;
}

.__react_component_tooltip.type-warning.place-right:after {
  border-right: 6px solid #F0AD4E;
}

.__react_component_tooltip.type-error {
  color: #fff;
  background-color: #BE6464;
}

.__react_component_tooltip.type-error.place-top:after {
  border-top: 8px solid #BE6464;
}

.__react_component_tooltip.type-error.place-bottom:after {
  border-bottom: 8px solid #BE6464;
}

.__react_component_tooltip.type-error.place-left:after {
  border-left: 6px solid #BE6464;
}

.__react_component_tooltip.type-error.place-right:after {
  border-right: 6px solid #BE6464;
}

.__react_component_tooltip.type-info {
  color: #fff;
  background-color: #337AB7;
}

.__react_component_tooltip.type-info.place-top:after {
  border-top: 8px solid #337AB7;
}

.__react_component_tooltip.type-info.place-bottom:after {
  border-bottom: 8px solid #337AB7;
}

.__react_component_tooltip.type-info.place-left:after {
  border-left: 6px solid #337AB7;
}

.__react_component_tooltip.type-info.place-right:after {
  border-right: 6px solid #337AB7;
}

.__react_component_tooltip.type-light {
  color: #222;
  background-color: #fff;
  border: 1px solid #ddd;
}

.__react_component_tooltip.type-light.place-top:after {
  border-top: 8px solid #fff;
}

.__react_component_tooltip.type-light.place-top:before {
  border-top: 9px solid #ddd;
}

.__react_component_tooltip.type-light.place-bottom:before {
  border-bottom: 9px solid #ddd;
}

.__react_component_tooltip.type-light.place-bottom:after {
  border-bottom: 9px solid #fff;
}

.__react_component_tooltip.type-light.place-left:before {
  border-left: 7px solid #ddd;
}

.__react_component_tooltip.type-light.place-left:after {
  border-left: 6px solid #fff;
}

.__react_component_tooltip.type-light.place-right:before {
  border-right: 7px solid #ddd;
}

.__react_component_tooltip.type-light.place-right:after {
  border-right: 6px solid #fff;
}

.__react_component_tooltip.place-top {
  margin-top: -15px;
}

.__react_component_tooltip.place-top:before {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  bottom: -10px;
  left: 50%;
  margin-left: -10px;
}

.__react_component_tooltip.place-left:before {
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  right: -8px;
  top: 50%;
  margin-top: -5px;
}

.__react_component_tooltip.place-top:after {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  bottom: -8px;
  left: 50%;
  margin-left: -10px;
}

.__react_component_tooltip.place-bottom {
  margin-top: 5px;
}

.__react_component_tooltip.place-bottom:after {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  top: -8px;
  left: 50%;
  margin-left: -10px;
}

.__react_component_tooltip.place-bottom:before {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  top: -9px;
  left: 50%;
  margin-left: -10px;
}

.__react_component_tooltip.place-left {
  margin-left: 0px;
}

.__react_component_tooltip.place-left:after {
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  right: -6px;
  top: 50%;
  margin-top: -5px;
}

.__react_component_tooltip.place-right {
  margin-left: 5px;
}

.__react_component_tooltip.place-right:after {
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  left: -6px;
  top: 50%;
  margin-top: -5px;
}

.__react_component_tooltip.place-right:before {
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  left: -8px;
  top: 50%;
  margin-top: -5px;
}

.__react_component_tooltip .multi-line {
  display: block;
  padding: 2px 0px;
}

`);


module.exports = exports['default'];
