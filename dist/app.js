(function (Backbone,dat,ImageTracer,Potrace,$,THREE,$d3g) {
	'use strict';

	Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
	dat = dat && dat.hasOwnProperty('default') ? dat['default'] : dat;
	var ImageTracer__default = 'default' in ImageTracer ? ImageTracer['default'] : ImageTracer;
	Potrace = Potrace && Potrace.hasOwnProperty('default') ? Potrace['default'] : Potrace;
	$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
	THREE = THREE && THREE.hasOwnProperty('default') ? THREE['default'] : THREE;
	$d3g = $d3g && $d3g.hasOwnProperty('default') ? $d3g['default'] : $d3g;

	/**
	  * Base view.
	  */

	var gui = new dat.GUI();

	var BaseView = (function (superclass) {
		function BaseView(options) {
			this.gui = gui;
	    superclass.call(this, options);
		}

		if ( superclass ) BaseView.__proto__ = superclass;
		BaseView.prototype = Object.create( superclass && superclass.prototype );
		BaseView.prototype.constructor = BaseView;

		return BaseView;
	}(Backbone.View));

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

	/**
	  * Imagetracer Controls model.
	  */

	var ImageTracerControls = (function (BaseModel$$1) {
	  function ImageTracerControls () {
	    BaseModel$$1.apply(this, arguments);
	  }

	  if ( BaseModel$$1 ) ImageTracerControls.__proto__ = BaseModel$$1;
	  ImageTracerControls.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
	  ImageTracerControls.prototype.constructor = ImageTracerControls;

	  ImageTracerControls.prototype.defaults = function defaults () {
	    var controls = ImageTracer.checkoptions();
	    controls.numberofcolors = 2;
	    controls.strokewidth = 1;
	    controls.viewbox = true;
	    
	    return controls;
	  };

	  return ImageTracerControls;
	}(BaseModel));

	/**
	  * ImageTracer view.
	  *
	  * Manages all UI elements relating to ImageTracer integration.
	  */

	var ImageTracerView = (function (BaseView$$1) {
	  function ImageTracerView() {
	    this.el = '#svg-preview';
	    this.controls = new ImageTracerControls();
	    BaseView$$1.call(this);
	    this.render();
	  }

	  if ( BaseView$$1 ) ImageTracerView.__proto__ = BaseView$$1;
	  ImageTracerView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
	  ImageTracerView.prototype.constructor = ImageTracerView;

	  ImageTracerView.prototype.render = function render () {
	    var this$1 = this;

	    var guiFolder = this.gui.addFolder('ImageTracer Controls');
	    for (var controlName in this$1.controls.attributes) {
	      var _this = this$1;
	      
	      var callback = function() {
	        _this.$el.html('<div class="ui active centered inline loader"></div>');
	        // Wait 100ms so the loader can appear.
	        setTimeout(_this.createSVG.bind(_this), 100);
	      };
	      if (isNaN(this$1.controls.attributes[controlName])) {
	        guiFolder.add(this$1.controls.attributes, controlName)
	          .onFinishChange(callback);
	      }
	      else {
	        var max = this$1.controls.attributes[controlName] * 2;
	        max = (max > 0) ? max : 100;
	        guiFolder.add(this$1.controls.attributes, controlName, 0, max)
	          .onFinishChange(callback);
	      }
	    }
	    this.createSVG();
	  };

	  // Create an SVG from data and settings, draw to screen.
	  ImageTracerView.prototype.createSVG = function createSVG () {  
	    var svgStr = ImageTracer__default.imagedataToSVG(this.getImageDimensions(), this.controls.attributes);
	    this.$el.html('');
	    ImageTracer__default.appendSVGString( svgStr, 'svg-preview' );
	  };
	  
	  // Duplicates the image programatically so we can get its original dimensions.
	  ImageTracerView.prototype.getImageDimensions = function getImageDimensions () {
	    var original_image = document.getElementById('original-image');
	    var img = document.createElement('img');
	    img.src = original_image.src;
	    
	    // Get the image data from a virtual canvas.
	    var canvas = document.createElement('canvas');
	    canvas.width = img.width;
	    canvas.height = img.height;
	    var context = canvas.getContext('2d');
	    context.drawImage(img,0,0);
	    
	    return context.getImageData(0, 0, img.width, img.height);
	  };

	  return ImageTracerView;
	}(BaseView));

	/**
	  * Potrace Controls model.
	  */

	var PotraceControls = (function (BaseModel$$1) {
	  function PotraceControls () {
	    BaseModel$$1.apply(this, arguments);
	  }

	  if ( BaseModel$$1 ) PotraceControls.__proto__ = BaseModel$$1;
	  PotraceControls.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
	  PotraceControls.prototype.constructor = PotraceControls;

	  PotraceControls.prototype.defaults = function defaults () {
	    var controls = {
	      alphamax: 1,
	      optcurve: false,
	      opttolerance: 0.2,
	      turdsize: 2,
	      turnpolicy: "minority"
	    };
	    
	    return controls;
	  };

	  return PotraceControls;
	}(BaseModel));

	/**
	  * Potrace view.
	  *
	  * Manages all UI elements relating to Potrace integration.
	  */

	var PotraceView = (function (BaseView$$1) {
	  function PotraceView() {
	    this.el = '#potrace-preview';
	    this.controls = new PotraceControls();
	    BaseView$$1.call(this);
	    this.render();
	  }

	  if ( BaseView$$1 ) PotraceView.__proto__ = BaseView$$1;
	  PotraceView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
	  PotraceView.prototype.constructor = PotraceView;

	  PotraceView.prototype.render = function render () {
	    var this$1 = this;

	    var guiFolder = this.gui.addFolder('Potrace Controls');
	    for (var controlName in this$1.controls.attributes) {
	      var _this = this$1;
	      
	      var callback = function() {
	        this.$el.html('<div class="ui active centered inline loader"></div>');
	        // Wait 100ms so the loader can appear.
	        setTimeout(_this.createSVG.bind(_this), 100);
	      };
	      if (isNaN(this$1.controls.attributes[controlName])) {
	        guiFolder.add(this$1.controls.attributes, controlName)
	          .onFinishChange(callback);
	      }
	      else {
	        var max = this$1.controls.attributes[controlName] * 2;
	        max = (max > 0) ? max : 100;
	        guiFolder.add(this$1.controls.attributes, controlName, 0, max)
	          .onFinishChange(callback);
	      }
	    }
	    this.createSVG();
	  };

	  // Create an SVG from data and settings, draw to screen.
	  PotraceView.prototype.createSVG = function createSVG () {  
	    Potrace.clear();
	    Potrace.setParameter(this.controls.attributes);
	    Potrace.loadImageFromId('original-image');
	    Potrace.process(function(){
	      var svgdiv = document.getElementById('potrace-preview');
	      svgdiv.innerHTML = Potrace.getSVG(1, 'curve');
	    });
	  };

	  return PotraceView;
	}(BaseView));

	/**
	  * Three Controls model.
	  */

	var ThreeControls = (function (BaseModel$$1) {
	  function ThreeControls () {
	    BaseModel$$1.apply(this, arguments);
	  }

	  if ( BaseModel$$1 ) ThreeControls.__proto__ = BaseModel$$1;
	  ThreeControls.prototype = Object.create( BaseModel$$1 && BaseModel$$1.prototype );
	  ThreeControls.prototype.constructor = ThreeControls;

	  ThreeControls.prototype.defaults = function defaults () {
	    var controls = {
	      'Example 1': "#ffae23",
	      'Example 2': "#ae23ff",
	      'Example 3': "#23ffae"
	    };
	    
	    return controls;
	  };

	  return ThreeControls;
	}(BaseModel));

	/**
	  * Potrace view.
	  *
	  * Manages all UI elements relating to Potrace integration.
	  */

	var ThreeView = (function (BaseView$$1) {
	  function ThreeView() {
	    this.el = '#model-preview';
	    this.controls = new ThreeControls();
	    BaseView$$1.call(this);
	    this.render();
	  }

	  if ( BaseView$$1 ) ThreeView.__proto__ = BaseView$$1;
	  ThreeView.prototype = Object.create( BaseView$$1 && BaseView$$1.prototype );
	  ThreeView.prototype.constructor = ThreeView;

	  ThreeView.prototype.render = function render () {
	    var guiFolder = this.gui.addFolder('THREE.JS Controls');
	    guiFolder.addColor(this.controls.attributes, 'Example 1');
	    guiFolder.addColor(this.controls.attributes, 'Example 2');
	    guiFolder.addColor(this.controls.attributes, 'Example 3');

	    var _this = this;
	    $('#btnRender').click(function(){
	      _this.$el.html( '<div class="ui active centered inline loader"></div>' );
	      setTimeout(_this.createScene.bind(_this), 100);
	    });
	  };

	  ThreeView.prototype.createScene = function createScene () {
	    var scene = new THREE.Scene();
	    var width = this.$el.parent().innerWidth();
	    var height = 400;
	    var camera = new THREE.PerspectiveCamera( 50, width / height, 1, 100000 );
	    camera.position.set( 0, 0, 400 );
	    camera.lookAt( 0, 0, 0 );
	    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	    renderer.setPixelRatio( window.devicePixelRatio );
	    renderer.setSize( width, height );
	    this.$el.html( renderer.domElement );

	    var controls = new THREE.OrbitControls( camera, renderer.domElement );
	    function animate() {
	      requestAnimationFrame( animate );
	      render();
	    }
	    function render() {
	      controls.update();
	      renderer.render( scene, camera );
	    }

	    var extrudeAmount = 40;
	    // Load the potrace SVG using d3-threeD.
	    var group = new THREE.Group();
	    scene.add( group );
	    this.addGeoObject(group, {
	      paths: [$('#potrace-preview path').attr('d') + " Z"],
	      amounts: [ extrudeAmount ],
	      center: { x: width, y: height /2 }
	    });
	    group.scale.multiplyScalar(0.25);
	    group.position.setX(150);

	     // Load the imagetracejs SVG using experimental SVGLoader from three.js dev.
	    var loader = new THREE.SVGLoader();
	    var paths = loader.parse($('#svg-preview').html());
	    var group2 = new THREE.Group();
	    group2.scale.multiplyScalar( 0.25 );
	    for ( var i = 0; i < paths.length; i ++ ) {
	      var path = paths[ i ];
	      var shapes = path.toShapes( true );
	      for ( var j = 0; j < shapes.length; j ++ ) {
	        var color = new THREE.Color(Math.random() * 0xffffff);
	        var material = new THREE.MeshLambertMaterial( {
	          color: color,
	          emissive: color
	        } );
	        var simpleShape = shapes[ j ];
	        var shape3d = new THREE.ExtrudeBufferGeometry( simpleShape, {
	          amount: extrudeAmount * (Math.random() * 10),
	          bevelEnabled: false
	        } );

	        var center = { x: width, y: height /2 };

	        var mesh = new THREE.Mesh( shape3d, material );
	        mesh.rotation.x = Math.PI;
	        mesh.translateZ( - extrudeAmount - 1 );
	        mesh.translateX( - center.x );
	        mesh.translateY( - center.y );

	        group2.add( mesh );
	      }
	    }
	    group2.position.setX(-125);
	    scene.add( group2 );

	    var size = 2000;
	    var divisions = 100;
	    var gridColour = new THREE.Color(0xEFEFEF);

	    var gridHelper = new THREE.GridHelper( size, divisions, gridColour, gridColour );
	    gridHelper.position.setX(-712.5);
	    gridHelper.position.setZ(-500);
	    gridHelper.rotateX(Math.PI / 2);
	    gridHelper.rotateZ(-Math.PI / 4);
	    scene.add( gridHelper );

	    var gridHelper2 = new THREE.GridHelper( size, divisions, gridColour, gridColour );
	    gridHelper2.position.setX(712.5);
	    gridHelper2.position.setZ(-500);
	    gridHelper2.rotateX(Math.PI / 2);
	    gridHelper2.rotateZ(Math.PI / 4);
	    scene.add( gridHelper2 );

	    var axesHelper = new THREE.AxesHelper( 500 );
	    axesHelper.rotateY(-Math.PI / 4);
	    axesHelper.position.set(0, -100, -350);
	    scene.add( axesHelper );

	    animate();
	  };
	  
	  // Adds an object from an SVG.
	  ThreeView.prototype.addGeoObject = function addGeoObject ( group, svgObject ) {
	    var paths = svgObject.paths;
	    var amounts = svgObject.amounts;
	    var center = svgObject.center;

	    for ( var i = 0; i < paths.length; i ++ ) {
	      var path = $d3g.transformSVGPath( paths[ i ] );       
	      var amount = amounts[ i ];
	      var simpleShapes = path.toShapes( true );

	      for ( var j = 0; j < simpleShapes.length; j ++ ) {
	        var color = new THREE.Color(Math.random() * 0xffffff);
	        var material = new THREE.MeshLambertMaterial( {
	          color: color,
	          emissive: color
	        } );
	        var simpleShape = simpleShapes[ j ];
	        var shape3d = new THREE.ExtrudeBufferGeometry( simpleShape, {
	          amount: amount * (Math.random() * 10),
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
	  };

	  return ThreeView;
	}(BaseView));

	/**
	 * Manifold Browser Application
	 */
	$(function() {
	  var itv = new ImageTracerView();
	  console.log(itv);

	  var ptv = new PotraceView();
	  console.log(ptv);

	  var ttv = new ThreeView();
	  console.log(ttv);
	});

}(Backbone,dat,ImageTracer,Potrace,jQuery,THREE,$d3g));
