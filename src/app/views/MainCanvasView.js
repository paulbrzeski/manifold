import _ from '_';
import $ from 'jQuery';
import fabric from 'fabric';
import BaseView from './BaseView.js';
import defaultMenu from '../../templates/toolbar/default.pug';
import addImageItem from '../../templates/toolbar/add-image__item.pug';
import addShapes from '../../templates/toolbar/add-shapes.pug';

/**
  * MainCanvas view.
  */

export default class MainCanvasView extends BaseView {
  constructor(options) {
    super({
      el: '#main-canvas',
      model: options.model
    });

    // Initial image
    var callback = function(svg) {
      // this.model.loadSVG(svg, callback);
      app.views.threeCanvas.createScene(svg);
      var threeD = new fabric.Image($(app.views.threeCanvas.el).find('canvas')[0]);
      threeD.left = 0;
      threeD.top = 0;
      this.model.addToCenter(threeD);
    }.bind(this);
    this.model.potrace.createSVG($('#original-image').attr('src'), callback);

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

    $(window).on('resize', () => {
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

  setupDefaultMenu() {
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
    $('#btnToggle3DPreview')
      .popup({
        title: 'Toggle 3D Preview',
        position: 'right center'
      })
      .on('click', function(){
        $(this).find('i.icon').toggleClass('disabled');
        $('#model-preview-container').toggle();
      });

  }

  setupAddShapesMenu() {
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
  }

  toggleToolbar() {
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
  }
}
