// Code conventions:
// Use const wherever possible, let otherwise(never use var, fuck var).
// No newline before brackets/parentheses(ie. functions or below).
// Use lambdas over functions, or methods in classes
// No semicolons if you don't need them(me and the boys hate them)
// Commands:
// Build using `yarn run build`(make sure you `yarn init` first to
// download dependencies the first time)
import $ from 'jquery'


const abc = $(``)

abc.appendTo(document.body)