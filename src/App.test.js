
import { imageStringToGrid, pixelGridToGraph } from './Utils';
import { solveResistiveCircuit } from 'js-circuit-solver';

console.log("Running tests on sample 8x8 input Grid...")


// Sample 8x8 grid
let sampleGrid = [[1,1,23,34,34,24,1,1],[1,38,36,35,35,36,39,1],[23,36,35,35,35,35,36,24],[33,35,35,35,35,35,35,34],[33,35,35,35,35,35,35,34],[24,36,35,35,35,35,36,24],[1,39,36,35,35,36,39,1],[1,1,24,34,34,24,1,1]];
console.log("Sample grid length: ", sampleGrid.length);
// Sample values
const minPixelValue = 1;
const minCircuitResistance = 0.5;
const maxCircuitResistance = 1000;

// Convert the grid to a graph
console.log("Converting sample grid to graph...")
const radius = sampleGrid[0].length/2; // The radius of the circle is half the width of the image
const {graph, borderNodes, nodeCoord} = pixelGridToGraph(sampleGrid, radius, minCircuitResistance, maxCircuitResistance);
console.log("Resulting graph length: ", graph.length);

// All node of the graph should have between 1 and 4 neighbors
let connectionMin = 4;
let connectionMax = 1;
for (let i = 0; i < graph.length; i++) {
    if (graph[i].length < connectionMin) {
        connectionMin = graph[i].length;
    }
    if (graph[i].length > connectionMax) {
        connectionMax = graph[i].length;
    }
}
test('All nodes of the graph should have between 1 and 4 neighbors', () => {
    expect(connectionMin).toBeGreaterThanOrEqual(1);
    expect(connectionMax).toBeLessThanOrEqual(4);
});

// Expected result for node 0 of graph
test('Node 0 should have 3 neighbors', () => {
    expect(graph[0][0].resistance).toBeCloseTo(29.477)
    expect(graph[0][0].to).toBe(3)
});

