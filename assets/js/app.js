//The initial app kept throwing unresolvable errors, so I have chosen a second 
//path to coding


//Set-up Canvas
var svgWidth = 1000; //window.innerWidth;
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


var selectedXaxis = "poverty";
var selectedYaxis = "obesity";

var chartGroup = svg.append("g")
    // .classed("chart", true)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

console.log(parseInt(d3.select("svg").style("width")));

//Import Data & do the stuff!
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
    console.log(healthData);

    // create scales for the chart
    // call function xScale 
    var xLinearScale = xScale(healthData, selectedXaxis);
    
    // create y scale function
    var yLinearScale = yScale(healthData, selectedYaxis);

    // create the axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append the axes
    // append x axis
    var xAxis = chartGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", `translate(0, ${height})`)
                .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
                .classed("y-axis", true)
                .call(leftAxis);
    
    // add the dots and text
    var scatterGroup = chartGroup.selectAll()
                .data(healthData)
                .enter()
                .append("circle")
                .attr("class", d => d.abbr)
                .attr("cx", d => xLinearScale(d[selectedXaxis]))
                .attr("cy", d => yLinearScale(d[selectedYaxis]))
                .attr("r", "11.5")
                .attr("fill", function(d){
                    return "#3F2CAF"})//"#f57e42") // fill color for cirlces
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

    // append tooltip div
    var scatterGroup, scatterText = updateToolTip(selectedXaxis, selectedYaxis, scatterGroup, scatterText);
    // var scatterText = updateToolTip(selectedXaxis, selectedYaxis, scatterText);

    // create axes labels
    // create group for x-axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("class", "x-labels")
        .attr("transform", `translate(${width / 2}, ${height+15})`);

    var xPovertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .attr("class", "active")
        .text("Below Poverty Line (%)");

    var xAgeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .attr("class", "inactive")
        .text("Age (Median)");
    
    var xIncomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .attr("class", "inactive")
        .text("Household Income (Median)");

    var yLabelsGroup = chartGroup.append("g")
        .attr("class", "y-labels")
        .attr("transform", "rotate(-90)")

    var yObesityLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "active")
        .attr("value","obesity")
        .text("Obesity (%)");
    
    var yHealthLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "inactive")
        .attr("value", "healthcare")
        .text("Inadequate Healthcare (%)");
    
    var ySmokesLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "inactive")
        .attr("value","smokes")
        .text("Smokers (%)");
    
   

    // attach event listener to axes labels
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            // get selected value
            var value = d3.select(this).attr("value");
            if (value !== selectedXaxis) {
                selectedXaxis = value;

                // update x axis scale
                xLinearScale = xScale(healthData, selectedXaxis);
                xAxis = drawXaxis(xLinearScale, xAxis);

                // update circles with new x values and texts
                scatterGroup = drawScatter(scatterGroup, xLinearScale, selectedXaxis, yLinearScale, selectedYaxis);
                scatterText = createTexts(scatterText, xLinearScale, selectedXaxis, yLinearScale, selectedYaxis);

                // update tooltip
                scatterGroup, scatterText = updateToolTip(selectedXaxis, selectedYaxis, scatterGroup, scatterText);
                // scatterText = updateToolTip(selectedXaxis, selectedYaxis, scatterText);

                // change classes to bold text
                switch (selectedXaxis) {
                    case "poverty":
                        xPovertyLabel.classed("active", true).classed("inactive", false);
                        xAgeLabel.classed("inactive", true);
                        xIncomeLabel.classed("inactive", true);
                        break;
                    case "age":
                        xAgeLabel.classed("active", true).classed("inactive", false);
                        xPovertyLabel.classed("inactive", true);
                        xIncomeLabel.classed("inactive", true);
                        break;
                    case "income":
                        xIncomeLabel.classed("active", true).classed("inactive", false);
                        xAgeLabel.classed("inactive", true);
                        xPovertyLabel.classed("inactive", true);
                        break;
                }
            }
        }
        )  // on-click event
    
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            // update y axis scale
            var value = d3.select(this).attr("value");
            if (value !== selectedYaxis) {
                selectedYaxis = value;

                yLinearScale = yScale(healthData, selectedYaxis);
                yAxis = drawYaxis(yLinearScale, yAxis);

                // update circles with new x values and texts
                scatterGroup = drawScatter(scatterGroup, xLinearScale, selectedXaxis, yLinearScale, selectedYaxis);
                scatterText = createTexts(scatterText, xLinearScale, selectedXaxis, yLinearScale, selectedYaxis);

                // update tooltip
                scatterGroup, scatterText = updateToolTip(selectedXaxis, selectedYaxis, scatterGroup, scatterText);


                // change classes to bold text
                switch (selectedYaxis) {
                    case "healthcare":
                        yObesityLabel.classed("active", true).classed("inactive", false);
                        ySmokesLabel.classed("inactive", true);
                        yHealthLabel.classed("inactive", true);
                        break;
                    case "smokes":
                        ySmokesLabel.classed("active", true).classed("inactive", false);
                        yHealthLabel.classed("inactive", true);
                        yObesityLabel.classed("inactive", true);
                        break;
                    case "obesity":
                        yObesityLabel.classed("active", true).classed("inactive", false);
                        ySmokesLabel.classed("inactive", true);
                        yHealthLabel.classed("inactive", true);
                        break;
                }
            }
            
        });    

}).catch(function(error) {
    console.log(error);
});

// Update x/y scale variables
function xScale(censusData, selectedXaxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
                        .domain([d3.min(censusData, d => d[selectedXaxis]) * 0.9, d3.max(censusData, d => d[selectedXaxis]) * 1.1])
                        .range([0, width]);
    return xLinearScale;
};

function yScale(censusData, selectedYaxis) {
    var yLinearScale = d3.scaleLinear()
                        .domain([d3.min(censusData, d => d[selectedYaxis]) * 0.7, d3.max(censusData, d => d[selectedYaxis]) * 1.1])
                        .range([height, 0]);
    return yLinearScale;
};

// Redraw x/y axes
function drawXaxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
};

function drawYaxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
};


// Draw scatter plot, and create text labels
function drawScatter(scatterGroup, newXScale, selectedXaxis, newYScale, selectedYaxis) {
    scatterGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[selectedXaxis]))
        .attr("cy", d => newYScale(d[selectedYaxis]));
    return scatterGroup;
};

// function to render text in circles
function createText(scatterText, newXScale, selectedXaxis, newYScale, selectedYaxis) {
    scatterText.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[selectedXaxis]))
        .attr("y", d => newYScale(d[selectedYaxis]));
    
    return scatterText;
};

function updateToolTip(selectedXaxis, selectedYaxis, xGroup, yGroup) {
    var xLabel;
    var yLabel;

    if (selectedXaxis === "poverty") {xLabel = "Poverty (%): "}
    else if (selectedXaxis === "age") {xLabel = "Age: "}
    else if (selectedXaxis === "income") {xLabel = "Income: ";};

    if (selectedYaxis === "healthcare") {yLabel = "Healthcare (%): "}
    else if (selectedYaxis === "smokes") {yLabel = "Smokes (%): "}
    else if (selectedYaxis === "obesity") {yLabel = "Obesity (%): "};
    
    var toolTip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return `<div> ${d.state} <br> 
                ${xLabel} ${d[selectedXaxis].toLocaleString()} <br> 
                ${yLabel} ${d[selectedYaxis]} </div>`; 
    });

    xGroup.call(toolTip);
    yGroup.call(toolTip);

    // create mouseover and mouseout
    xGroup.on("mouseover", function (d) {
        d3.select(this).style("stroke", "black");
        toolTip.show(d, this);})
        .on("mouseout", function (d){ 
            d3.select(this).style("stroke", "white")
            toolTip.hide(d, this)});
    yGroup.on("mouseover", function (d) {toolTip.show(d, this);})
        .on("mouseout", function (d){ toolTip.hide(d, this)});

    return xGroup, yGroup;

};