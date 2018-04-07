var ManifoldApplication = (function (Backbone,$,Potrace,THREE,fabric,_) {
  'use strict';

  Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  Potrace = Potrace && Potrace.hasOwnProperty('default') ? Potrace['default'] : Potrace;
  THREE = THREE && THREE.hasOwnProperty('default') ? THREE['default'] : THREE;
  fabric = fabric && fabric.hasOwnProperty('default') ? fabric['default'] : fabric;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

  /**
    * Base model.
    */

  var BaseModel = (function (superclass) {
    function BaseModel () {
      superclass.apply(this, arguments);
    }if ( superclass ) BaseModel.__proto__ = superclass;
    BaseModel.prototype = Object.create( superclass && superclass.prototype );
    BaseModel.prototype.constructor = BaseModel;

    

    return BaseModel;
  }(Backbone.Model));

  var pug = (function(exports){

    var pug_has_own_property = Object.prototype.hasOwnProperty;

    /**
     * Merge two attribute objects giving precedence
     * to values in object `b`. Classes are special-cased
     * allowing for arrays and merging/joining appropriately
     * resulting in a string.
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object} a
     * @api private
     */

    exports.merge = pug_merge;
    function pug_merge(a, b) {
      if (arguments.length === 1) {
        var attrs = a[0];
        for (var i = 1; i < a.length; i++) {
          attrs = pug_merge(attrs, a[i]);
        }
        return attrs;
      }

      for (var key in b) {
        if (key === 'class') {
          var valA = a[key] || [];
          a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
        } else if (key === 'style') {
          var valA = pug_style(a[key]);
          valA = valA && valA[valA.length - 1] !== ';' ? valA + ';' : valA;
          var valB = pug_style(b[key]);
          valB = valB && valB[valB.length - 1] !== ';' ? valB + ';' : valB;
          a[key] = valA + valB;
        } else {
          a[key] = b[key];
        }
      }

      return a;
    }
    /**
     * Process array, object, or string as a string of classes delimited by a space.
     *
     * If `val` is an array, all members of it and its subarrays are counted as
     * classes. If `escaping` is an array, then whether or not the item in `val` is
     * escaped depends on the corresponding item in `escaping`. If `escaping` is
     * not an array, no escaping is done.
     *
     * If `val` is an object, all the keys whose value is truthy are counted as
     * classes. No escaping is done.
     *
     * If `val` is a string, it is counted as a class. No escaping is done.
     *
     * @param {(Array.<string>|Object.<string, boolean>|string)} val
     * @param {?Array.<string>} escaping
     * @return {String}
     */
    exports.classes = pug_classes;
    function pug_classes_array(val, escaping) {
      var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
      for (var i = 0; i < val.length; i++) {
        className = pug_classes(val[i]);
        if (!className) { continue; }
        escapeEnabled && escaping[i] && (className = pug_escape(className));
        classString = classString + padding + className;
        padding = ' ';
      }
      return classString;
    }
    function pug_classes_object(val) {
      var classString = '', padding = '';
      for (var key in val) {
        if (key && val[key] && pug_has_own_property.call(val, key)) {
          classString = classString + padding + key;
          padding = ' ';
        }
      }
      return classString;
    }
    function pug_classes(val, escaping) {
      if (Array.isArray(val)) {
        return pug_classes_array(val, escaping);
      } else if (val && typeof val === 'object') {
        return pug_classes_object(val);
      } else {
        return val || '';
      }
    }

    /**
     * Convert object or string to a string of CSS styles delimited by a semicolon.
     *
     * @param {(Object.<string, string>|string)} val
     * @return {String}
     */

    exports.style = pug_style;
    function pug_style(val) {
      if (!val) { return ''; }
      if (typeof val === 'object') {
        var out = '';
        for (var style in val) {
          /* istanbul ignore else */
          if (pug_has_own_property.call(val, style)) {
            out = out + style + ':' + val[style] + ';';
          }
        }
        return out;
      } else {
        return val + '';
      }
    }
    /**
     * Render the given attribute.
     *
     * @param {String} key
     * @param {String} val
     * @param {Boolean} escaped
     * @param {Boolean} terse
     * @return {String}
     */
    exports.attr = pug_attr;
    function pug_attr(key, val, escaped, terse) {
      if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
        return '';
      }
      if (val === true) {
        return ' ' + (terse ? key : key + '="' + key + '"');
      }
      if (typeof val.toJSON === 'function') {
        val = val.toJSON();
      }
      if (typeof val !== 'string') {
        val = JSON.stringify(val);
        if (!escaped && val.indexOf('"') !== -1) {
          return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
        }
      }
      if (escaped) { val = pug_escape(val); }
      return ' ' + key + '="' + val + '"';
    }
    /**
     * Render the given attributes object.
     *
     * @param {Object} obj
     * @param {Object} terse whether to use HTML5 terse boolean attributes
     * @return {String}
     */
    exports.attrs = pug_attrs;
    function pug_attrs(obj, terse){
      var attrs = '';

      for (var key in obj) {
        if (pug_has_own_property.call(obj, key)) {
          var val = obj[key];

          if ('class' === key) {
            val = pug_classes(val);
            attrs = pug_attr(key, val, false, terse) + attrs;
            continue;
          }
          if ('style' === key) {
            val = pug_style(val);
          }
          attrs += pug_attr(key, val, false, terse);
        }
      }

      return attrs;
    }
    /**
     * Escape the given string of `html`.
     *
     * @param {String} html
     * @return {String}
     * @api private
     */

    var pug_match_html = /["&<>]/;
    exports.escape = pug_escape;
    function pug_escape(_html){
      var html = '' + _html;
      var regexResult = pug_match_html.exec(html);
      if (!regexResult) { return _html; }

      var result = '';
      var i, lastIndex, escape;
      for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
        switch (html.charCodeAt(i)) {
          case 34: escape = '&quot;'; break;
          case 38: escape = '&amp;'; break;
          case 60: escape = '&lt;'; break;
          case 62: escape = '&gt;'; break;
          default: continue;
        }
        if (lastIndex !== i) { result += html.substring(lastIndex, i); }
        lastIndex = i + 1;
        result += escape;
      }
      if (lastIndex !== i) { return result + html.substring(lastIndex, i); }
      else { return result; }
    }
    /**
     * Re-throw the given `err` in context to the
     * the pug in `filename` at the given `lineno`.
     *
     * @param {Error} err
     * @param {String} filename
     * @param {String} lineno
     * @param {String} str original source
     * @api private
     */

    exports.rethrow = pug_rethrow;
    function pug_rethrow(err, filename, lineno, str){
      if (!(err instanceof Error)) { throw err; }
      if ((typeof window != 'undefined' || !filename) && !str) {
        err.message += ' on line ' + lineno;
        throw err;
      }
      try {
        str = str || require('fs').readFileSync(filename, 'utf8');
      } catch (ex) {
        pug_rethrow(err, null, lineno);
      }
      var context = 3
        , lines = str.split('\n')
        , start = Math.max(lineno - context, 0)
        , end = Math.min(lines.length, lineno + context);

      // Error context
      var context = lines.slice(start, end).map(function(line, i){
        var curr = i + start + 1;
        return (curr == lineno ? '  > ' : '    ')
          + curr
          + '| '
          + line;
      }).join('\n');

      // Alter exception message
      err.path = filename;
      err.message = (filename || 'Pug') + ':' + lineno
        + '\n' + context + '\n\n' + err.message;
      throw err;
    }
    return exports
  })({});

  function activeObjectContext(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  pug_html = pug_html + "\u003Cdiv class=\"active-object-context floating overlay\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"ui mini menu labeled icon pointing\"\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnDeleteActive\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"trash alternate icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "Delete\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"object group icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "Group (1)\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"object ungroup icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "Ungroup (1)\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\" id=\"btnFillActive\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"tint icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "Fill\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"pencil alternate icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "Stroke\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item disabled\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"paper plane outline icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "Vector\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnMake3D\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"snowflake outline icon\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "3D\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * Colour picker model for the main canvas.
    * Credit - https://www.webdesignerdepot.com/2013/03/how-to-create-a-color-picker-with-html5-canvas/
    */

  var ColourPickerModel = (function (BaseModel$$1) {
    function ColourPickerModel() {
      BaseModel$$1.call(this);

      var el = document.getElementById('colour-picker');
      if (!el) {
        return;
      }

      this.attributes.canvas = el.getContext('2d');
      // create an image object and get it’s source
      var img = new Image();
      img.onload = function(){
        this.attributes.canvas.drawImage(img,0,0);
      }.bind(this);
      img.src = '/assets/spectrum.jpg';
      this.attributes.canvas.scale(0.49, 0.4);

      $('#fill-tool').draggable({ cancel: "#colour-picker, #colour-picker-preview input" });

      var mouseDown = false;
      $('#colour-picker').on('mousedown', function(event){
        mouseDown = true;
        this.pickColour(event);
      }.bind(this));
      $('#colour-picker').on('mousemove', function(event){
        if (mouseDown) {
          this.pickColour(event);
        }
      }.bind(this));
      $('#colour-picker').on('mouseup', function(){
        mouseDown = false;
      });
       
    }

    if ( BaseModel$$1 ) ColourPickerModel.__proto__ = BaseModel$$1;
    ColourPickerModel.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    ColourPickerModel.prototype.constructor = ColourPickerModel;

    ColourPickerModel.prototype.defaults = function defaults () {
      var settings = {
        color: '#FFFFFF',
        canvas: null
      };

      return settings;
    };

    ColourPickerModel.prototype.pickColour = function pickColour (event) {
      // http://www.javascripter.net/faq/rgbtohex.htm
      function rgbToHex(R,G,B) {
       return toHex(R)+toHex(G)+toHex(B); 
      }

      function toHex(m) {
        var n = parseInt(m,10);
        if (isNaN(n)) {
         return "00";
        }
        n = Math.max(0,Math.min(n,255));
        
        return "0123456789ABCDEF".charAt((n-(n%16))/16) + "0123456789ABCDEF".charAt(n%16);
      }

      // getting user coordinates
      var x = event.offsetX;
      var y = event.offsetY;
      // getting image data and RGB values
      var img_data = this.attributes.canvas.getImageData(x, y, 1, 1).data;
      var R = img_data[0];
      var G = img_data[1];
      var B = img_data[2];
      var rgb = R + ', ' + G + ', ' + B;
      // convert RGB to HEX
      var hex = rgbToHex(R,G,B);
      // making the color the value of the input
      $('input#rgb').val(rgb);
      $('input#hex').val('#' + hex);
      $('#colour-picker-preview').css('background-color', '#' + hex);
    };

    return ColourPickerModel;
  }(BaseModel));

  /**
    * Potrace model for the main canvas.
    */

  var PotraceModel = (function (BaseModel$$1) {
    function PotraceModel () {
      BaseModel$$1.apply(this, arguments);
    }

    if ( BaseModel$$1 ) PotraceModel.__proto__ = BaseModel$$1;
    PotraceModel.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    PotraceModel.prototype.constructor = PotraceModel;

    PotraceModel.prototype.defaults = function defaults () {
      var settings = {
        alphamax: 1,
        optcurve: false,
        opttolerance: 0.2,
        turdsize: 2,
        turnpolicy: "minority"
      };

      return settings;
    };

    PotraceModel.prototype.createSVG = function createSVG (src, callback) {
      // Create an SVG from data and settings, draw to screen.
      Potrace.clear();
      Potrace.loadImageFromSrc(src);
      Potrace.process(function() {
        var svg = Potrace.getSVG(1);
        var randomColor = function () { return '#'+('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6); };
        var newSVG = document.createElementNS('http://www.w3.org/2000/svg', "svg");
        // normalize should be used to get back absolute segments
        var pathsDatas = $(svg).find('path')[0].getPathData({ normalize: true }).reduce(function (acc, seg) {
          var pathData = seg.type === 'M' ? [] : acc.pop();
          seg.values = seg.values.map(function (v) { return Math.round(v * 1000) / 1000; });
          pathData.push(seg);
          acc.push(pathData); 
          
          return acc;
        }, []);

        pathsDatas.forEach(function(d) {
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setPathData(d);
          path.setAttribute('fill', randomColor());
          newSVG.appendChild(path);
        });

        callback(newSVG.outerHTML);
      });
    };

    return PotraceModel;
  }(BaseModel));

  /**
    * Three Canvas model.
    */

  var ThreeCanvasModel = (function (BaseModel$$1) {
    function ThreeCanvasModel(options) {
      BaseModel$$1.call(this, options);
      this.attributes.scene = new THREE.Scene();
      this.attributes.camera = new THREE.PerspectiveCamera( 75, this.attributes.width / this.attributes.height, 1, 100000 );
      this.attributes.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.attributes.renderer.setPixelRatio( window.devicePixelRatio );
      this.attributes.controls = new THREE.OrbitControls( this.attributes.camera, this.attributes.renderer.domElement );
      this.attributes.raycaster = new THREE.Raycaster();
      this.attributes.mouse = new THREE.Vector2();
    }

    if ( BaseModel$$1 ) ThreeCanvasModel.__proto__ = BaseModel$$1;
    ThreeCanvasModel.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    ThreeCanvasModel.prototype.constructor = ThreeCanvasModel;

    // Scene helpers.
    ThreeCanvasModel.prototype.defaults = function defaults () {
      var attributes = {
        animationId: null,
        renderer: null,
        scene: null,
        width: 400,
        height: 400,
        camera: null,
        controls: null,
        mesh: null,
        raycaster: null,
        highlighter: null,
        mouse: null,
        extrudeAmount: 40,
        helpers: []
      };
      
      return attributes;
    };

    ThreeCanvasModel.prototype.addHelpers = function addHelpers () {
      var size = 2000;
      var divisions = 100;
      var gridColour = new THREE.Color(0xEFEFEF);

      var gridHelper = new THREE.GridHelper( size, divisions, gridColour, gridColour );
      gridHelper.position.setX(-712.5);
      gridHelper.position.setZ(-500);
      gridHelper.rotateX(Math.PI / 2);
      gridHelper.rotateZ(-Math.PI / 4);
      this.attributes.helpers.push(gridHelper);
      this.attributes.scene.add( this.attributes.helpers[this.attributes.helpers.length-1] );

      var gridHelper2 = new THREE.GridHelper( size, divisions, gridColour, gridColour );
      gridHelper2.position.setX(712.5);
      gridHelper2.position.setZ(-500);
      gridHelper2.rotateX(Math.PI / 2);
      gridHelper2.rotateZ(Math.PI / 4);
      this.attributes.helpers.push(gridHelper2);
      this.attributes.scene.add( this.attributes.helpers[this.attributes.helpers.length-1] );

      var axesHelper = new THREE.AxesHelper( 500 );
      axesHelper.rotateY(-Math.PI / 4);
      axesHelper.position.set(0, -100, -350);
      this.attributes.helpers.push(axesHelper);
      this.attributes.scene.add( this.attributes.helpers[this.attributes.helpers.length-1] );
    };

    ThreeCanvasModel.prototype.clearScene = function clearScene () {
      cancelAnimationFrame( this.attributes.animationId );
      this.attributes.scene.children = [];
      this.attributes.mesh = null;
      this.attributes.camera.aspect = this.attributes.width / this.attributes.height;
    };

    ThreeCanvasModel.prototype.animate = function animate () {
      this.attributes.animationId = requestAnimationFrame( this.animate.bind(this) );
      this.render.bind(this)();
    };

    ThreeCanvasModel.prototype.render = function render () {
      this.attributes.controls.update();
      this.attributes.renderer.render( this.attributes.scene, this.attributes.camera );

      //this.attributes.raycaster.setFromCamera( this.attributes.mouse, this.attributes.camera );
      
      // var intersects = this.attributes.raycaster.intersectObjects( this.attributes.mesh.children );
      // if ( intersects.length > 0 ) {
      //   if (this.attributes.highlighter) {
      //     this.attributes.scene.remove( this.attributes.highlighter );
      //   }
      //   this.attributes.highlighter = new THREE.BoxHelper( intersects[0].object, 0xffff00 );
      //   this.attributes.scene.add( this.attributes.highlighter );
      // }

      if (app.models.mainCanvas) {
        app.models.mainCanvas.attributes.canvas.renderAll();      
      }
    };

    ThreeCanvasModel.prototype.resize = function resize () {
      this.attributes.camera.aspect = this.attributes.width / this.attributes.height;
      this.attributes.camera.updateProjectionMatrix();

      this.attributes.camera.position.setZ( (this.attributes.width / this.attributes.height) * 42.5 );

      this.attributes.renderer.setSize( this.attributes.width, this.attributes.height );
    };

    return ThreeCanvasModel;
  }(BaseModel));

  /**
    * Base view.
    */

  var BaseView = (function (superclass) {
    function BaseView () {
      superclass.apply(this, arguments);
    }if ( superclass ) BaseView.__proto__ = superclass;
    BaseView.prototype = Object.create( superclass && superclass.prototype );
    BaseView.prototype.constructor = BaseView;

    

    return BaseView;
  }(Backbone.View));

  function modelPreview(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  var locals_for_with = (locals || {});(function (id) {
  pug_html = pug_html + "\u003Cdiv" + (" class=\"model-preview\""+" style=\"box-shadow: inset 0 0 5px #ccc;\""+pug.attr("id", id, true, true)) + "\u003E\u003C\u002Fdiv\u003E";
  }.call(this,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * Three Canvas view.
    *
    * Manages a THREE.JS canvas view.
    */

  var models = 0;

  var ThreeCanvasView = (function (BaseView$$1) {
    function ThreeCanvasView(options) {
      $('#container').append(modelPreview({id: 'model-preview-' + models}));
      BaseView$$1.call(this, {
        el: '#model-preview-' + models,
        model: options.model
      });
      this.$el.css('width', options.width);
      this.$el.css('height', options.height);
      this.model.attributes.width = options.width;
      this.model.attributes.height = options.height;
      this.$el.on( 'mousemove', function(event) {
        this.model.attributes.mouse.x = (( event.offsetX / this.model.attributes.renderer.domElement.clientWidth ) * 2 ) - 1;
        this.model.attributes.mouse.y = - (( event.offsetY / this.model.attributes.renderer.domElement.clientHeight ) * 2 ) + 1;
      }.bind(this));

      this.createScene(options.svg);
      models++;
    }

    if ( BaseView$$1 ) ThreeCanvasView.__proto__ = BaseView$$1;
    ThreeCanvasView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    ThreeCanvasView.prototype.constructor = ThreeCanvasView;

    ThreeCanvasView.prototype.createScene = function createScene (svg) {
      
      this.model.attributes.renderer.setSize( this.model.attributes.width, this.model.attributes.height );
      this.model.clearScene();
      this.model.attributes.camera.position.set( 0, 0, (this.model.attributes.width / this.model.attributes.height) * 42.5 );
      this.model.attributes.camera.lookAt( 0, 0, 0 );
      this.$el.append( this.model.attributes.renderer.domElement );

       // Load the imagetracejs SVG using experimental SVGLoader from three.js dev.
      var loader = new THREE.SVGLoader();
      var paths = loader.parse(svg);
      var svgExtruded = this.extrudeSVG({
        paths: paths,
        amount: this.model.attributes.extrudeAmount,
        center: { x: this.model.attributes.width /2, y: this.model.attributes.height /2 }
      });
      var box = new THREE.Box3().setFromObject( svgExtruded );
      var boundingBoxSize = box.max.sub( box.min );
      var width = boundingBoxSize.x;
      var height = -boundingBoxSize.y;
      svgExtruded.position.setX((width / 2));
      svgExtruded.position.setY((height / 2));
      this.model.attributes.mesh = svgExtruded;
      this.model.attributes.scene.add( this.model.attributes.mesh );

      // Start the animation loop.
      this.model.animate();
    };

    // Populate a 3D group from an SVG using SVGLoader
    ThreeCanvasView.prototype.extrudeSVG = function extrudeSVG (svgObject) {
      var paths = svgObject.paths;
      var amount = svgObject.amount;
      var center = svgObject.center;

      var group = new THREE.Group();
      group.scale.multiplyScalar( 0.25 );
      for ( var i = 0; i < paths.length; i ++ ) {
        var path = paths[ i ];
        var shapes = path.toShapes( true );
        for ( var j = 0; j < shapes.length; j ++ ) {
          var color = new THREE.Color(Math.random() * 0xffffff);
          var material = new THREE.MeshBasicMaterial( {
            color: path.color ? path.color : color
          } );
          var simpleShape = shapes[ j ];
          var shape3d = new THREE.ExtrudeBufferGeometry( simpleShape, {
            amount: amount ,
            bevelEnabled: false
          } );

          var mesh = new THREE.Mesh( shape3d, material );
          mesh.rotation.x = Math.PI;
          mesh.translateZ( - amount - 1 );
          mesh.translateX( - center.x );
          mesh.translateY( - center.y );

          group.add( mesh );
        }
      }

      return group;
    };

    return ThreeCanvasView;
  }(BaseView));

  /**
    * Raster To SVG model.
    */

  var MainCanvasModel = (function (BaseModel$$1) {
    function MainCanvasModel() {
      BaseModel$$1.call(this);
      this.colourPickerModel = new ColourPickerModel();
      this.potrace = new PotraceModel();
      this.attributes.canvas = new fabric.Canvas('main-canvas');
      this.updateCanvasSize();
      this.setupEvents();
    }

    if ( BaseModel$$1 ) MainCanvasModel.__proto__ = BaseModel$$1;
    MainCanvasModel.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
    MainCanvasModel.prototype.constructor = MainCanvasModel;

    MainCanvasModel.prototype.defaults = function defaults () {
      var attributes = {
        canvas: null,
        transitioning: false
      };
      
      return attributes;
    };

    MainCanvasModel.prototype.setupEvents = function setupEvents () {
      // Credit - https://stackoverflow.com/a/24238960
      this.attributes.canvas.on('object:moving', function (e) {
        var obj = e.target;
         // if object is too big ignore
        if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
            return;
        }        
        obj.setCoords();        
        // top-left  corner
        if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
            obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
            obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
        }
        // bot-right corner
        if (obj.getBoundingRect().top+obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width > obj.canvas.width){
            obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
            obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
        }
      });

      // Create the active object context menu when selecting an object.
      var selectionCallback = function(e) {
        $('.model-preview').hide();
        $('.active-object-context').remove();
        var $menu = $(activeObjectContext());
        $('#container').append($menu);
        var offsetX = e.target.left + ((e.target.width / 2) - ($menu.width() / 2));
        var offsetY = e.target.top - ($menu.height()) - 50;
        $menu.css('left', offsetX);
        $menu.css('top', offsetY);

        // Set the menu to be draggable
        $('.floating.overlay').draggable();

        // Events
        $('#btnDeleteActive').click(function(e) {
          var this$1 = this;

          var selectedObjects = this.attributes.canvas.getActiveObjects();
          for (var i = 0; i < selectedObjects.length; i++) {
            this$1.attributes.canvas.remove(selectedObjects[i]);  
          }
          this.attributes.canvas.discardActiveObject();
          $('.active-object-context').remove();
        }.bind(this));
        $('#btnMake3D').click(function(e) {
          var this$1 = this;

          var selectedObjects = this.attributes.canvas.getActiveObjects();
          var convertibleObjects = [];
          for (var i = 0; i < selectedObjects.length; i++) {
            if (selectedObjects[i].toSVG) {

              var svgElements = selectedObjects[i].toSVG();

              var create3DObject = function(threeCanvas) {
                var threeD = new fabric.Image($(threeCanvas.el).find('canvas')[0]);
                threeD.left = selectedObjects[i].left;
                threeD.top = selectedObjects[i].top;
                convertibleObjects.push(threeD);
              }.bind(this$1);
              app.models.threeCanvas.push(new ThreeCanvasModel());
              app.views.threeCanvas.push(
                new ThreeCanvasView({ 
                  model: app.models.threeCanvas[app.models.threeCanvas.length-1],
                  svg: svgElements,
                  width: selectedObjects[i].width,
                  height: selectedObjects[i].height
                })
              );
              create3DObject(app.views.threeCanvas[app.views.threeCanvas.length-1]);
              this$1.attributes.canvas.remove(selectedObjects[i]);
            }
            else {
              console.log('not convertible!');
            }
          }
          // Create a group so we add to center accurately.
          var group = new fabric.Group(convertibleObjects);
          this.addToCenter(group);
          // Ungroup.
          var items = group._objects;
          group._restoreObjectsState();
          this.attributes.canvas.remove(group);
          for (var i = 0; i < items.length; i++) {
            this$1.attributes.canvas.add(items[i]);
          }
          this.attributes.canvas.renderAll();
          this.attributes.canvas.discardActiveObject();
          $('.active-object-context').remove();
        }.bind(this));
      }.bind(this);

      // Separated for Fabric's On not supporting multiple.
      this.attributes.canvas.on('selection:created', selectionCallback);
      this.attributes.canvas.on('selection:updated', selectionCallback);

      this.attributes.canvas.on('mouse:dblclick', function(e){
        if (e.target && e.target._element) {
          var $el = $(e.target._element).parent();
          var scaledWidth = e.target.width * e.target.scaleX;
          var scaledHeight = e.target.height * e.target.scaleY;
          var offsetX = e.target.left + ((scaledWidth / 2) - ($el.width() / 2));
          var offsetY = e.target.top + ((scaledHeight / 2) - ($el.height() / 2));
          $el.show();
          $el.css('left', offsetX);
          $el.css('top', offsetY);
        }
       
      }.bind(this));

      this.attributes.canvas.on('selection:cleared', function(){
        $('.active-object-context').remove();
       $('.model-preview').hide();
      });

      // TODO: Don't follow if user moved the toolbar.
      this.attributes.canvas.on('object:moving', function(e) {
        var $menu = $('.active-object-context');
        var offsetX = e.target.left+ ((e.target.width / 2) - ($menu.width() / 2));
        var offsetY = e.target.top - ($menu.height()) - 50;
        var toolbarWidth = $('#toolbar').sidebar('is visible') ? $('#toolbar').width(): 0;
        if (offsetX < toolbarWidth) {
          offsetX = 0;
        }
        if (offsetX > this.attributes.canvas.width - toolbarWidth - $menu.width()) {
          offsetX = this.attributes.canvas.width - $menu.width(); 
        }
        if (offsetY < 0) {
          offsetY = 0;
        }
        $menu.css('left', offsetX);
        $menu.css('top', offsetY);
      }.bind(this));

      // Resize 3D canvas if it's that type of element.
      this.attributes.canvas.on('object:scaling', function(e) {
        if (e.target._element) {
          var $container = $(e.target._element).parent();
          if ($container.hasClass('model-preview')) {
            var scaledWidth = e.target.width * e.target.scaleX;
            var scaledHeight = e.target.height * e.target.scaleY;
            $container.css('width', scaledWidth);
            $container.css('height', scaledHeight);
            
            var id = $container.attr('id').replace('model-preview-','');
            app.models.threeCanvas[id].attributes.width = scaledWidth;
            app.models.threeCanvas[id].attributes.height = scaledHeight;
            app.models.threeCanvas[id].resize();
            e.target._resetWidthHeight();
          }
        }
      });
    };

    // Loads an SVG string and splits up objects so they're loaded in the right position.
    MainCanvasModel.prototype.loadSVG = function loadSVG (svg, callback) {
      fabric.loadSVGFromString(svg, function(objects){
        var this$1 = this;

        // Create a group so we add to center accurately.
        var group = new fabric.Group(objects);
        this.addToCenter(group);

        // Ungroup.
        var items = group._objects;
        group._restoreObjectsState();
        this.attributes.canvas.remove(group);
        for (var i = 0; i < items.length; i++) {
          this$1.attributes.canvas.add(items[i]);
        }
        this.attributes.canvas.renderAll();
        if (callback) {
          callback(items);
        }
      }.bind(this));
    };

    MainCanvasModel.prototype.updateCanvasSize = function updateCanvasSize () {
      var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if ($("#toolbar").sidebar('is visible')) {
        width -= $('#toolbar').width();  
      }
      var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      this.attributes.canvas.setHeight( height );
      this.attributes.canvas.setWidth( width );
    };

    // Add an object to the center of the canvas.
    MainCanvasModel.prototype.addToCenter = function addToCenter (object) {
      var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if ($("#toolbar").sidebar('is visible')) {
        canvasWidth -= $('#toolbar').width();  
      }
      var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      
      object.set({ left: (canvasWidth / 2) - (object.width / 2), top: ((canvasHeight /2) - (object.height / 2)) });
      
      this.attributes.canvas.add(object);
    };

    return MainCanvasModel;
  }(BaseModel));

  function defaultMenu(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  pug_html = pug_html + "\u003Cdiv class=\"ui horizontal divider fitted inverted\"\u003E";
  pug_html = pug_html + "\u003Ch6\u003E";
  pug_html = pug_html + "View\u003C\u002Fh6\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnToggleOverlays\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large eye icon inverted\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"ui horizontal divider fitted inverted\"\u003E";
  pug_html = pug_html + "\u003Ch6\u003E";
  pug_html = pug_html + "Add\u003C\u002Fh6\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddImage\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large icons\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"image icon inverted disabled\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Ci class=\"corner plus icon green disabled\"\u003E\u003C\u002Fi\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddShape\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large icons\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"chart pie icon inverted\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Ci class=\"corner plus icon green\"\u003E\u003C\u002Fi\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddText\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large icons\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"font icon inverted\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Ci class=\"corner plus icon green\"\u003E\u003C\u002Fi\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"ui horizontal divider fitted inverted\"\u003E";
  pug_html = pug_html + "\u003Ch6\u003E";
  pug_html = pug_html + "Tools\u003C\u002Fh6\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnToggleFill\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large tint icon inverted disabled\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnToggleVector\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large paper plane outline icon inverted disabled\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnToggleLayers\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large align justify icon inverted disabled\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnToggle3DOptions\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"icons large\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"cog icon inverted disabled\"\u003E\u003C\u002Fi\u003E";
  pug_html = pug_html + "\u003Ci class=\"corner snowflake outline icon inverted disabled\"\u003E\u003C\u002Fi\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  function addImageItem(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  var locals_for_with = (locals || {});(function (url) {
  pug_html = pug_html + "\u003Ca class=\"item image\"\u003E";
  pug_html = pug_html + "\u003Cimg" + (" class=\"ui fluid image small\""+pug.attr("src", url, true, true)) + "\u003E\u003C\u002Fa\u003E";
  }.call(this,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  function addShapes(locals) {var pug_html = "";var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnBack\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"large arrow left icon inverted\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"item\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"menu\"\u003E";
  pug_html = pug_html + "\u003Cdiv class=\"ui horizontal divider fitted inverted\"\u003E";
  pug_html = pug_html + "\u003Ch6\u003E";
  pug_html = pug_html + "Shapes\u003C\u002Fh6\u003E\u003C\u002Fdiv\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddCircle\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"circle icon large green\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddSquare\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"square icon large red\"\u003E\u003C\u002Fi\u003E\u003C\u002Fa\u003E";
  pug_html = pug_html + "\u003Ca class=\"item\" id=\"btnAddTriangle\"\u003E";
  pug_html = pug_html + "\u003Ci class=\"play icon large blue counterclockwise rotated\"\u003E";
  pug_html = pug_html + " \u003C\u002Fi\u003E\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

  /**
    * MainCanvas view.
    */

  var MainCanvasView = (function (BaseView$$1) {
    function MainCanvasView(options) {
      BaseView$$1.call(this, {
        el: '#main-canvas',
        model: options.model
      });

      var circle = new fabric.Circle({ radius: 100, fill: 'green', left: 100, top: 100 });
      this.model.addToCenter(circle);

      this.toggleToolbar = _.throttle(this.toggleToolbar, 1000);

      this.setupDefaultMenu();

      $('.floating.overlay').draggable();

      $('#add-image').on('click', 'a.item.image', function(e){
        var src = $(e.target).attr('src');
        var callback = function(svg) {
          var callback = function() {
            $('.ui.special.modal')
              .modal('hide');
          };
          app.models.mainCanvas.loadSVG(svg, callback);
        };
        app.models.mainCanvas.potrace.createSVG(src, callback);
      });

      $('.ui.dropdown').dropdown();

      $(window).on('resize', function () {
        app.models.mainCanvas.updateCanvasSize();
      });

      $('#hideAddImage')
        .on('click', function() {
          $('#btnAddImage').find('i.icon').toggleClass('disabled');
          $('#add-image')
            .animate({
             left: '-' + $('#add-image').width() + 'px'
            });
        });
      $('#btnUploadImage')
        .on('click', function(e) {
          e.stopImmediatePropagation();
          e.preventDefault();
          $('#image_input').click();
        });
      $('#image_input')
        .on('change', function(e) {
          window.URL = window.URL || window.webkitURL || window.mozURL;
          var url = URL.createObjectURL(e.currentTarget.files[0]);
          $(addImageItem({ url: url }))
            .insertBefore('#add-image .ui.menu .item:last-child');
        });
    }

    if ( BaseView$$1 ) MainCanvasView.__proto__ = BaseView$$1;
    MainCanvasView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
    MainCanvasView.prototype.constructor = MainCanvasView;

    MainCanvasView.prototype.setupDefaultMenu = function setupDefaultMenu () {
      // Define slideout position based on corresponding menu item.
      $('#add-image').css('top', function(){
        return $('#btnAddImage').offset().top +(($('#btnAddImage').height() / 2) - ($(this).height() / 2));
      });
      $('#btnAddImage')
        .popup({
          title: 'Add Image',
          position: 'right center'
        })
        .on('click', function(){
          $(this).find('i.icon').toggleClass('disabled');
          if ($(this).find('i.icon').hasClass('disabled')) {
            $('#add-image')
              .css('left', '0px')
              .show()
              .animate({
                left: '-' + $('#add-image').width() + 'px'
              });
          }
          else {
            $('#add-image')
              .css('left', '-' + $('#add-image').width() + 'px')
              .show()
              .animate({
                left: '0px'
              });
          }
        });

      $('#btnAddShape')
        .popup({
          title: 'Add Shape',
          position: 'right center'
        })
        .on('click', function(){
          $('#toolbar').html(addShapes());
          this.setupAddShapesMenu();
        }.bind(this));

      // TODO: https://codepen.io/shershen08/pen/JGepQv
      $('#btnAddText')
        .popup({
          title: 'Add Text',
          position: 'right center'
        })
        .on('click', function(){
          var textBox = new fabric.Textbox("Sample Text", {
            fontFamily: 'Arial'
          });
          this.model.addToCenter(textBox);
        }.bind(this));

      // Track which overlays we hid so we don't override other settings.
      var overlays_visible = [];
      $('#btnToggleOverlays')
        .popup({
          title: 'Toggle Overlays',
          position: 'right center'
        })
        .on('click', function(){
          if ($(this).find('i.eye.icon').hasClass('slash')) {
            if (overlays_visible.length > 0) {
              $(overlays_visible).each(function(i, overlay){
                $(overlay).show();
              });
              overlays_visible = [];
            }
          }
          else {
            overlays_visible = $('.floating.overlay:visible');
            $('.floating.overlay:visible').hide();
          }
          $(this).find('i.icon').toggleClass('slash');
        });
      $('#btnToggleFill')
        .popup({
          title: 'Toggle Fill',
          position: 'right center'
        })
        .on('click', function(){
          $(this).find('i.icon').toggleClass('disabled');
          $('#fill-tool').toggle();
        });
      $('#btnToggleVector')
        .popup({
          title: 'Toggle Vector',
          position: 'right center'
        })
        .on('click', function(){
          $(this).find('i.icon').toggleClass('disabled');
          $('#vector-tool').toggle();
        });
      $('#btnToggleLayers')
        .popup({
          title: 'Toggle Layers',
          position: 'right center'
        })
        .on('click', function(){
          $(this).find('i.icon').toggleClass('disabled');
          $('#layers-tool').toggle();
        });
      $('#btnToggle3DOptions')
        .popup({
          title: 'Toggle 3D Options',
          position: 'right center'
        })
        .on('click', function(){
          $(this).find('i.icon').toggleClass('disabled');
          $('#threeD-tool').toggle();
        });
    };

    MainCanvasView.prototype.setupAddShapesMenu = function setupAddShapesMenu () {
      $('#btnBack')
        .popup({
          title: 'Back',
          position: 'right center'
        })
        .on('click', function(){
          $('#toolbar').html(defaultMenu());
          this.setupDefaultMenu();
        }.bind(this));
      $('#btnAddCircle')
        .popup({
          title: 'Circle',
          position: 'right center'
        })
        .on('click', function(){
          var circle = new fabric.Circle({ radius: 100, fill: 'green', left: 100, top: 100 });
          this.model.addToCenter(circle);
        }.bind(this));
      $('#btnAddSquare')
        .popup({
          title: 'Square',
          position: 'right center'
        })
        .on('click', function(){
          var rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 200,
            height: 200
          });
          this.model.addToCenter(rect);
        }.bind(this));
      $('#btnAddTriangle')
        .popup({
          title: 'Triangle',
          position: 'right center'
        })
        .on('click', function(){
          var triangle = new fabric.Triangle({ width: 100, height: 100, fill: 'blue', left: 50, top: 50 });
          this.model.addToCenter(triangle);
        }.bind(this));
    };

    MainCanvasView.prototype.toggleToolbar = function toggleToolbar () {
      if (!this.model.attributes.transitioning) {
        $("#toolbar")
          .sidebar({
            dimPage: false,
            transition: 'push',
            exclusive: false,
            closable: false,
            onChange: function() {
              app.models.mainCanvas.attributes.transitioning = true;
            },
            onHide: function() {
              app.models.mainCanvas.attributes.transitioning = false;
            },
            onShow: function() {
              app.models.mainCanvas.attributes.transitioning = false;
            }
          })
          .sidebar("toggle");
        this.model.updateCanvasSize();
      }
    };

    return MainCanvasView;
  }(BaseView));

  // External libs

  /**
   * Manifold Browser Application
   */
  var App = function App() {
    this.models = {
      mainCanvas: new MainCanvasModel(),
      threeCanvas: []
    };
    this.views = {
      mainCanvas: new MainCanvasView({ model: this.models.mainCanvas }),
      threeCanvas: []
    };
  };

  // Startup using jQuery.ready()
  $(function () {
    var app = new App();
    window.app = app;
  });

  return App;

}(Backbone,jQuery,Potrace,THREE,fabric,_));
//# sourceMappingURL=app.js.map
