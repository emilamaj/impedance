
// Allows to use React.useRef, useEffect, useState, etc.
import React from 'react';


import './graphDisplay.css';

// This component is used to display a graph, consisting of nodes and edges.
// Each node is a colored circle (voltage) and each edge is a colored line (current).
// The graph is displayed in a canvas element. 
// The props object has the following properties:
//   graph: an array of objects, each object representing a node.
//          Each object has the following properties:
//            id: a unique identifier for the node
//            x: the x coordinate of the node
//            y: the y coordinate of the node
//            voltage: the voltage of the node
//            connections: an array of objects, each object representing a connection to another node.
//                         Each object has the following properties:
//                           id: a unique identifier for the node
//                           current: the resistance of the connection
//   width: the width of the canvas element
//   height: the height of the canvas element
function GraphDisplay(props) {
	// Calculate the maximum voltage and current
	let maxVoltage = 0;
	let maxCurrent = 0;
	for (const node of props.graph) {
		if (Math.abs(node.voltage) > maxVoltage) {
			maxVoltage = Math.abs(node.voltage);
		}
		for (const connection of node.connections) {
			if (Math.abs(connection.current) > maxCurrent) {
				maxCurrent = Math.abs(connection.current);
			}
		}
	}
	// Calculate the radius of the nodes
	const nodeRadius = 0.02 * Math.min(props.width, props.height);
	// Calculate the width of the edges
	const edgeWidth = 0.005 * Math.min(props.width, props.height);

	// Calculate the position of the nodes
	// const nodePositions = {}; 
	// for (const node of props.graph) {
	// 	nodePositions[node.id] = {
	// 		x: node.x * props.width,
	// 		y: node.y * props.height
	// 	};
	// }
	const nodePositions = React.useMemo(() => {
		const _nodePositions = {};
		for (const node of props.graph) {
			_nodePositions[node.id] = {
				x: node.x * props.width,
				y: node.y * props.height
			};
		}
		return _nodePositions;
	}, [props.graph, props.width, props.height]); // Wrap the initialization in useMemo to avoid unnecessary re-renders

	// Calculate the color of the nodes
	const nodeColors = {};
	for (const node of props.graph) {
		nodeColors[node.id] = `rgb(${Math.round(255 * node.voltage / maxVoltage)}, ${Math.round(255 * (1 - Math.abs(node.voltage) / maxVoltage))}, 0)`;
	}
	// Calculate the color of the edges
	const edgeColors = {};
	for (const node of props.graph) {
		for (const connection of node.connections) {
			edgeColors[`${node.id}-${connection.id}`] = `rgb(${Math.round(255 * connection.current / maxCurrent)}, ${Math.round(255 * (1 - Math.abs(connection.current) / maxCurrent))}, 0)`;
		}
	}
	// Calculate the position of the edges
	const edgePositions = {};
	for (const node of props.graph) {
		for (const connection of node.connections) {
			edgePositions[`${node.id}-${connection.id}`] = {
				x1: nodePositions[node.id].x,
				y1: nodePositions[node.id].y,
				x2: nodePositions[connection.id].x,
				y2: nodePositions[connection.id].y
			};
		}
	}
	// Calculate the position of the text
	const textPositions = {};
	for (const node of props.graph) {
		textPositions[node.id] = {
			x: nodePositions[node.id].x + 0.5 * nodeRadius,
			y: nodePositions[node.id].y - 1.2 * nodeRadius
		};
	}

	// Get a reference to the canvas element
	const canvasRef = React.useRef(null);

	// Draw the graph
	React.useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		// Clear the canvas
		context.clearRect(0, 0, props.width, props.height);

		// Draw the grey background and the grid 
		context.beginPath();
		context.rect(0, 0, props.width, props.height);
		context.fillStyle = 'lightgrey';
		context.fill();
		context.beginPath();
		context.strokeStyle = 'grey';
		context.lineWidth = 1;
		for (let i = 0; i < props.width; i += props.width / 10) {
			context.moveTo(i, 0);
			context.lineTo(i, props.height);
		}
		for (let i = 0; i < props.height; i += props.width / 10) { // Use props.width instead of props.height to make the grid square
			context.moveTo(0, i);
			context.lineTo(props.width, i);
		}
		context.stroke();

		// Draw the edges
		for (const edge in edgePositions) {
			context.beginPath();
			context.strokeStyle = edgeColors[edge];
			context.lineWidth = edgeWidth;
			context.moveTo(edgePositions[edge].x1, edgePositions[edge].y1);
			context.lineTo(edgePositions[edge].x2, edgePositions[edge].y2);
			context.stroke();
		}
		// Draw the nodes
		for (const node in nodePositions) {
			context.beginPath();
			context.arc(nodePositions[node].x, nodePositions[node].y, nodeRadius, 0, 2 * Math.PI);
			context.fillStyle = nodeColors[node];
			context.fill();
		}
		// Draw the text
		context.font = '15px Arial';
		context.fillStyle = 'black';
		context.shadowColor = 'black';
		context.shadowBlur = 5;
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		// context.shadowColor = 'transparent';
		for (const node in textPositions) {
			context.fillText(node, textPositions[node].x, textPositions[node].y);
		}

		
	}, [props.graph, props.width, props.height, maxVoltage, maxCurrent, nodeRadius, edgeWidth, nodePositions, nodeColors, edgePositions, edgeColors, textPositions]);

	return (
		<canvas className="graph-display" ref={canvasRef} width={props.width} height={props.height} />
	);
}

export default GraphDisplay;