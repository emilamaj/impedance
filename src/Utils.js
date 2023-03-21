

// This function converts a base64-encoded PNG image to a 2D array of pixels.
async function imageStringToGrid(base64Image) {
    // Decode the base64 image data into a binary string
    // const binaryString = atob(base64Image.split(',')[1]);
  
    // Parse the binary string into a PNG object using a DOM image element
    const img = new Image();
    img.src = base64Image;

    const imagePromise = new Promise((resolve, reject) => {
        img.onload = () => {
            resolve();
        }
    });

    await imagePromise;

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    const png = context.getImageData(0, 0, img.width, img.height);
  
    // Extract the pixel data from the PNG object and convert it to a 2D grid
    const pixelData = png.data;
    const grid = new Array(png.height);
    for (let y = 0; y < png.height; y++) {
        grid[y] = new Array(png.width);
        for (let x = 0; x < png.width; x++) {
            const i = (y * png.width + x) * 4;
            const r = pixelData[i];
            const g = pixelData[i + 1];
            const b = pixelData[i + 2];
            // const a = pixelData[i + 3];
            const intensity = (r + g + b) / 3; // Convert to grayscale intensity
            grid[y][x] = intensity;
        }
    }
    
    return grid;
}
  

// This function converts a 2D array of pixels to a circuit graph.
// Each node in the graph is a pixel in the image. The conductivity of the connection between two nodes is the average of the conductivity of the two nodes.
// Only the pixels that are connected to each other are included in the graph.
// Only the pixels that are less than a given radius from the center of the 2D grid are included in the graph.
// The graph is returned as an array of objects, where each object represents ith node in the graph and its connections.
function pixelGridToGraph(pixelGrid, radius) {
    // Graph will contain the nodes and their connections
    const graph = [];
    const nodeCoord = [];
    let graphID = 0;

    // Get the center of the 2D grid
    const center = {x:Math.floor(pixelGrid.length / 2), y:Math.floor(pixelGrid[0].length / 2)};

    // graphID is the ID of the current node in the graph. We will map it to the position of the node in the 2D grid.
    let coordDict = {}

    // List of nodes that are on the border of the graph (connected to less than 4 nodes)
    let borderNodes = [];

    // Iterate through the 2D grid
    for (let i = 0; i < pixelGrid.length; i++) {
        for (let j = 0; j < pixelGrid[0].length; j++) {
            // Only include the pixels that are less than a given radius from the center of the 2D grid
            if (Math.sqrt(Math.pow(i - center.x, 2) + Math.pow(j - center.y, 2)) <= radius) {
                // Create a node in the graph
                const node = []
                nodeCoord.push({x: i, y: j})

                let connectionCount = 0;

                // Add connections to the nodes connected to the current node, if they are less than a given radius from the center of the 2D grid
                if (i - 1 >= 0 && Math.sqrt(Math.pow(i - 1 - center.x, 2) + Math.pow(j - center.y, 2)) <= radius) {
                    node.push({
                        to: {x: i - 1, y: j}, // The position of the node in the 2D grid will be replace by the ID of the node in the graph
                        resistance: (1/pixelGrid[i][j] + 1/pixelGrid[i - 1][j]) / 2});
                    connectionCount++;
                }
                if (i + 1 < pixelGrid.length && Math.sqrt(Math.pow(i + 1 - center.x, 2) + Math.pow(j - center.y, 2)) <= radius) {
                    node.push({
                        to: {x: i + 1, y: j}, // The position of the node in the 2D grid will be replace by the ID of the node in the graph
                        resistance: (1/pixelGrid[i][j] + 1/pixelGrid[i + 1][j]) / 2});
                    connectionCount++;
                }
                if (j - 1 >= 0 && Math.sqrt(Math.pow(i - center.x, 2) + Math.pow(j - 1 - center.y, 2)) <= radius) {
                    node.push({
                        to: {x: i, y: j - 1}, // The position of the node in the 2D grid will be replace by the ID of the node in the graph
                        resistance: (1/pixelGrid[i][j] + 1/pixelGrid[i][j - 1]) / 2});
                    connectionCount++;
                }
                if (j + 1 < pixelGrid[0].length && Math.sqrt(Math.pow(i - center.x, 2) + Math.pow(j + 1 - center.y, 2)) <= radius) {
                    node.push({
                        to: {x: i, y: j + 1}, // The position of the node in the 2D grid will be replace by the ID of the node in the graph
                        resistance: (1/pixelGrid[i][j] + 1/pixelGrid[i][j + 1]) / 2});
                    connectionCount++;
                }

                // Add the node to the list of border nodes if it is connected to less than 4 nodes
                if (connectionCount < 4) {
                    borderNodes.push(graphID);
                }

                // Add the node to the graph
                graph.push(node);
                coordDict[i + "," + j] = graphID;
                graphID++;

            }
        }
    }

    // Replace the position of the node in the 2D grid with the ID of the node in the graph
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            // graph[i][j].to = graphIDmap.get(graph[i][j].to);
            graph[i][j].to = coordDict[graph[i][j].to.x + "," + graph[i][j].to.y];
        }
    }

    return {graph, borderNodes, nodeCoord}
}


export { imageStringToGrid, pixelGridToGraph};