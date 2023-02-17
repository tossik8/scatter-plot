const width = 920;
const height = 570;
let margins = {top: 40, right: 70, bottom: 40, left: 70};


fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then(response => response.json())
    .then(data => createPlot(data));

function adjustZoom(){
  if(document.documentElement.clientWidth < 500){
    document.body.style.zoom = "40%";
  }
  else if(document.documentElement.clientWidth < 800){
    document.body.style.zoom = "60%";
  }
  else if(document.documentElement.clientWidth < 1000){
    document.body.style.zoom = "80%";
  }
  else {
    document.body.style.zoom = "100%";
  }
}

window.onload = () => {
  adjustZoom();
}
window.onresize = () => {
  adjustZoom();
}


function createTooltip(data){
  const circles = document.getElementsByClassName("dot");
  for(let i = 0; i < circles.length; ++i){
    circles[i].addEventListener("mouseover", () =>  {
      let rect= circles[i].getBoundingClientRect();
      document.getElementById("contestant").textContent = data[i]["Name"] + ": " + data[i]["Nationality"];
      document.getElementById("time").textContent = "Year: " + data[i]["Year"] + ", Time: " + data[i]["Time"];
      document.getElementById("tooltip").setAttribute("data-year", data[i]["Year"]);
      if(data[i]["Doping"] !== ""){
        document.getElementById("time").style.marginBottom = 5 + "px";
        document.getElementById("description").textContent = data[i]["Doping"];
      }
      document.getElementById("tooltip").classList.remove("invisible");
      document.getElementById("tooltip").classList.add("visible");
      document.getElementById("tooltip").style.left = rect.left + 20 + "px";
      document.getElementById("tooltip").style.top = rect.top - 20 + "px";
    });

    circles[i].addEventListener("mouseleave", () => {
      document.getElementById("tooltip").classList.remove("visible");
      document.getElementById("tooltip").classList.add("invisible");
      document.getElementById("description").textContent = "";
      document.getElementById("time").style.marginBottom = 0 + "px";
    });

  }
}
function createPlot(data){


    const svg = d3.select(".panel")
      .append("svg")
      .attr("width", width)
      .attr("height", height);


    const xScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d["Year"]) - 1, d3.max(data, d => d["Year"]) + 1])
                     .range([margins.left, width - margins.right]);

    const yScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d["Seconds"]))
                     .range([margins.top, height - margins.bottom]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(formatTick);

    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", `translate(0, ${height - margins.bottom})`)
       .call(xAxis);

    svg.append("g")
       .attr("id", "y-axis")
       .attr("transform", `translate(${margins.left}, 0)`)
       .call(yAxis);

    svg.append("text")
       .attr("x", margins.left)
       .attr("y", height/2.6)
       .style("transform-origin", margins.left/3 + "px " + height/2.6 + "px")
       .style("transform", "rotate(-90deg)")
       .attr("class", "y-label")
       .text("Time in Minutes");

    svg.selectAll("cirlce")
       .data(data)
       .enter()
       .append("circle")
       .transition()
       .duration(1000)
       .attr("cx", d => xScale(d["Year"]))
       .attr("cy", d => yScale(d["Seconds"]))
       .attr("r", 7)
       .attr("class", d => d["URL"] === ""? "dot no-doping" : "dot doping")
       .attr("data-xvalue", d => d["Year"])
       .attr("data-yvalue", d => new Date(d["Year"] + "-12-31T23:" + d["Time"]));


    const legend = svg.append("g")
       .attr("id", "legend")
       .attr("transform", `translate(${width - margins.left}, ${height/2})`);

    legend.append("rect")
       .attr("class", "no-doping")
       .attr("width", 20)
       .attr("height", 20);

    legend.append("rect")
          .attr("class", "doping")
          .attr("width", 20)
          .attr("height", 20)
          .attr("y", 25);


    legend.append("text")
          .text("No doping allegations")
          .attr("x", -110)
          .attr("y", 15)
          .attr("class", "legend-text");

    legend.append("text")
          .text("Riders with doping allegations")
          .attr("x", -152)
          .attr("y", 40)
          .attr("class", "legend-text");

    createTooltip(data);
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
