import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Load data
const jsonData = await d3.json("data/experiment1_data.json");
console.log(jsonData);
const width = window.innerWidth / 2;
const height = window.innerHeight / 2;
const gridWidth = 64;  // change grid size to fit data later 
const gridHeight = 32;

var data_left = null;
var data_right = null;
var sleep_back = null;


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

// Add event listeners to input fields
document.getElementById('weight-number').addEventListener('input', handleInputChange);
document.getElementById('height-number').addEventListener('input', handleInputChange);



// Function to handle input changes on the weight and height
function handleInputChange() {
  const weight = document.getElementById('weight-number').value;
  const height = document.getElementById('height-number').value;

  // finding the closest data point in the JSON data
  // update the pressureData array with the new data_left, data_right, and sleep_back values
  
  let closestDataPoint = null;
  let minDistance = Infinity;

  for (const [key, value] of Object.entries(jsonData)) {
    const float_weight = parseFloat(value.weight);
    const float_height = parseFloat(value.height);
    const distance = Math.sqrt((float_weight - weight) ** 2 + (float_height - height) ** 2);

    if (distance < minDistance) {
      minDistance = distance;
      closestDataPoint = [key, value];
    }

  }

  if (closestDataPoint) {
    data_left = closestDataPoint[1].Left;
    data_right = closestDataPoint[1].Right;
    sleep_back = closestDataPoint[1].Supine;
  }
}