// The following code calculates the voltage and current at each node in a circuit.

// Define the circuit as an adjacency list: connections[node] = [{ node: connectedNode, resistance: resistanceOfConnection }, ...]
const circuit = {
    1: [{ node: 2, resistance: 5 }, { node: 3, resistance: 10 }], // Node 1 is connected to nodes 2 and 3 with resistances of 5 and 10 ohms, respectively
    2: [{ node: 1, resistance: 5 }, { node: 3, resistance: 20 }],
    3: [{ node: 1, resistance: 10 }, { node: 2, resistance: 20 }, { node: 4, resistance: 15 }],
    4: [{ node: 3, resistance: 15 }]
};

// Define the voltage and resistance of some nodes in the circuit
const voltage = { 1: 12, 4: 0 }; // Node 1 has a voltage of 12 volts and node 4 has a voltage of 0 volts
// Calculate the resistance of each node using Ohm's Law
const resistance = {};
for (const [node, connections] of Object.entries(circuit)) {
    resistance[node] = 0;
    // Calculate the total resistance of the node
    
}

// Calculate the current flowing through each node using Ohm's Law
const current = {};
for (const [node, vol] of Object.entries(voltage)) {
    current[node] = vol / resistance[node];
}

// Calculate the current flowing into and out of each node using Kirchhoff's Current Law (KCL)
const inCurrent = {};
const outCurrent = {};
for (const [node, connections] of Object.entries(circuit)) {
inCurrent[node] = 0;
outCurrent[node] = 0;
for (const [connectedNode, res] of Object.entries(connections)) {
    inCurrent[connectedNode] = (inCurrent[connectedNode] || 0) + current[node] * res / resistance[connectedNode];
    outCurrent[node] += current[node];
}
}

// Calculate the voltage at each node using Kirchhoff's Voltage Law (KVL)
const nodeVoltage = {};
for (const [node, connections] of Object.entries(circuit)) {
let voltageDrop = 0;
for (const [connectedNode, res] of Object.entries(connections)) {
    voltageDrop += current[node] * res;
}
nodeVoltage[node] = voltage[node] - voltageDrop;
}

// Print the results
console.log("Node voltages:", nodeVoltage);
console.log("Node currents:", current);
console.log("In currents:", inCurrent);
console.log("Out currents:", outCurrent);
