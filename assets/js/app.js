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
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
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


//