function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples=data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number. 
    var result2Array=allSamples.filter(i=>i.id==sample);

    //  5. Create a variable that holds the first sample in the array.
    var result2=result2Array[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID=result2.otu_ids;
    var otuLabel=result2.otu_labels;
    var sampleValue=result2.sample_values;
    console.log(result2)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuLabel.slice(0,10).reverse();
    var yValue=otuID.map((i)=>("OTU "+i)).slice(0,10).reverse();
    var xValue=sampleValue.map((i)=>parseInt(i)).slice(0,10).reverse();
    // console.log(yticks)
    console.log(yValue)


    // 8. Create the trace for the bar chart. 
     var barData = [{
       x: xValue,
       y: yValue,
       text: yticks,
       type: "bar",
       orientation: 'h'
     }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {title:"Top 10 Bacteria Cultures Found"
     };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar",barData,barLayout);

    // Deliverable 2: Create the bubble chart.
    // 1. Create the trace for the bubble chart.
    var bubblex=otuID;
    var bubbley=sampleValue;
    var marker=sampleValue;
    var mcolor=otuID;
    var bubbleData = [{
      x: bubblex,
      y: bubbley,
      text: otuLabel,
      mode:"markers",
      marker:{
        color: mcolor,
        size: marker
      }
    }
   
    ];
    
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {title: "Bacteria Cultures Per Sample",
    xaxis: {title:"OTU ID"},
    hovermode: "closest"
   };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // Deliverable 3: Create a gauge chart
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata=data.metadata.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(metadata);

    // 3. Create a variable that holds the washing frequency.
    var wfreq=metadata.wfreq
    console.log(wfreq)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: parseInt(wfreq),
      type: "indicator",
      mode:"gauge+number",
      gauge:{
        axis: {range: [null,10], tickmode: "linear",dtick:2},
        bar: {color: "black"},
        steps: [
          {range: [0,2],color:"red"},
          {range: [2,4],color:"darkorange"},
          {range: [4,6],color:"yellow"},
          {range: [6,8],color:"lime"},
          {range: [8,10],color:"green"}
        ]
      }}
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {title: {text:"<b>Belly Button Washing Frequency</b><br>Scrubs per Week"}
  };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);



  });
}