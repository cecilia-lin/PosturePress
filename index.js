import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
var jsonData = JSON.parse('experiment1_data.json');

// Function to create a contour map
function createContourMap(svgId, data, color) {
  const svg = d3.select(svgId);
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  // Create scales
  const xScale = d3.scaleLinear()
      .domain([0, 300])
      .range([0, width]);

  const yScale = d3.scaleLinear()
      .domain([0, 300])
      .range([height, 0]);

  // Create contours
  const contourData = d3.contours()
      .size([width, height])
      .thresholds(5)
      (data.map(d => d.value));

  // Color scale
  const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, d => d.value)]);

  // Draw contours
  svg.selectAll("path")
      .data(contourData)
      .enter().append("path")
      .attr("d", d3.geoPath())
      .attr("fill", d => colorScale(d.value))
      .attr("stroke", "black");
}

const left = jsonData.S1.Left
const supine = jsonData.S1.Supine
const right = jsonData.S1.Right

// Create three contour maps with different colors
createContourMap("#left", left, "blue");
createContourMap("#supine", supine, "red");
createContourMap("#right", right, "green");






const width = window.innerWidth / 2;
const height = window.innerHeight / 2;
const gridWidth = 64;  // change grid size to fit data later 
const gridHeight = 32;


// Placeholder pressure data -- still trying to figure out how to transfer the actual data
const pressureData = Array.from({ length: gridHeight }, () =>
  Array.from({ length: gridWidth }, () => Math.random() * 100)
);

const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "black");

const g = svg.append("g");

// placeholder heatmap image
const image = g.append("image")
  .attr("xlink:href", "imgs/heatmap.png")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width)
  .attr("height", height);

// Tooltip
const tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("background", "rgba(255, 255, 255, 0.8)")
  .style("padding", "5px")
  .style("border-radius", "5px")
  .style("display", "none")
  .style("font-size", "14px");

// Function to get pressure value from grid
function getPressure(x, y) {
  const col = Math.floor((x / width) * gridWidth);
  const row = Math.floor((y / height) * gridHeight);
  return pressureData[row]?.[col] ? pressureData[row][col].toFixed(2) : "N/A";
}

// Mouse interaction
svg.on("mousemove", (event) => {
  const [x, y] = d3.pointer(event);
  const pressure = getPressure(x, y);

  tooltip.style("left", `${event.pageX + 10}px`)
    .style("top", `${event.pageY + 10}px`)
    .style("display", "block")
    .html(`Pressure: ${pressure}`);
});

svg.on("mouseleave", () => {
  tooltip.style("display", "none");
});

// Zoom functionality
const zoom = d3.zoom()
  .scaleExtent([0.5, 5])
  .on("zoom", (event) => {
    g.attr("transform", event.transform);
  });

svg.call(zoom);
