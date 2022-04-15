/*************************************************************
 * This script is developed by Arturs Sosins aka ar2rsawseen, http://webcodingeasy.com
 * Feel free to distribute and modify code, but keep reference to its creator
 *
 * Spotlight class creates a spotlight like visual cue to 
 * concentrate visitors attention to specific elements
 *
 * For more information, examples and online documentation visit: 
 * http://webcodingeasy.com/JS-classes/Javascript-Spotlight-visual-cue
**************************************************************/
var spotlight = function(config){
	
	var conf = {
		bgColor: "rgba(0,0,0,0.9)",
		lightStart: 0,
		lightEnd: 0.2,
		size: 300,
		blurRadius: 20,
		interval: 10,
		steps: 50,
		zIndex: 100,
		onMouseOver: null,
		onMouseOut: null,
		onSpotClick: null,
		onCanvasClick: null,
		onAnimationStart: null,
		onAnimationEnd: null
	};
	
	var d, ctx, current = {}, target = {}, step = {}; 
	current.x = 0, current.y = 0, current.r = 0, current.blur = 0, 
	target.x = 0, target.y = 0, target.r = 0, target.blur = 0,
	step.x = 0, step.y = 0, step.r = 0, step.blur = 0;
	
	var construct = function(){
		//get document dimensions
		d = doc_size();
		//copying configuration
		for(var opt in config){
			conf[opt] = config[opt];
		}
		
		current.r = conf.size;
		target.r = conf.size;
		current.blur = conf.blurRadius;
		target.blur = conf.blurRadius;
		var canvas;
		
		//get or create canvas
		if(document.getElementById("spotlight_canvas"))
		{
			canvas = document.getElementById("spotlight_canvas");
			ctx = canvas.getContext("2d");
		}
		else
		{
			//create canvas for drawing
			canvas = document.createElement("canvas");
			canvas.setAttribute("width", d.width + "px");
			canvas.setAttribute("height", d.height + "px");
			canvas.style.position = "absolute";
			canvas.style.top = "0px";
			canvas.style.left = "0px";
			canvas.style.zIndex = conf.zIndex;
			canvas.id = "spotlight_canvas";
			ctx = canvas.getContext("2d");
			document.body.appendChild(canvas);
		}
		//add click events if needed
		if(conf.onCanvasClick || conf.onSpotClick)
		{
			add_event(canvas, "click", function(e){
				e = get_page_coord(e);
				//determine if cursor is inside spotlight
				if(((e.pageX-current.x)*(e.pageX-current.x)) + ((e.pageY-current.y)*(e.pageY-current.y)) <= current.r*current.r)
				{
					if(conf.onSpotClick)
					{
						conf.onSpotClick(e);
					}
				}
				else
				{
					if(conf.onCanvasClick)
					{
						conf.onCanvasClick(e);
					}
				}
			});
		}
		//add move events if needed
		if(conf.onMouseOver || conf.onMouseOut)
		{
			add_event(canvas, "mousemove", function(e){
				e = get_page_coord(e);
				//determine if cursor is inside spotlight
				if(((e.pageX-current.x)*(e.pageX-current.x)) + ((e.pageY-current.y)*(e.pageY-current.y)) <= current.r*current.r)
				{
					if(conf.onMouseOver)
					{
						conf.onMouseOver(e);
					}
				}
				else
				{
					if(conf.onMouseOut)
					{
						conf.onMouseOut(e);
					}
				}
			});
		}
	};
	
	//show spotlight at specified position
	this.show = function(x, y, r){
		show(x, y, r);
	};
	
	//hide spotlight
	this.hide = function(){
		hide();
	};
	
	//animate spotlight
	this.animate = function(x, y, r, blur, steps){
		target.x = x;
		target.y = y;
		target.r = r;
		target.blur = blur;
		steps = (steps) ? steps : conf.steps;
		step.x = Math.abs(target.x-current.x)/steps;
		step.y = Math.abs(target.y-current.y)/steps;
		step.r = Math.abs(target.r-current.r)/steps;
		step.blur = Math.abs(target.blur-current.blur)/steps;
		if(conf.onAnimationStart)
		{
			conf.onAnimationStart();
		}
		anim();
	};
	
	//animate movement of spotlight
	this.move = function(x,y){
		this.animate(x, y, current.r, current.blur);
	};
	
	//animate changing size of spotlight
	this.resize = function(r){
		this.animate(current.x, current.y, r, current.blur);
	};
	
	//animate blur of spotlight
	this.blur = function(blur){
		this.animate(current.x, current.y, current.r, blur);
	};
	
	//change background color
	this.changeBgColor = function(bgcolor){
		conf.bgColor = bgcolor;
		show(current.x, current.y);
	};
	
	//change spot opacity
	this.changeSpot = function(startOpacity, endOpacity){
		conf.lightStart = startOpacity;
		conf.lightEnd = endOpacity;
		show(current.x, current.y);
	};
	
	//set amount of animation steps	
	this.animationSpeed = function(steps, interval){
		conf.steps = steps;
		conf.interval = interval;
	};
	
	//animate spotlight
	var anim = function(){
		var change = false;
		
		change = check_property("x", change);
		change = check_property("y", change);
		change = check_property("r", change);
		change = check_property("blur", change);
		
		show(current.x, current.y, current.r, current.blur);
		
		if(change)
		{
			setTimeout(anim, conf.interval);
		}
		else
		{
			if(conf.onAnimationEnd)
			{
				conf.onAnimationEnd();
			}
		}
	};
	
	//check properties, that needs to be animated
	var check_property = function(prop, change){
		if(current[prop] > target[prop])
		{
			current[prop] -= step[prop];
			change = true;
		}
		else if(current[prop] < target[prop])
		{
			current[prop] += step[prop];
			change = true;
		}
		if(current[prop] > target[prop] - step[prop] && current[prop] < target[prop] + step[prop])
		{
			current[prop] = target[prop];
		}
		return change;
	};
	
	//hide spotlight
	var hide = function(){
		ctx.globalCompositeOperation = "source-over";
		ctx.clearRect(0, 0, d.width, d.height);
		ctx.fillStyle = conf.bgColor;
		ctx.fillRect(0, 0, d.width, d.height);
	};
	
	//show spotlight
	var show = function(x, y, r, blur){
		hide();
		current.x = x;
		current.y = y;
		r = (r) ? r : current.r;
		current.r = r;
		blur = (blur) ? blur : current.blur;
		current.blur = blur;
		var totalSize = r + blur;
		var radgrad = ctx.createRadialGradient(x, y, 0, x, y, totalSize);
		radgrad.addColorStop(0, "rgba(0,0,0," + (1-conf.lightStart)+")");
		radgrad.addColorStop(r/totalSize, "rgba(0,0,0," + (1-conf.lightEnd)+")");
		radgrad.addColorStop(1, "rgba(0,0,0,0)");
		ctx.globalCompositeOperation = "destination-out";
		ctx.fillStyle = radgrad;
		ctx.beginPath();  
		ctx.arc(x, y, totalSize, 0, Math.PI*2);
		ctx.fill();  
	};
	
	//get document dimensions
	var doc_size = function(){
		var docsize = new Object();
		docsize.width = 0;
		docsize.height = 0;
		docsize.width = Math.max(
			Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
			Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
			Math.max(document.body.clientWidth, document.documentElement.clientWidth)
		);
		docsize.height = Math.max(
			Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
			Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
			Math.max(document.body.clientHeight, document.documentElement.clientHeight)
		);
		return docsize;
	};
	
	//add event
	var add_event = function(element, type, listener){
		if(element.addEventListener)
		{
			element.addEventListener(type, listener, false);
		}
		else
		{
			element.attachEvent('on' +  type, listener);
		}
	};
	
	//get cursor coordinates on page
	var get_page_coord = function(e){
		//checking if pageY and pageX is already available
		if (typeof e.pageY == 'undefined' &&  
			typeof e.clientX == 'number' && 
			document.documentElement)
		{
			//if not, then add scrolling positions
			e.pageX = e.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
			e.pageY = e.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
		};
		//return e which now contains pageX and pageY attributes
		return e;
	};
	
	construct();
}