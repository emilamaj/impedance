# Electrical Impedance Tomography 
![Deploy to Pages](https://github.com/emilamaj/impedance/actions/workflows/node-react-pages.js.yml/badge.svg)
Access the app [here](https://emilamaj.github.io/impedance/)

![Electrical Impedance Tomography](/main_screenshot.png)
This web app takes as input an image representing an electrically conductive medium. \
It solves for the voltage and current at every point of the medium, when two nodes are selected as the voltage source and the ground. \
For now, only the resistive nature of the medium is considered. (static domain simulations) \

## Usage

First, select the image you want to simulate. The image should be a black and white image, where black represents regions of high resistance and white represents regions of low resistance. \
You can use the image provided in the repository, or upload your own. \
The successively process the image (this converts the PNG to a pixel intensity matrix) \
Then, convert this pixel matrix into its electrical circuit representation. \
Finally, click solve and wait for the results. \

## Future features

-~~GPU Implementation of circuit solving~~ Already 15x speedup with fmgpu for 32x32 which now takes 1s to process, but 64x64 still takes 60s \
-Go through every ground/source node setting, animate the results \
-Use simulation results to attempt to reconstruct the original image \
-Future versions will simulate capacitive/reactive effects of the sliced medium. Time domain results will be shown \
