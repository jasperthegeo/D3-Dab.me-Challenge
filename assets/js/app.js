//This is the D3 Dabbler Challenge
//I will initially write the code for the static graph
//then modify as needed for the animated pseudo-3D graph

//Import required data
var file = "assets/data/data.csv"
d3.csv(file).then(successHandle, errorHandle);

//Use an error-handing function to append data and objects
//If an error does persist, it will be visible within the console
//for more information please refer to;
// https://expressjs.com/en/guide/error-handling.html

function errorHandle(error) {
    throw error;
};

//Loop thru data data
function successHandle (healthData {
    healthData.map(function (data) {
        // Obesity vs poverty
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;

        // smokers vs age
        data.age = +data.age;
        data.smokes = +data.smokes;

        // obesity vs household income
        data.obesity = +data.obesity;
        data.income = +data.income;
    });
});

//SVG canvas w/h parameters
//Set the margins, and create a w/h 
var svgWidth = 1024;
var svgHeight = 768;

//Set margins
var margin = {
    top: 24,
    bottom:24,
    right: 34,
    left: 34
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Specify SVG canvas attributes
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Create chart grouping aka chartGroup that will contain data
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Create Scale functions - For the first iteration they will be variables
//once complete they will be moved into a function so as to allow an animated
//axis change

//Linear scale; min/max of data to be displayed on the axis
var xLinearScale = d3.scaleLinear()
    .domain([8.5, d3.max(healthData, d=>d.poverty)+ 2])
    .range([height,0]);

var yLinearScale =d3.scaleLinear()
    .domain([20, d3.max(healthData, d => d.obesity) +2 ])
    .range([height, 0]);

var leftAxis = d3.axisLeft(yLinearScale).ticks(10);
var bottomAxis = d3.axisBottom(xLinearScale).tick(10);


//Group them in a chartgrouping
//Bottom Axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    
//Left Axis
chartGroup.append("g")
    .call(leftAxis);
