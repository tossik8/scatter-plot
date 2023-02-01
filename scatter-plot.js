import * as d3 from 'https://unpkg.com/d3?module';

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(data => createPlot(data));


function createPlot(data){

    console.log(data)
    const width = 920;
    const height = 630;
    const margins = {top: 20, right: 20, bottom: 20, left: 40};

    const svg = d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);


    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d["Year"]) - 1, d3.max(data, d => d["Year"]) + 1])
                     .range([margins.left, width - margins.right]);

    const yScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d["Seconds"]))
                     .range([0, height - margins.bottom]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(formatTick);

    svg.append("g")
       .attr("transform", `translate(0, ${height - margins.bottom})`)
       .call(xAxis);

    svg.append("g")
       .attr("transform", `translate(${margins.left}, 0)`)
       .call(yAxis);
}
function formatTick(seconds){
  let minutes = Math.floor(seconds/60);
  let seconds2 = seconds%60;
  if(seconds2 < 9 && seconds2 > 0){
    seconds2 = "0" + seconds2;
  }
  else if(seconds2 === 0){
    seconds2 += "0";
  }
  return minutes + ":" + seconds2;
}
