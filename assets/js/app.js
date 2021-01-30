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

        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.smokes = +data.smokes;
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

    var scatterText = chartGroup.selectAll()
                .data(healthData)
                .enter()
                .append("text")
                .text(d => d.abbr)
                .attr("x", d => xLinearScale(d[selectedXaxis]))
                .attr("y", d => yLinearScale(d[selectedYaxis]))
                .style("font-size", "10px")
                .attr("font-weight", 600)
                .attr("text-anchor", "middle")
                .style('fill', 'black')
                .attr("stroke", "white")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0.25)


    //Create the required axes labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("class", "x-labels")
        .attr("transform", `translate(${width / 2}, ${height + 15})`);

    var yLabelsGroup = chartGroup.append("g")
        .attr("class", "y-labels")
        .attr("transform", "rotate(-90)")

    var xPovertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 15) //this attribute is how you order the list, the +15 sets the space from the bottom of the graph
        .attr("value", "poverty") // Listener Event Tag
        .attr("class", "active")
        .text("Below Poverty Line (%)");

    var yObesityLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height/2)) // list order placement
        .attr("dy", "1em")
        .attr("class", "active")
        .attr("value","obesity") // Listener Event tag
        .text("Obesity (%)");

    var ySmokesLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "inactive")
        .attr("value","smokes")
        .text("Smokers (%)");

    var xAgeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // Listener event tag
        .attr("class", "inactive")
        .text("Age (Median)");
    
    var xIncomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .attr("class", "inactive")
        .text("Household Income (Median)");

    var yHealthLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "inactive")
        .attr("value", "healthcare")
        .text("Inadequate Healthcare (%)");