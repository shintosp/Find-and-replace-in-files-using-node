rrequire(["jquery"],function(){$.widget("cms.canvasbg",{_create:function(){var canvasbg=this.options.canvasbg||this.element.attr("data-canvasbg"),fn=canvasbg&&$.cms.canvasbg.animations[canvasbg];if($.isFunction(fn)){this.animation=fn}else{return}if(this.element.css("position")==="static"){this.element.css({position:"relative"})}this.canvas=this.element.prepend('<canvas aria-role="background"></canvas>').children("canvas").css({position:"absolute",width:"100%",height:"100%"});this.ctx=this.canvas[0].getContext("2d");this.animation.call(this);this._resize=this.resize.bind(this);$(window).on("resize",this._resize)},init:function(){},start:function(){},stop:function(){},cleanup:function(){},dim:function(bounds){return{left:0,top:0,width:bounds.width,height:bounds.height}},resize:function(){var bounds=this.element[0].getBoundingClientRect(),dim=this.dim(bounds);dim.width=Make.Int(dim.width);dim.height=Make.Int(dim.height);this.area={top:0,right:dim.width,bottom:dim.height,left:0,width:dim.width,height:dim.height};this.canvas.prop("width",dim.width);this.canvas.prop("height",dim.height);this.canvas.css(dim);this.init()},_destroy:function(){this.stop();this.cleanup();if(this.canvas){this.canvas.remove()}$(window).off("resize",this._resize)}});$.cms.canvasbg.animations={};if(window.register){window.register("a/canvasbg")}});