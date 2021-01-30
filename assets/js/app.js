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

var maxWidth = parseInt(d3.select("#scatter").style("width")) + margin.left + margin.right;

var svg = d3
    .select("#scatter")
    .append("svg")
    .classed("chart", true)
    .attr("width", maxWidth)  
    .attr("height", svgHeight)

//Import Data
// import the data from /data/data.csv
d3.csv("assets/data/data.csv").then((healthData) => {

    // parse the data to numeric values
    healthData.forEach(function(data) {

        // healthcare vs poverty
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        
        // smokers vs age
        data.age = +data.age;
        data.smokes = +data.smokes;

        // obesity vs household income
        data.obesity = +data.obesity;
        data.income = +data.income;

    });

    //Create the x/y linear scales, and then feed them into
    //the d3 bottom/left axes functions
    var xLinearScale = xScale(healthData, selectedXaxis);
    var yLinearScale = yScale(healthData, selectedYaxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //create the appending variables
    var xAxis = chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);

    var yAxis = chartGroup.append("g")
                .classed("y-axis", true)
                .call(leftAxis);

    
    //use the circle and text groups from old_app.js
    var scatterGroup = chartGroup.selectAll()
                .data(healthData)
                .enter()
                .append("circle")
                .attr("class", d => d.abbr)
                .attr("cx", d => xLinearScale(d[selectedXaxis]))
                .attr("cy", d => yLinearScale(d[selectedYaxis]))
                .attr("r", "11.5")
                .attr("fill", "#f57e42")
                .attr("opacity", ".85")