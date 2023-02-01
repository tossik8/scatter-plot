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
                     .domain(d3.extent(data, d => d["Year"]))
                     .range([20, width]);

    const yScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d["Seconds"]), d3.max(data, d => d["Seconds"])])
                     .range([0, 600]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(formatTick);

    svg.append("g")
       .call(xAxis);

    svg.append("g")
       .attr("transform", "translate(40, 20)")
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
