// import { solveResistiveCircuit } from 'js-circuit-solver';
import GraphDisplay from './components/graphDisplay';
import './components/graphDisplay.css';
import FileUploader from './components/fileUploader';
import { imageStringToGrid, pixelGridToGraph } from './Utils';
import './App.css';
import { useState } from 'react';
import { solveResistiveCircuit } from 'js-circuit-solver';


function App() {
	const [state, setState] = useState({
		imageStringB64: null,
		pixelGrid: [],
		graph: [],
		borderNodes: [],
		resultGraph: [],
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
		const pixelGrid = await imageStringToGrid(state.imageStringB64);
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
		const {graph, borderNodes} = pixelGridToGraph(state.pixelGrid, radius);
		console.log("Graph :", graph);
		console.log("Border nodes :", borderNodes);

		setState({
			...state,
			graph: graph,
			borderNodes: borderNodes,
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
		const resGraph = solveResistiveCircuit(state.graph, groundNode, referenceNode, referenceVoltage, true);
		console.log(resGraph);

		setState({
			...state,
			resultGraph: resGraph,
		});

	}

	return (
		<div className="App">
			Button for uploading a PNG image
			<FileUploader handleResult={handleUpload}/>

			Button for converting the base 64 encoded image string to a 2D array of pixels
			<button onClick={handleProcess}>Process</button>

			Button for converting the 2D array of pixels to a circuit graph
			<button onClick={handleGraphConvertion}>Convert to graph</button>

			Button for solving the circuit
			<button onClick={handleSolve}>Solve</button>
			<GraphDisplay graph={state.resultGraph} width={480} height={360}/>
		</div>
	);
}

export default App;
