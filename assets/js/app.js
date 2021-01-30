//The initial app kept throwing unresolvable errors, so I have chosen a second 
//path to coding


//Set-up Canvas
var svgWidth = 1200; //window.innerWidth;
var svgHeight = 600; //window.innerHeight;

var margin = {
    top: 20,
    bottom: 80,
    right: 40,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var w = parseInt(d3.select("#scatter").style("width")) + margin.left + margin.right;


//Import Data
