var min_palette_scalingPower_Value =  0.1 ;
var max_palette_scalingPower_Value = 10.0 ;
var marginL_palette_scalingPower = 15 ;
var marginR_palette_scalingPower = 15 ;
var marginT_palette_scalingPower = 15 ;
var marginB_palette_scalingPower =  5 ;
var nPoints_palette_scalingPower =  8 ;

var min_palette_periodicity_Value =  0.1 ;
var max_palette_periodicity_Value = 100.0 ;
var marginL_palette_periodicity = 15 ;
var marginR_palette_periodicity = 15 ;
var marginT_palette_periodicity = 15 ;
var marginB_palette_periodicity =  5 ;
var nPoints_palette_periodicity = 12 ;

var palettes = new Array() ;
function color_stop_object(fraction, red, green, blue){
  this.f = fraction ;
  this.r = red ;
  this.g = green ;
  this.b = blue ;
}
function palette_object(name){
  this.name = name ;
  this.canvas  = null ;
  this.context = null ;
  this.color_stops = [] ;
  this.add_color_stop = function(stop){
    this.color_stops.push(stop) ;
  }
  this.get_rgb = function(f){
    var color = 'rgb(0,0,0)' ;
    if(this.color_stops.length<2) return color ;
    for(var i=0 ; i<this.color_stops.length-1 ; i++){
      var s1 = this.color_stops[i+0] ;
      var s2 = this.color_stops[i+1] ;
      if(f<s1.f || f>s2.f) continue ;
      var d = (f-s1.f)/(s2.f-s1.f) ;
      var r = Math.round(s1.r + d*(s2.r-s1.r)) ;
      var g = Math.round(s1.g + d*(s2.g-s1.g)) ;
      var b = Math.round(s1.b + d*(s2.b-s1.b)) ;
      var rgb = [r,g,b] ;
      return rgb ;
    }
  }
  this.get_color = function(f){
    var rgb = this.get_rgb(f) ;
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')' ;
  }
  this.make_canvas = function(index){
    var canvas  = Create('canvas') ;
    var context = canvas.getContext('2d') ;
    var w = 375 ;
    var h =  20 ;
    canvas.width  = w ;
    canvas.height = h ;
    for(var i=0 ; i<w ; i++){
      var f = i/w ;
      var color = this.get_color(f) ;
      context.fillStyle = color ;
      context.fillRect(i,0,1,h) ;
    }
    canvas.id = 'canvas_palette_' + index ;
    canvas.title = this.name ;
    canvas.addEventListener('click', update_palette) ;
    canvas.className = 'palette' ;
    this.canvas  = canvas  ;
    this.context = context ;
    return canvas ;
  }
}

function update_palette(e){
  var id = e.target.id ;
  V['palette'].value = parseInt(id.split('_')[2]) ;
  update_coords_table() ;
  update_url() ;
  update_history() ;
  redraw_pixels() ;
  fill_progress_bar(1) ;
}

function draw_palette_preview(){
  var canvas = Get('canvas_palette_preview') ;
  var context = canvas.getContext('2d') ;
  var width  = canvas.width  ;
  var height = canvas.height ;
  var df = 1/width ;
  var palette = palettes[V['palette'].value] ;
  context.fillStyle = get_color(0, V, false) ;
  context.fillRect(0, 0, width, height) ;
  var fraction = 1.0 ;
  for(var f=0 ; f<fraction ; f+=df){
    context.fillStyle = get_color(f, V) ;
    context.fillRect(f*width, 0, Math.max(1,df), 50) ;
  }
}
function draw_palette_scalingPower(){
  var canvas = Get('canvas_palette_scalingPower') ;
  var context = canvas.getContext('2d') ;
  var width  = canvas.width  ;
  var height = canvas.height ;
  context.fillStyle = 'rgb(255,255,255)' ;
  context.fillRect(0,0,width,height) ;
  
  var minValue = min_palette_scalingPower_Value ;
  var maxValue = max_palette_scalingPower_Value ;
  
  var ml = marginL_palette_scalingPower ;
  var mr = marginR_palette_scalingPower ;
  var mb = marginB_palette_scalingPower ;
  var mt = marginT_palette_scalingPower ;
  var n  = nPoints_palette_scalingPower ;
  var tick = 0.5*mb ;
  context.fillStyle = 'rgb(0,0,0)' ;
  context.textBaseline = 'middle' ;
  context.textAlign = 'center' ;
  context.fillRect(ml,mt,width-ml-mr,height-mb-mt) ;
  
  context.font = 0.75*mt + 'px arial' ;
  var dPower = (Math.log(maxValue)-Math.log(minValue))/(n*Math.log(10)) ;
  for(var i=0 ; i<=n ; ++i){
    var value = minValue*Math.pow(10,i*dPower) ;
    var x = ml + (width-ml-mr)*i/n ;
    context.fillText(value.toPrecision(2),x,0.5*mt) ;
    
    context.beginPath() ;
    context.moveTo(x, mt-tick) ;
    context.lineTo(x, height-mb+tick) ;
    context.stroke() ;
  }
  
  var x = ml + (width-ml-mr)*transform_palette_scalingPower_in(V['palette_scalingPower'].value) ;
  var y = mt+0.5*(height-mt-mb) ;
  context.beginPath() ;
  context.arc(x, y, mb, 0, 2*Math.PI, true) ;
  context.fill() ;
}
function transform_palette_scalingPower_in(value){
  var min = min_palette_scalingPower_Value ;
  var max = max_palette_scalingPower_Value ;
  return Math.log(value/min)/Math.log(max/min) ;
}
function transform_palette_scalingPower_out(value){
  var min = min_palette_scalingPower_Value ;
  var max = max_palette_scalingPower_Value ;
  return min*Math.pow(max/min,value) ;
}
function mousedown_canvas_palette_scalingPower(e){
  palette_scalingPower_active = true ;
}
function mousemove_canvas_palette_scalingPower(e){
  if(palette_scalingPower_active==false) return ;
  mouse_canvas_palette_scalingPower_update(e) ;
  update_coords_table() ;
}
function mouseout_canvas_palette_scalingPower(e){
  if(palette_scalingPower_active==false) return ;
  mouseup_canvas_palette_scalingPower(e) ;
}
function mouse_canvas_palette_scalingPower_update(e){
  var XY = get_mouse_xy_tabled(e) ;
  var ml = marginL_palette_scalingPower ;
  var mr = marginR_palette_scalingPower ;
  var w  = Get('canvas_palette_scalingPower').width ;
  var f  = (XY[0]-ml)/(w-ml-mr) ;
  var value = transform_palette_scalingPower_out(f) ;
  if(value<min_palette_scalingPower_Value || value>max_palette_scalingPower_Value) return ;
  V['palette_scalingPower'].value = value ;
  draw_palette_scalingPower() ;
  draw_palette_preview() ;
}
function mouseup_canvas_palette_scalingPower(e){
  if(palette_scalingPower_active==false) return ;
  palette_scalingPower_active = false ;
  mouse_canvas_palette_scalingPower_update(e) ;
  draw_palette_scalingPower() ;
  update_coords_table() ;
  redraw_pixels() ;
}



function draw_palette_periodicity(){
  var canvas = Get('canvas_palette_periodicity') ;
  var context = canvas.getContext('2d') ;
  var width  = canvas.width  ;
  var height = canvas.height ;
  context.fillStyle = 'rgb(255,255,255)' ;
  context.fillRect(0,0,width,height) ;
  
  var minValue = min_palette_periodicity_Value ;
  var maxValue = max_palette_periodicity_Value ;
  
  var ml = marginL_palette_periodicity ;
  var mr = marginR_palette_periodicity ;
  var mb = marginB_palette_periodicity ;
  var mt = marginT_palette_periodicity ;
  var n  = nPoints_palette_periodicity ;
  var tick = 0.5*mb ;
  context.fillStyle = 'rgb(0,0,0)' ;
  context.textBaseline = 'middle' ;
  context.textAlign = 'center' ;
  context.fillRect(ml,mt,width-ml-mr,height-mb-mt) ;
  
  context.font = 0.75*mt + 'px arial' ;
  var dPower = (Math.log(maxValue)-Math.log(minValue))/(n*Math.log(10)) ;
  for(var i=0 ; i<=n ; ++i){
    var value = minValue*Math.pow(10,i*dPower) ;
    var x = ml + (width-ml-mr)*i/n ;
    context.fillText(value.toPrecision(3),x,0.5*mt) ;
    
    context.beginPath() ;
    context.moveTo(x, mt-tick) ;
    context.lineTo(x, height-mb+tick) ;
    context.stroke() ;
  }
  
  var x = ml + (width-ml-mr)*transform_palette_periodicity_in(V['palette_periodicity'].value) ;
  var y = mt+0.5*(height-mt-mb) ;
  context.beginPath() ;
  context.arc(x, y, mb, 0, 2*Math.PI, true) ;
  context.fill() ;
}
function transform_palette_periodicity_in(value){
  var min = min_palette_periodicity_Value ;
  var max = max_palette_periodicity_Value ;
  return Math.log(value/min)/Math.log(max/min) ;
}
function transform_palette_periodicity_out(value){
  var min = min_palette_periodicity_Value ;
  var max = max_palette_periodicity_Value ;
  return min*Math.pow(max/min,value) ;
}
function mousedown_canvas_palette_periodicity(e){
  palette_periodicity_active = true ;
}
function mousemove_canvas_palette_periodicity(e){
  if(palette_periodicity_active==false) return ;
  mouse_canvas_palette_periodicity_update(e) ;
  update_coords_table() ;
}
function mouseout_canvas_palette_periodicity(e){
  if(palette_periodicity_active==false) return ;
  mouseup_canvas_palette_periodicity(e) ;
}
function mouse_canvas_palette_periodicity_update(e){
  var XY = get_mouse_xy_tabled(e) ;
  var ml = marginL_palette_periodicity ;
  var mr = marginR_palette_periodicity ;
  var w  = Get('canvas_palette_periodicity').width ;
  var f  = (XY[0]-ml)/(w-ml-mr) ;
  var value = transform_palette_periodicity_out(f) ;
  if(value<min_palette_periodicity_Value || value>max_palette_periodicity_Value) return ;
  V['palette_periodicity'].value = value ;
  draw_palette_periodicity() ;
  draw_palette_preview() ;
}
function mouseup_canvas_palette_periodicity(e){
  if(palette_periodicity_active==false) return ;
  palette_periodicity_active = false ;
  mouse_canvas_palette_periodicity_update(e) ;
  draw_palette_periodicity() ;
  update_coords_table() ;
  redraw_pixels() ;
}

function make_palette_table(){
  var tr, td ;
  var tbody = Get('tbody_palette') ;
  for(var i=0 ; i<palettes.length ; i+=2){
    tr = Create('tr') ;
    td = Create('td') ;
    td.className = 'palette' ;
    td.appendChild(palettes[i].make_canvas(i+0)) ;
    tr.appendChild(td) ;

    td = Create('td') ;
    td.className = 'palette' ;
    if(i+1<palettes.length){
      td.appendChild(palettes[i+1].make_canvas(i+1)) ;
    }
    tr.appendChild(td) ;

    tbody.appendChild(tr) ;
  }
}

