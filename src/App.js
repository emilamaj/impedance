// import { solveResistiveCircuit } from 'js-circuit-solver';
import GraphDisplay from './components/graphDisplay';
import './components/graphDisplay.css';
import FileUploader from './components/fileUploader';
import { imageStringToGrid, pixelGridToGraph } from './Utils';
import './App.css';
import { useState } from 'react';
import { solveResistiveCircuit } from 'js-circuit-solver';

const minPixelValue = 1;
const minCircuitResistance = 1;
const maxCircuitResistance = 10;

function App() {
	const [state, setState] = useState({
		imageStringB64: null,
		pixelGrid: [],
		graph: [],
		borderNodes: [],
		resultGraph: [],
		nodeCoord: [],
	});

	// This function is called when the user uploads an image. It processes the image into the 2D array of pixels 'pixelGrid'
	const handleUpload = (imageResultString) => {
		setState({
			...state,
			imageStringB64: imageResultString,
		});
	}

	// This function processes the base64-encoded image string into a 2D array of pixels
	const handleProcess = async () => {
		if (state.imageStringB64 === null) {
			return;
		}
		const pixelGrid = await imageStringToGrid(state.imageStringB64, minPixelValue);
		console.log(pixelGrid);

		setState({
			...state,
			pixelGrid: pixelGrid,
		});
	}

	// This function converts the 2D array of pixels into a circuit graph
	const handleGraphConvertion = () => {
		if (state.pixelGrid.length === 0) {
			return;
		}
		const radius = state.pixelGrid[0].length/2; // The radius of the circle is half the width of the image
		const {graph, borderNodes, nodeCoord} = pixelGridToGraph(state.pixelGrid, radius, minCircuitResistance, maxCircuitResistance);
		console.log("Graph :", graph);
		console.log("Border nodes :", borderNodes);
		console.log("Node coordinates :", nodeCoord);

		setState({
			...state,
			graph: graph,
			borderNodes: borderNodes,
			nodeCoord: nodeCoord,
		});
	}

	// This function solves the circuit and displays the in the GraphDisplay component
	const handleSolve = () => {
		if (state.graph.length === 0) {
			return;
		}
		let referenceNode = state.borderNodes[0];
		let referenceVoltage = 1;
		let middleIndex = Math.floor((state.borderNodes.length - 1)/2);
		let groundNode = state.borderNodes[middleIndex]; // Since the border nodes are in a circle, this should make the ground opposite to the reference node
		
		console.log("Reference node :", referenceNode);
		console.log("Ground node :", groundNode);

		// Solve the circuit and timing
		const start = new Date().getTime();
		const resGraph = solveResistiveCircuit(state.graph, groundNode, referenceNode, referenceVoltage);
		const end = new Date().getTime();
		console.log("Solving time :", end - start, "ms");

		// For each node of the graph, give x/y coordinates between 0 and 1, and an id equal to its index
		for (let i = 0; i < resGraph.length; i++) {
			// resGraph[i].x = Math.random();
			// resGraph[i].y = Math.random();
			resGraph[i].x = state.nodeCoord[i].x;
			resGraph[i].y = state.nodeCoord[i].y;
			resGraph[i].id = i;
		}

		console.log("Result graph :", resGraph)

		setState({
			...state,
			resultGraph: resGraph,
		});

	}

	return (
		<div className="App">
			<p className="label-title-page">Electrical Impedance Tomography</p>

			<div className="container-section">
				<div className="container-pane-left">
					<p className="label-title-pane">Parameters</p>

					<div className="container-element">
						<p className="label-element">Load resistance map (*.png)</p>
						<FileUploader handleResult={handleUpload}/>
					</div>

					<div className="container-element">
						<p className="label-element">Process image into pixel grid</p>
						<button onClick={handleProcess}>Process Image</button>
					</div>
					
					<div className="container-element">
						<p className="label-element">Process grid into circuit graph</p>
						<button onClick={handleGraphConvertion}>Convert to Graph</button>
					</div>

					<div className="container-element">
						<p className="label-element">Solve circuit</p>
						<button onClick={handleSolve}>Solve</button>
					</div>
				</div>

				<div className="container-pane-right">
					<p className="label-title-pane">View Results</p>
					<GraphDisplay graph={state.resultGraph} width={480} height={360}/>
				</div>
			</div>
		</div>
	);
}

export default App;
