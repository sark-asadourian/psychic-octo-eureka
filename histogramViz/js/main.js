import { Histogram } from './histogram.js'; // adjust relative path if necessary
import * as d3 from 'd3';
let histogram;
function loadData() {
    d3.json("data/data.json")
        .then((data) => {
        if (data) {
            // Group student objects by tier
            const tierData = d3.rollup(data, v => v, // Store the array of student objects for each tier
            // Store the array of student objects for each tier
            d => d.WritingTier);
            histogram = new Histogram("mainViz", data, tierData);
        }
        else {
            console.error("Data could not be loaded or is empty.");
        }
    })
        .catch(err => console.error(err));
}
loadData();
