
var data_left = null;
var data_right = null;
var sleep_back = null;
var jsonData = null;

function createContourMap(svgId, data, colorScale) {
  const svg = d3.select(svgId)
    .attr("preserveAspectRatio", "xMinYMin meet");

  // Create or select a persistent group for the zoomable content
  let g = svg.select("g.zoom-container");
  if (g.empty()) {
    g = svg.append("g").attr("class", "zoom-container");
  }

  // Create tooltip element (remains unchanged)
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
    
    // Instead of removing all elements, clear only the contents of the zoom container
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
        tooltip.html("Pressure Value: " + (d.value * (dataMax - dataMin) + dataMin).toFixed(2))
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
    .scaleExtent([0.5, 10])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom);

  // Resize observer to update if the SVG dimensions change
  const resizeObserver = new ResizeObserver(() => {
    render();
  });
  resizeObserver.observe(svg.node());
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
    /* // data_left = closestDataPoint[1].Left;
    // data_right = closestDataPoint[1].Right;
    // sleep_back = closestDataPoint[1].Supine; */

    // felix's changes
    updateCharts(jsonData, closestDataPoint[0]);

  };
  console.log(data_left);
  console.log(data_right);
  console.log(sleep_back);
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("data/experiment1_data.json")
    .then(response => response.json())
    .then(jsonData => {


      // felix's changes
      /* const subject = jsonData["S1"]; // Change as needed
      createContourMap("#left", subject.Left, d3.interpolateWarm);
      createContourMap("#supine", subject.Supine, d3.interpolateWarm);
      createContourMap("#right", subject.Right, d3.interpolateWarm); */
      updateCharts(jsonData, "S1");
      
      // Add event listeners to input fields for dynamic updates
      document.getElementById('weight-number').addEventListener('input', () => handleInputChange(jsonData));
      document.getElementById('height-number').addEventListener('input', () => handleInputChange(jsonData));

    });
});


// // Load data
var jsonData = await d3.json("data/experiment1_data.json");
/* // console.log(jsonData);
// const width = window.innerWidth / 2;
// const height = window.innerHeight / 2;
// const gridWidth = 64;  // change grid size to fit data later 
// const gridHeight = 32; */


// felix's changes
function updateCharts(jsonData, subjectKey) {
  const subject = jsonData[subjectKey];
  createContourMap("#left", subject.Left, d3.interpolateWarm);
  createContourMap("#supine", subject.Supine, d3.interpolateWarm);
  createContourMap("#right", subject.Right, d3.interpolateWarm);
}



// Add event listeners to input fields
document.getElementById('weight-number').addEventListener('input', handleInputChange);
document.getElementById('height-number').addEventListener('input', handleInputChange);





// TODO
// place ash's pressure code here later



/* 

const width = window.innerWidth / 2;
const height = window.innerHeight / 2;
const gridWidth = 64;  // change grid size to fit data later 
const gridHeight = 32;

// Load the JSON pressure data
d3.json("data/experiment1_data.json").then((data) => {
  const pressureData = data.S1.Supine;  // Adjust this path based on your JSON structure

  const svg = d3.select("#supine")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "black");

  const g = svg.append("g");

  // Placeholder heatmap image
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
}); */


/* function createContourMap(svgId, data, colorScale) {
  const svg = d3.select(svgId)
    .attr("preserveAspectRatio", "xMinYMin meet");


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
    .style("pointer-events", "none"); // To not interfere with mouse events

  function render() {
    const bbox = svg.node().getBoundingClientRect(); // Get actual size
    const width = bbox.width;
    const height = bbox.height;
    svg.selectAll("*").remove(); // Clear previous render


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

    // Draw the contours and ensure they fit within the SVG
    svg.append("g")
      .attr("stroke", "black")
      .selectAll("path")
      .data(contours)
      .join("path")
      .attr("d", path) // Use correctly scaled projection
      .attr("fill", d => color(d.value))
      .attr("stroke-width", 0.2) // Reduce stroke width for clarity
      .on("mouseover", function(event, d) { // Mouseover event listener
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html("Pressure Value: " + (d.value * (dataMax - dataMin) + dataMin).toFixed(2)) // Show actual pressure value
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) { // Mouseout event listener
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
      
      // felix's changes
      // Add pressure readings as text elements

      // svg.selectAll("text")
      // .data(data.flat())
      // .enter()
      // .append("text")
      // .attr("x", (d, i) => (i % 32) * scaleX + scaleX / 2)
      // .attr("y", (d, i) => Math.floor(i / 32) * scaleY + scaleY / 2)
      // .attr("text-anchor", "middle")
      // .attr("alignment-baseline", "middle")
      // .attr("font-size", 8)
      // .attr("fill", "white")
      // .text(d => d.toFixed(2));
  }

  // Initial render
  render();


   
   
   
   // Zoom functionality
  const zoom = d3.zoom()
   .scaleExtent([0.5, 10]) // Define zoom range
   .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom);


  // Resize observer to update if the SVG dimensions change
  const resizeObserver = new ResizeObserver(() => {
    render();
  });
  resizeObserver.observe(svg.node());
} */






