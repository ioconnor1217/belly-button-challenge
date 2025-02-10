// Define the URL for the samples.json
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Fetch the JSON data and initialize the dashboard
d3.json(url).then(data => {
  // Populate the dropdown menu
  const dropdown = d3.select("#selDataset");
  data.names.forEach(name => {
    dropdown.append("option").text(name).property("value", name);
  });

  // Initialize the dashboard with the first sample
  const firstSample = data.names[0];
  updateDashboard(firstSample, data);
});

// Function to update the dashboard
function updateDashboard(sampleId, data) {
  // Get the metadata and sample data for the selected ID
  const metadata = data.metadata.find(meta => meta.id == sampleId);
  const sampleData = data.samples.find(sample => sample.id == sampleId);

  // Update Demographic Info
  const metadataPanel = d3.select("#sample-metadata");
  metadataPanel.html(""); // Clear existing metadata
  Object.entries(metadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key.toUpperCase()}: ${value}`);
  });

  // Update Bar Chart
  const barData = [{
    x: sampleData.sample_values.slice(0, 10).reverse(),
    y: sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
    text: sampleData.otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h"
  }];
  Plotly.newPlot("bar", barData, { title: "Top 10 OTUs Found" });

  // Update Bubble Chart
  const bubbleData = [{
    x: sampleData.otu_ids,
    y: sampleData.sample_values,
    text: sampleData.otu_labels,
    mode: "markers",
    marker: {
      size: sampleData.sample_values,
      color: sampleData.otu_ids,
      colorscale: "Earth"
    }
  }];
  const bubbleLayout = {
    title: "OTU Distribution",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" },
    margin: { t: 30 }
  };
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
}

// Function called when dropdown selection changes
function optionChanged(newSample) {
  // Fetch the data and update the dashboard for the new sample
  d3.json(url).then(data => {
    updateDashboard(newSample, data);
  });
}