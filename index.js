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