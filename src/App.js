import './App.css';
import GraphDisplay from './components/graphDisplay';
import './components/graphDisplay.css';
import { solveResistiveCircuit } from 'js-circuit-solver';


let graphData = [
  {
    "id": 1,
    "x": 0.5,
    "y": 0.5,
    "voltage": 1,
    "connections": [
      {
        "id": 2,
        "current": 1
      },
      {
        "id": 3,
        "current": 0.03
      }
    ]
  },
  {
    "id": 2,
    "x": 0.5,
    "y": 0.75,
    "voltage": 0,
    "connections": [
      {
        "id": 1,
        "current": 1
      },
      {
        "id": 3,
        "current": 2.4
      },
      {
        "id": 4,
        "current": 0.5
      }
    ]
  },
  {
    "id": 3,
    "x": 0.5,
    "y": 0.25,
    "voltage": 0,
    "connections": [
      {
        "id": 1,
        "current": 0.03
      },
      {
        "id": 2,
        "current": 2.4
      },
      {
        "id": 4,
        "current": 1.4
      }
    ]
  },
  {
    "id": 4,
    "x": 0.75,
    "y": 0.5,
    "voltage": 0,
    "connections": [
      {
        "id": 1,
        "current": 0.5
      },
      {
        "id": 3,
        "current": 1.4
      }
    ]
  }
];


function App() {
  return (
    <div className="App">
      <GraphDisplay graph={graphData} width={480} height={360}/>
    </div>
  );
}

export default App;
