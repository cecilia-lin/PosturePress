let jsonData = null;
var data_left = null;
var data_right = null;
var data_back = null;

function createContourMap(svgId, data, colorScale) {
  const svg = d3.select(svgId)
    .attr("preserveAspectRatio", "xMinYMin meet");

  function render() {
    const bbox = svg.node().getBoundingClientRect(); // Get actual size
    const width = bbox.width;
    const height = bbox.height;
    svg.selectAll("*").remove(); // Clear previous render

    // Define a projection that ensures contours fit inside the SVG
    const scaleX = width / 32;
    const scaleY = height / 64;
    const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

    const projection = d3.geoIdentity().scale(scale);
    const path = d3.geoPath().projection(projection);

    // Normalize data for better visualization
    const dataMin = d3.min(data.flat());
    const dataMax = d3.max(data.flat());
    const normalizedData = data.map(row =>
      row.map(v => (v - dataMin) / Math.max(dataMax - dataMin, 1e-6))
    );

    // Generate contour data
    const contours = d3.contours()
      .size([32, 64])
      .thresholds(d3.range(0, 1.05, 0.025)) // Higher resolution
      (normalizedData.flat());

    // Define a color scale for the contour map
    const color = d3.scaleSequential(colorScale).domain([0, 1]);

    // Draw the contours and ensure they fit within the SVG
    svg.append("g")
      .attr("stroke", "black")
      .selectAll("path")
      .data(contours)
      .join("path")
      .attr("d", path) // Use correctly scaled projection
      .attr("fill", d => color(d.value))
      .attr("stroke-width", 0.2); // Reduce stroke width for clarity
  }

  // Initial render
  render();

  // Resize observer to update if the SVG dimensions change
  const resizeObserver = new ResizeObserver(() => {
    render();
  });
  resizeObserver.observe(svg.node());
}

function rendermap() {
  createContourMap("#left", data_left, d3.interpolateWarm);
  createContourMap("#supine", data_back, d3.interpolateWarm);
  createContourMap("#right", data_right, d3.interpolateWarm);
}

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
    data_back = closestDataPoint[1].Supine;

    rendermap();
  };
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("data/experiment1_data.json")
    .then(response => response.json())
    .then(data => {
      jsonData = data;
      handleInputChange();
      rendermap();
    });
});

// Add event listeners to input fields
document.getElementById('weight-number').addEventListener('input', handleInputChange);
document.getElementById('height-number').addEventListener('input', handleInputChange);







// const width = window.innerWidth / 2;
// const height = window.innerHeight / 2;
// const gridWidth = 64;  // change grid size to fit data later 
// const gridHeight = 32;


// // Placeholder pressure data -- still trying to figure out how to transfer the actual data
// const pressureData = Array.from({ length: gridHeight }, () =>
//   Array.from({ length: gridWidth }, () => Math.random() * 100)
// );

// const svg = d3.select("body")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height)
//   .style("background", "black");

// const g = svg.append("g");

// // placeholder heatmap image
// const image = g.append("image")
//   .attr("xlink:href", "imgs/heatmap.png")
//   .attr("x", 0)
//   .attr("y", 0)
//   .attr("width", width)
//   .attr("height", height);

// Tooltip
// const tooltip = d3.select("body")
//   .append("div")
//   .style("position", "absolute")
//   .style("background", "rgba(255, 255, 255, 0.8)")
//   .style("padding", "5px")
//   .style("border-radius", "5px")
//   .style("display", "none")
//   .style("font-size", "14px");

// // Function to get pressure value from grid
// function getPressure(x, y) {
//   const col = Math.floor((x / width) * gridWidth);
//   const row = Math.floor((y / height) * gridHeight);
//   return pressureData[row]?.[col] ? pressureData[row][col].toFixed(2) : "N/A";
// }

// // Mouse interaction
// svg.on("mousemove", (event) => {
//   const [x, y] = d3.pointer(event);
//   const pressure = getPressure(x, y);

//   tooltip.style("left", `${event.pageX + 10}px`)
//     .style("top", `${event.pageY + 10}px`)
//     .style("display", "block")
//     .html(`Pressure: ${pressure}`);
// });

// svg.call(zoom);








