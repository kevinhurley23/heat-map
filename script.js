document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data.monthlyVariance;

      const totalYears =
        d3.max(dataset, (d) => d.year) - d3.min(dataset, (d) => d.year);

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const colors = [
        "#6e2cdf",
        "#344dd6",
        "#2588da",
        "#26C6DA",
        "#1cc674",
        "#aae824",
        "#f1dd2f",
        "#FFA726",
        "#f55c31",
        "#f91111",
      ];

      dataset.forEach((d) => {
        const index = d.month - 1;
        d.month = months[index];
      });

      const w = 1200; //width
      const h = 600; //height
      const ptr = 20; //padding top and right
      const pbl = 80; // padding bottom and left

      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(dataset, (d) => d.year))
        .range([pbl, w - ptr]);

      const yScale = d3
        .scaleBand()
        .domain(months)
        .range([ptr, h - pbl]);

      const colorScale = d3
        .scaleQuantize()
        .domain(d3.extent(dataset, (d) => d.variance))
        .range(colors);

      const svg = d3
        .select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(".4"));
      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${h - pbl})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${pbl})`)
        .call(yAxis);

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

      svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("width", (w - ptr - pbl) / totalYears)
        .attr("height", (h - ptr - pbl) / 12)
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale(d.month))
        .attr("fill", (d) => colorScale(d.variance))
        .attr("id", (d, i) => i)
        .attr("class", "cell")
        .attr("data-month", (d) => d.month)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => d.variance + 8.66)
        .on("mouseover", (e) => {
          const i = e.target.getAttribute("id");
          const temp = (dataset[i].variance + 8.66).toFixed(2);
          const text = `${dataset[i].month} ${dataset[i].year}<br>${temp}℃<br>${
            dataset[i].variance > 0 ? "+" : ""
          }${dataset[i].variance.toFixed(2)}℃`;
          tooltip
            .style("opacity", 0.9)
            .style("left", e.pageX - 50 + "px")
            .style("top", e.pageY - 100 + "px")
            .html(text)
            .attr("data-year", () => e.target.getAttribute("data-year"));
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0).style("left", 0).style("top", 0);
        });

      const legend = svg
        .append("g")
        .attr("id", "legend")
        .attr("transform", `translate(20, ${h - 40})`);

      legend
        .selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", (d, i) => i * 120)
        .attr("y", 0)
        .attr("fill", (d) => d);

      legend
        .selectAll("text")
        .data(colors)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 120)
        .attr("y", 40)
        .text((d) => {
          const tempRange = colorScale.invertExtent(d);
          return `${tempRange[0].toFixed(1)}℃
          \u00A0-\u00A0 ${tempRange[1].toFixed(1)}℃`;
        });
    });
});
