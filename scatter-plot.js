import * as d3 from 'https://unpkg.com/d3?module';

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(data => createPlot(data));


function createPlot(data){

    console.log(data[0])
    const width = 920;
    const height = 630;

    const svg = d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);


    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d["Year"]), d3.max(data, d => d["Year"])])
                     .range([20, width]);

    const yScale = d3.scalePoint()
                     .domain(data.map(d => d["Time"]))
                     .range([0, 600]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);


    yAxis.tickValues(yScale.domain().filter((d, i) => i % 2 == 0));

    svg.append("g")
       .call(xAxis);

    svg.append("g")
       .attr("transform", "translate(40, 20)")
       .call(yAxis);

}
