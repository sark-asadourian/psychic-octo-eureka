import { Histogram } from './histogram.js'; // adjust relative path if necessary
import { initializeApp } from 'firebase/app';
import * as d3 from 'd3';

let histogram: Histogram;

function loadData() {
    d3.json<Array<{ WritingTier: string, Name: string }>>("data/data.json")
        .then((data) => {


            if (data) {
                // Group student objects by tier
                const tierData = d3.rollup(
                    data,
                    v => v, // Store the array of student objects for each tier
                    d => d.WritingTier
                );

                histogram = new Histogram("mainViz", data, tierData);

            } else {
                console.error("Data could not be loaded or is empty.");
            }

        })
        .catch(err => console.error(err));
}

loadData();