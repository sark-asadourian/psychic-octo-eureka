import { tierLabels, tierColors } from "./constants.js";
import * as d3 from "d3";
export class Histogram {
    constructor(parentElement, data, tierData) {
        this.parentElement = parentElement;
        this.data = data;
        this.tierData = tierData;
        this.initVis();
    }
    initVis() {
        let vis = this;
        // Set up SVG dimensions and margins
        vis.margin = { top: 10, right: 10, bottom: 35, left: 80 };
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;
        vis.svg = d3.select("." + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
        // Create the tooltip
        vis.tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        vis.color = d3.scaleOrdinal()
            .domain(tierLabels)
            .range(tierColors);
        vis.x = d3.scaleBand()
            .domain(tierLabels)
            .range([0, vis.width])
            .padding(0.2);
        vis.y = d3.scaleLinear()
            .domain([0, d3.max(Array.from(vis.tierData.values()), d => d.length) ?? 0])
            .range([vis.height, 0]);
        vis.xAxis = d3.axisBottom(vis.x);
        vis.yAxis = d3.axisLeft(vis.y);
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis);
        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .call(vis.yAxis);
        vis.bars = vis.svg.selectAll("rect")
            .data(tierLabels)
            .enter()
            .append("rect")
            .attr("x", (d) => vis.x(d))
            .attr("y", (d) => vis.y(vis.tierData.get(d)?.length ?? 0))
            .attr("width", vis.x.bandwidth())
            .attr("height", (d) => vis.height - vis.y(vis.tierData.get(d)?.length ?? 0))
            .attr("fill", (d) => vis.color(d))
            .on("mouseover", function (event, d) {
            vis.tooltip.transition()
                .duration(200)
                .style("opacity", .9);
        })
            .on("mousemove", function (event, d) {
            const students = vis.tierData.get(d) || [];
            const studentNames = students.map(student => student.Name).join('<br/>');
            vis.tooltip.html(studentNames)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
            .on("mouseout", function (d) {
            vis.tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    }
}
