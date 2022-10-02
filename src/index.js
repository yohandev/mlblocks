// Code conventions:
// Use const wherever possible, let otherwise(never use var, fuck var).
// No newline before brackets/parentheses(ie. functions or below).
// Use lambdas over functions, or methods in classes
// No semicolons if you don't need them(me and the boys hate them)
// Commands:
// Build using `yarn run build`(make sure you `yarn` first to
// download dependencies the first time)
import $ from 'jquery'

import NodeMultiply from './nodes/multiply'
import NodeLog from './nodes/log'
import NodeBlur from './nodes/blur'
import NodeImage from './nodes/image'

const nodes = []

$(document).ready(() => {
    nodes.push(new NodeLog("a", nodes))
    nodes.push(new NodeMultiply("b", nodes))
    nodes.push(new NodeImage("c", nodes))
    nodes.push(new NodeBlur("d", nodes))
    nodes.push(new NodeLog("e", nodes))
})