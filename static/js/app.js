// define data variable
var data;

// initialize page
function init() {
  // populate dropdown 
  const dropdown = d3.select("#selDataset");

  data.names.forEach(name => {
    dropdown.append("option").text(name).property("value", name);
  });

  // get initial subject ID
  const initialSubjectID = data.names[0];

  // update all charts and demographic info based on initial subject ID
  updateDemographicInfo(initialSubjectID);
  updateBarChart(initialSubjectID);
  updateBubbleChart(initialSubjectID);
}

// update page when new sample selected 
function fetchData() {
  const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

  // use D3, fetch JSON data 
  d3.json(url)
    .then(responseData => {
      // Debugging: Log the structure of the data object
      console.log(responseData);

      // assign data to data variable
      data = responseData;

      // extract sample names
      const sampleNames = data.names;

      // create dropdown 
      const dropDown = d3.select("#selDataset");
      sampleNames.forEach(samples => {
        dropDown
          .append("option")
          .attr("value", samples)
          .text(samples);
      });

      // add event listener 
      dropDown.on("change", function () {
        const selectedSample = this.value;
        optionChanged(selectedSample);
      });

      // Init page w/ first sample
      const initialSample = sampleNames[0];
      optionChanged(initialSample);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

// changes in dropdown selection
function optionChanged(selectedData) {
  updateDemographicInfo(selectedData);
  updateBarChart(selectedData);
  updateBubbleChart(initialSubjectID);
}

// update demographic info
function updateDemographicInfo(selectedData) {
  const selectedMetadata = data.metadata.find(item => item.id == selectedData);

  // select sample-metadata div, clear content
  const metadataDiv = d3.select("#sample-metadata");
  metadataDiv.html("");

  // loop through metadata, append to div
  Object.entries(selectedMetadata).forEach(([key, value]) => {
    metadataDiv.append("p").text(`${key}: ${value}`);
  });
}

// update bar chart
function updateBarChart(selectedData) {
  const selectedSampleData = data.samples.find(item => item.id == selectedData);

  // slice top 10 values for chart
  const sampleValues = selectedSampleData.sample_values.slice(0, 10).reverse();
  const otuLabels = selectedSampleData.otu_labels.slice(0, 10).reverse();
  const otuIDs = selectedSampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

  // create bar chart trace
  const trace = {
    x: sampleValues,
    y: otuIDs,
    text: otuLabels,
    type: "bar",
    orientation: "h"
  };

  const layout = {
    title: "Top 10 OTUs",
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };

  // plot bar chart
  Plotly.newPlot("bar", [trace], layout);
}

// update bubble chart
function updateBubbleChart(selectedData) {
    const selectedSampleData = data.samples.find(item => item.id == selectedData);

  // extract data for bubble chart
  const otuIDs = selectedSampleData.otu_ids;
  const sampleValues = selectedSampleData.sample_values;
  const markerSizes = sampleValues;
  const markerColors = otuIDs;
  const textValues = selectedSampleData.otu_labels;

  // create bubble chart trace
  const trace = {
    x: otuIDs,
    y: sampleValues,
    text: textValues,
    mode: "markers",
    marker: {
      size: markerSizes,
      color: markerColors,
      colorscale: "Earth"
    }
  };

  const layout = {
    title: "Bubble Chart for Samples",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" }
  };

  // plot bubble chart
  Plotly.newPlot("bubble", [trace], layout);
}

// changes in dropdown selection
function optionChanged(selectedData) {
  updateDemographicInfo(selectedData);
  updateBarChart(selectedData);
  updateBubbleChart(selectedData);
}

// call functions to fetch data, initialize page
fetchData();