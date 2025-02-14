// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
var jsonData = JSON.parse('experiment1_data.json');








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
