import $ from 'jQuery';
import Potrace from 'Potrace';
import BaseIntegration from './BaseIntegration.js';

/**
  * Potrace model for the main canvas.
  */

export default class PotraceIntegration extends BaseIntegration {
  constructor() {
    super();
    Potrace.setParameter({
      alphamax: 1,
      optcurve: false,
      opttolerance: 0.2,
      turdsize: 100,
      turnpolicy: "minority"
    });
  }

  createSVG(src, callbackFn) {
    // Create an SVG from data and settings, draw to screen.
    Potrace.clear();
    Potrace.loadImageFromSrc(src);
    Potrace.process(function() {
      var svg = Potrace.getSVG(1);
      const randomColor = () => '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);
      var newSVG = document.createElementNS('http://www.w3.org/2000/svg', "svg");
      // normalize should be used to get back absolute segments
      const pathsDatas = $(svg).find('path')[0].getPathData({ normalize: true }).reduce((acc, seg) => {
        const pathData = seg.type === 'M' ? [] : acc.pop();
        seg.values = seg.values.map((v) => Math.round(v * 1000) / 1000);
        pathData.push(seg);
        acc.push(pathData); 
        
        return acc;
      }, []);

      pathsDatas.forEach(function(d) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setPathData(d);
        path.setAttribute('fill', randomColor());
        newSVG.appendChild(path);
      });

      callbackFn(newSVG.outerHTML);
    });
  }

}
