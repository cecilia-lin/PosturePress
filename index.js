document.addEventListener("DOMContentLoaded", function () {
  fetch("data/experiment1_data.json")
      .then(response => response.json())
      .then(jsonData => {
          const subject = jsonData["S1"]; // Change as needed
          createContourMap("#left", subject.Left, d3.interpolateWarm);
          createContourMap("#supine", subject.Supine, d3.interpolateWarm);
          createContourMap("#right", subject.Right, d3.interpolateWarm);
      })
      .catch(error => console.error("Error loading JSON:", error));
});

// Function to create a responsive contour map
function createContourMap(svgId, data, colorScale) {
  const svg = d3.select(svgId)
      .attr("viewBox", `0 0 32 64`) // Maintain aspect ratio
      .attr("preserveAspectRatio", "xMidYMid meet"); // Ensures it scales properly

  function render() {
      const bounds = svg.node().getBoundingClientRect();
      const width = bounds.width/3;
      const height = bounds.height;

      svg.selectAll("*").remove(); // Clear previous contours

      const xScale = d3.scaleLinear().domain([0, 32]).range([0, width]);
      const yScale = d3.scaleLinear().domain([0, 64]).range([height, 0]);

      const contourData = d3.contours()
          .size([32, 64])
          .thresholds(10)
          (data.flat());

      const color = d3.scaleSequential(colorScale).domain(d3.extent(data.flat()));

      svg.selectAll("path")
          .data(contourData)
          .enter().append("path")
          .attr("d", d3.geoPath(d3.geoIdentity().scale(width / 32)))
          .attr("fill", d => color(d.value))
          .attr("stroke", "black");
  }

  // Run initially
  render();

  // Re-render on resize
  const resizeObserver = new ResizeObserver(render);
  resizeObserver.observe(svg.node());
}





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

// // Tooltip
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

// svg.on("mouseleave", () => {
//   tooltip.style("display", "none");
// });

// // Zoom functionality
// const zoom = d3.zoom()
//   .scaleExtent([0.5, 5])
//   .on("zoom", (event) => {
//     g.attr("transform", event.transform);
//   });

// svg.call(zoom);
