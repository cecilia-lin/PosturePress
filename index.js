import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Constants for dimensions
const width = window.innerWidth / 2;
const height = window.innerHeight / 2;
const gridWidth = 64;  // Change grid size to fit data later 
const gridHeight = 32;

// Variables to hold data
var data_left = null;
var data_right = null;
var sleep_back = null;
var jsonData = null; // Declare jsonData globally

/**
 * Function to create a contour map using D3
 * @param {string} svgId - The ID of the SVG element
 * @param {Array} data - The data to be visualized
 * @param {function} colorScale - The color scale function
 */
function createContourMap(svgId, data, colorScale) {
  const svg = d3.select(svgId)
    .attr("preserveAspectRatio", "xMinYMin meet");

  // Create or select a persistent group for the zoomable content
  let g = svg.select("g.zoom-container");
  if (g.empty()) {
    g = svg.append("g").attr("class", "zoom-container");
  }

  // Create tooltip element
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("pointer-events", "none");

  // Render function that updates the group contents without removing the group itself
  function render() {
    const bbox = svg.node().getBoundingClientRect(); // Get actual size
    const width = bbox.width;
    const height = bbox.height;
    
    // Clear only the contents of the zoom container
    g.selectAll("*").remove();

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

    // Draw the contours within the group
    g.append("g")
      .attr("stroke", "black")
      .selectAll("path")
      .data(contours)
      .join("path")
      .attr("d", path)
      .attr("fill", d => color(d.value))
      .attr("stroke-width", 0.2)
      .on("mouseover", function(event, d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip.html("Pressure Value: " + (d.value * (dataMax - dataMin) + dataMin).toFixed(2) + " mmHg")
          .style("left", event.pageX + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  }

  // Initial render
  render();

  // Set up zoom functionality on the SVG but transform the group 'g'
  const zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom);

  // Resize observer to update if the SVG dimensions change
  const resizeObserver = new ResizeObserver(() => {
    render();
  });
  resizeObserver.observe(svg.node());

  // Return the zoom object for resetting zoom later
  return zoom;
}

/**
 * Function to handle input changes on the weight and height
 */
function handleInputChange() {
  const weight = document.getElementById('weight-number').value;
  const height = document.getElementById('height-number').value;

  // Finding the closest data point in the JSON data
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
    updateCharts(jsonData, closestDataPoint[0]);
  }
  console.log(data_left);
  console.log(data_right);
  console.log(sleep_back);
}

/**
 * Function to update charts based on the selected subject
 * @param {Object} jsonData - The JSON data
 * @param {string} subjectKey - The key of the selected subject
 */
function updateCharts(jsonData, subjectKey) {
  const subject = jsonData[subjectKey];
  createContourMap("#left", subject.Left, d3.interpolateWarm);
  createContourMap("#supine", subject.Supine, d3.interpolateWarm);
  createContourMap("#right", subject.Right, d3.interpolateWarm);
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
  fetch("data/experiment1_data.json")
    .then(response => response.json())
    .then(data => {
      jsonData = data; // Assign fetched data to global jsonData
      updateCharts(jsonData, "S1");
      
      // Add event listeners to input fields for dynamic updates
      document.getElementById('weight-number').addEventListener('input', handleInputChange);
      document.getElementById('height-number').addEventListener('input', handleInputChange);

      // Add event listener to reset button
      document.querySelector('.reset').addEventListener('click', () => {
        // Reset the input values to their original numbers
        document.getElementById('weight-number').value = 120;
        document.getElementById('height-number').value = 160;
        // Reset the contour map to the default subject key "S1"
        updateCharts(jsonData, "S1");

        // Reset the zoom transform on the SVG elements and clear history content
        const svgLeft = d3.select("#left");
        const svgSupine = d3.select("#suspine");
        const svgRight = d3.select("#right");

        svgLeft.call(d3.zoom().transform, d3.zoomIdentity);
        svgSupine.call(d3.zoom().transform, d3.zoomIdentity);
        svgRight.call(d3.zoom().transform, d3.zoomIdentity);

        // Clear the history content and update the position immediately
        svgLeft.select("g.zoom-container").selectAll("*").remove();
        svgSupine.select("g.zoom-container").selectAll("*").remove();
        svgRight.select("g.zoom-container").selectAll("*").remove();

        // Re-render the plots to update the view
        createContourMap("#left", jsonData["S1"].Left, d3.interpolateWarm);
        createContourMap("#supine", jsonData["S1"].Supine, d3.interpolateWarm);
        createContourMap("#right", jsonData["S1"].Right, d3.interpolateWarm);
      });
    });
});

// Add event listeners to input fields
document.getElementById('weight-number').addEventListener('input', handleInputChange);
document.getElementById('height-number').addEventListener('input', handleInputChange);

// TODO: Place Ash's pressure code here later






