# Electrical Impedance Tomography 
![Deploy to Pages](https://github.com/emilamaj/impedance/actions/workflows/node-react-reages.js.yml/badge.svg)

![Electrical Impedance Tomography](/main_screenshot.png)
This web app takes as input an image representing an electrically conductive medium.
It solves for the voltage and current at every point of the medium, when two nodes are selected as the voltage source and the ground.
For now, only the resistive nature of the medium is considered. (static domain simulations)

# Start the app

Run `npm start` to launch the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

# Future features

-Source and ground electrodes will be selectable
-GPU Implementation of circuit solving (current max. is a 32x32 grid, solved in a few seconds)
-Future versions will simulate capacitive/reactive effects of the sliced medium. Time domain results will be shown