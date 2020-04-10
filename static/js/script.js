window.addEventListener("load", (event) => {
  /******************************************************************************
   * Drawing Canvas
   ******************************************************************************/
  // Get HTML Canvas
  const canvas = document.querySelector("canvas");
  // Set Width and Height of Canvas
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  // Get Canvas Context
  const context = canvas.getContext("2d");
  // Set Canvas Context properties
  context.lineWidth = 10;
  context.lineCap = "round";
  context.strokeStyle = "#FFF";
  // Mouse down event listener
  canvas.addEventListener("mousedown", (event) => {
    // Begin path
    context.beginPath();
    context.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    // Mouse move even when mouse is down
    canvas.onmousemove = (event) => {
      // Draw line
      context.lineTo(event.clientX - rect.left, event.clientY - rect.top);
      context.stroke();
    }
  });
  // Mouse up and Mouse out listener
  ["mouseup", "mouseout"].forEach(event => {
    canvas.addEventListener(event, (event) => {
      // End path
      context.closePath();
      canvas.onmousemove = null;
    })
  });

  /******************************************************************************
   * AmCharts4 Predictions Chart
   ******************************************************************************/
  am4core.ready(function() {
    am4core.useTheme(am4themes_animated);
    // Create chart instance
    const chart = am4core.create("chartdiv", am4charts.XYChart);
    // Add data
    const data = [...Array(10).keys()];
    data.forEach((n, i, array) => {
      array[i] = { "number": n.toString(), "likelihood": 0 };
    });
    chart.data = data;
    // Create chart title
    const title = chart.titles.create();
    title.text = "Prediction";
    title.fontSize = 25;
    title.marginBottom = 30;
    // Create X axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "number";
    categoryAxis.title.text = "Number";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 30;
    // Create Y axes
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Likelihood";
    valueAxis.min = 0;
    valueAxis.max = 1;
    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "likelihood";
    series.dataFields.categoryX = "number";
    series.columns.template.fillOpacity = .8;
    // Column Styles
    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    /******************************************************************************
     * Prediction API Call
     ******************************************************************************/
    // Get HTML button
    const button = document.querySelector("button");
    button.onclick = (event) => {
      // Get prediction
      fetch(`${window.origin}/predict`, {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json"
        }),
        body: JSON.stringify({ image: canvas.toDataURL() })
      })
      .then(response => response.json())
      .then(data => {
        // Update bar chart showing predictions
        for (let i = 0; i < chart.data.length; i++) {
          chart.data[i]["likelihood"] = data.predictions[i];
        }
        chart.invalidateRawData();
      });
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
})
