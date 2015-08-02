var canvas_explorer       ;
var canavs_computation    ;
var context_explorer      ;
var context_computation   ;
var canvas_special_image  ;
var context_special_image ;
var canvas_special_image_progress  ;
var context_special_image_progress ;

var gallery_entries = [] ;

var force_recalculate = true ;
var dataImage_fractal = 0 ;
var data_fractal = 0 ;
var delay = 10 ;
var pixels = [] ;

var kill_special_image = false ;
var VSI = duplicate_variables(V) ;
var special_image_pixel_queue = [] ;
var special_image_queue_position = 0 ;

var stage = 0 ;
var nStages = 4 ;
var pixel_queue = [] ;
var queue_position = 0 ;
var kill_queue = false ;
var gallery_counter = 0 ;

var progress_bar_width  = 600 ;
var progress_bar_height =  50 ;

function pixel_object(x0, y0, u, v){
  this.u = u ;
  this.v = v ;
  this.x0 = x0 ;
  this.y0 = y0 ;
  this.x = this.x0 ;
  this.y = this.y0 ;
  this.nIterations = 0 ;
  this.color = 'rgb(0,0,0)' ;
  this.done = false ;
  this.d2_down = 1e6 ;
  this.d2_up   = 1e6 ;
  this.antialiasNIterations = 1 ;
  this.stripeAverageNIterations = 1 ;
  this.reset_coords = function(x0, y0, u, v, preserveDone){
    this.x0 = x0 ;
    this.y0 = y0 ;
    this.u  =  u ;
    this.v  =  v ;
    this.x = this.x0 ;
    this.y = this.y0 ;
    this.nIterations = 0 ;
    this.done = (preserveDone && this.done) ;
  }
  this.set_color = function(Vars){
    var iterations = (Vars['antialias']) ? this.antialiasNIterations : this.nIterations ;
    if(Vars['stripeAverage'].value) iterations = this.stripeAverageNIterations ;
    var f = (iterations-Vars['iMin'].value)/(Vars['iMax'].value-Vars['iMin'].value) ;
    this.color = get_color(f, Vars, false) ;
    return ;
  }
  this.set_rgb = function(Vars){
    var iterations = (Vars['antialias']) ? this.antialiasNIterations : this.nIterations ;
    if(Vars['stripeAverage'].value) iterations = this.stripeAverageNIterations ;
    if(this.d) iterations = this.nIterations + this.d/100 ;
    
    var f = (iterations-Vars['iMin'].value)/(Vars['iMax'].value-Vars['iMin'].value) ;
    this.rgb = get_rgb(f, Vars, false) ;
    return ;
  }
}
function get_rgb(f, Vars, use_defaults){
  // Limit range [0,1]
  f = Math.max(0.0, Math.min(1.0, f)) ;
  
  if(use_defaults){ return palettes[0].get_rgb(f) ; }
  
  if(Math.abs(f-1.0)<1e-6) return palettes[Vars['palette'].value].get_rgb(f) ; 
  
  // Perform transformations
  f = Math.pow(f,Vars['palette_scalingPower'].value) ;
  var g = f*Vars['palette_periodicity'].value ;
  f = (Math.floor(g)%2==0) ? g%1 : 1-g%1 ;
  
  return palettes[Vars['palette'].value].get_rgb(f) ; 
}
function get_color(f, Vars, use_defaults){
  var rgb = get_rgb(f, Vars, use_defaults) ;
  return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')' ;
}
function iterate_pixel(pixel, Vars){
  if(pixel.done){
    return ;
  }
  var x0 = pixel.x0 ;
  var y0 = pixel.y0 ;
  var x1 = x0 ;
  var y1 = y0 ;
  var x2 = x0 ;
  var y2 = y0 ;
  if(Vars['mode'].value==1){
    x0 = Vars['Jx'].value ;
    y0 = Vars['Jy'].value ;
  }
  var i = 0 ;
  var sps = [] ;
  var points = [] ;
  switch(Vars['mode'].value){
  case 2:
	var fail = false ;
	var q = (x0-0.25)*(x0-0.25)+y0*y0 ;
	if(q*(q+x0-0.25)<0.25*y0*y0  ) fail = true ; // Main cardioid
	if(((x0+1)*(x0+1)+y0*y0)*16<1) fail = true ; // Second bulb
	if(fail){
	  i = Vars['iMax'].value ;
	  break ;
	}
  case 1:
    for(; i<Vars['iMax'].value ; i++){
      x2 = x0 + x1*x1 - y1*y1 ;
      y2 = y0 + 2*x1*y1       ;
      x1 = x2 ;
      y1 = y2 ;
      sps.push(0.5*(1+sin(V['stripeDensity'].value*atan2(y1, x1)/pow(2,i)))) ;
      if(sps.length>20) sps.splice(0,1) ;
      if(sqrt(x2*x2+y2*y2)>V['bailout'].value){
        pixel.done = true ;
        break ;
      }
    }
    break ;
  case 101: // Offset Mandelbrot and Julia
  case 102:
    for(; i<Vars['iMax'].value ; i++){
      x2 = x0 + x1*x1 - y1*y1 + x1 ;
      y2 = y0 + 2*x1*y1       + y1 ;
      if(sqrt(x2*x2+y2*y2)>V['bailout'].value){
        pixel.done = true ;
        break ;
      }
      x1 = x2 ;
      y1 = y2 ;
    }
    break ;
  case 1002: // sin
    var d = 1 ;
    var Jx = Vars['Jx'].value ;
    var Jy = Vars['Jy'].value ;
    for(; i<Vars['iMax'].value ; i++){
      var e1 = exp( y1) ;
      var e2 = exp(-y1) ;
      var x3 = sin(x1)*0.5*(e1+e2) ;
      var y3 = cos(x1)*0.5*(e1-e2) ;
      x2 = Jx*x3 - Jy*y3 ;
      y2 = Jx*y3 + Jy*x3 ;
      d = sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)) ;
      if(abs(y2)>500){
        pixel.done = true ;
        pixel.d = d ;
        break ;
      }
      x1 = x2 ;
      y1 = y2 ;
    }
    
    pixel.d = d ;
    break ;
  case 3:
    for(; i<Vars['iMax'].value ; i++){
      x2 = x0 + x1*x1*x1 - 3*x1*y1*y1 ;
      y2 = y0 - y1*y1*y1 + 3*x1*x1*y1 ;
      x1 = x2 ;
      y1 = y2 ;
      if(sqrt(x2*x2+y2*y2)>V['bailout'].value){
        pixel.done = true ;
        break ;
      }
    }
    break ;
  case 999: // z -> z^(1.99) + c
    for(; i<Vars['iMax'].value ; i++){
      var p = 9.0 ;
      var r = sqrt(x1*x1+y1*y1) ;
      var t = atan2(y1,x1) ;
      r = pow(r,p) ;
      t = p*t ;
      x2 = r*cos(t) + x0 ;
      y2 = r*sin(t) + y0 ;
      if(sqrt(x2*x2+y2*y2)>V['bailout'].value){
        pixel.done = true ;
        break ;
      }
      x1 = x2 ;
      y1 = y2 ;
    }
    break ;
  }
  pixel.x = x1 ;
  pixel.y = y1 ;
  pixel.nIterations = i ;
  var modZ = sqrt(pixel.x*pixel.x+pixel.y*pixel.y) ;
  var nu = log(log(modZ)/log(V['bailout'].value))/log(V['bailout'].value) ;
  var iMax = Vars['iMax'].value ;
  pixel.antialiasNIterations = (i>=iMax) ? pixel.nIterations : pixel.nIterations+1-nu ;
  
  var stripeParameter = 0 ;
  for(var i=0 ; i<sps.length-3 ; ++i){ stripeParameter += sps[i] ; }
  stripeParameter /= (sps.length-3) ;
  var offset = 1 ;
  var d  = 1-nu ;
  stripeParameter = d*sps[sps.length-offset-1] + (1-d)*sps[sps.length-offset-2] ;
  
  // Use splines!
  if(sps.length>=7 && false){
    var S = [] ;
    var n = 10 ;
    for(var j=0 ; j<4 ; ++j){
      S.push(0) ;
      for(var k=0 ; k<n ; ++k){
        S[j] += sps[sps.length-1-j-k] ;
      }
    }
    
    // Reticulating splines
    var d2 = pow(d,2) ;
    var d3 = pow(d,3) ;
    var H = [] ;
    H.push(0.5*(    -d2+  d3)) ;
    H.push(0.5*( d+4*d2-3*d3)) ;
    H.push(0.5*( 2-5*d2+3*d3)) ;
    H.push(0.5*(-d+2*d2-  d3)) ;
    
    stripeParameter = H[0]*S[0] + H[1]*S[1] + H[2]*S[2] + H[3]*S[3] ;
  }
  pixel.stripeAverageNIterations = iMax*stripeParameter/pixel.nIterations ;
}

function start(){
  V = variable_inheritance(V,VURI) ;
  
  // Create pixels
  pixels = [] ;
  for(var u=0 ; u<V['w'].value ; u++){
    pixels.push([]) ;
    for(var v=0 ; v<V['h'].value ; v++){
      pixels[u].push(new pixel_object(0,0,0,0)) ;
    }
  }
  
  canvas_explorer       = Get('canvas_explorer') ;
  canavs_computation    = Get('canvas_computation') ;
  canvas_special_image  = Get('canvas_special_image') ;
  canvas_special_image_progress  = Get('canvas_special_image_progress') ;
  context_explorer      = canvas_explorer.getContext('2d') ;
  context_computation   = canvas_computation.getContext('2d') ;
  context_special_image = canvas_special_image.getContext('2d') ;
  context_special_image_progress = canvas_special_image_progress.getContext('2d') ;
  
  context_explorer     .translate(0.5,0.5) ;
  context_computation  .translate(0.5,0.5) ;
  context_special_image.translate(0.5,0.5) ;
  context_special_image_progress.translate(0.5,0.5) ;
  Get('canvas_palette_scalingPower').getContext('2d').translate(0.5,0.5) ;
  
  var w = V['w'].value ;
  var h = V['h'].value ;
  canvas_explorer   .width  = w ;
  canvas_explorer   .height = h ;
  canavs_computation.width  = w ;
  canavs_computation.height = h ;
  
  canvas_explorer   .style.width  = w ;
  canvas_explorer   .style.height = h ;
  canavs_computation.style.width  = w ;
  canavs_computation.style.height = h ;
  
  dataImage_fractal = context_computation.createImageData(1,1) ;
  data_fractal      = dataImage_fractal.data ;
  data_fractal[3] = 1 ;
  
  add_eventListeners() ;
  
  draw_palette_preview() ;
  draw_palette_scalingPower() ;
  draw_palette_periodicity() ;
  make_palette_table() ;

  update_all() ;
  
  prepare_gallery_table() ;
  draw_next_gallery_fractal() ;
}

function add_eventListeners(){
  document.addEventListener('keydown', keyDown, false) ;
  Get('submit_change_settings').addEventListener('click', change_settings, false) ;
  Get('submit_generate_julia' ).addEventListener('click', generate_julia , false) ;
  Get('submit_centre'         ).addEventListener('click', centre_00      , false) ;
  Get('submit_generate_special_image').addEventListener('click', generate_special_image, false) ;
  if(Get('submit_add_to_gallery')) Get('submit_add_to_gallery').addEventListener('click', add_to_gallery, false) ;
  
  canvas_explorer.addEventListener('click'    , canvas_fractal_click     , false) ;
  canvas_explorer.addEventListener('mousemove', canvas_fractal_mousemove , false) ;
  canvas_explorer.addEventListener('mouseout' , canvas_fractal_mouseout  , false) ;
  
  canvas_palette_scalingPower.addEventListener('mousedown' , mousedown_canvas_palette_scalingPower, false) ;
  canvas_palette_scalingPower.addEventListener('mousemove' , mousemove_canvas_palette_scalingPower, false) ;
  canvas_palette_scalingPower.addEventListener('mouseup'   , mouseup_canvas_palette_scalingPower  , false) ;
  canvas_palette_scalingPower.addEventListener('mouseout'  , mouseout_canvas_palette_scalingPower , false) ;
  
  canvas_palette_periodicity. addEventListener('mousedown' , mousedown_canvas_palette_periodicity , false) ;
  canvas_palette_periodicity. addEventListener('mousemove' , mousemove_canvas_palette_periodicity , false) ;
  canvas_palette_periodicity. addEventListener('mouseup'   , mouseup_canvas_palette_periodicity   , false) ;
  canvas_palette_periodicity. addEventListener('mouseout'  , mouseout_canvas_palette_periodicity  , false) ;
  
  Get('submit_toggle_description').addEventListener('click', toggle_description, false) ;
  
  for(var key in V){
    if(Get('input_'+key)) Get('input_'+key).addEventListener('change', check_variable_change, false) ;
  }
}

function draw_next_gallery_fractal(){
  if(gallery_counter==gallery_entries.length) return ;
  make_gallery(gallery_counter) ;
  window.setTimeout(draw_next_gallery_fractal, delay) ;
  gallery_counter++ ;
}
function redraw_pixels(){
  Get('span_palette_wait').innerHTML = 'Working... ' ;
  window.setTimeout(do_redraw_pixels, 100) ;
}
function do_redraw_pixels(){
  for(var u=0 ; u<V['w'].value ; u++){
    for(var v=0 ; v<V['h'].value ; v++){
      pixels[u][v].set_color(V) ;
      context_computation.fillStyle = pixels[u][v].color ;
      context_computation.fillRect(u,v,1,1) ;
    }
  }
  context_explorer.drawImage(canavs_computation, 0, 0) ;
  Get('span_palette_wait').innerHTML = '' ;
}

function update_all(){
  update_DXDY() ;
  update_coords_table() ;
  update_url() ;
  update_fraction() ;
  redraw_palette() ;
  update_canvae() ;
  update_history() ;
  update_julia_preview() ;
}
function update_DXDY(){
  DX = V['Dr'].value ;
  DY = V['Dr'].value ;
}
function update_canvae_stage(preserveDone){
  var w = V['w'].value ;
  var h = V['h'].value ;
  if(stage>nStages){
    // We're at the end, so flip all the pixels back to not done
    for(var u=0 ; u<w ; u++){
      for(var v=0 ; v<h ; v++){
        pixels[u][v].done = false ;
      }
    }
    return ;
  }
  
  // Add the relevant pixels to the next queue
  kill_queue = false ;
  pixel_queue = [] ;
  var size = Math.pow(3,nStages-stage) ;
  var offset = 0.5*(size-1) ;
  
  for(var v=offset ; v<h ; v+=size){
    var y = V['Cy'].value - 0.5*V['Dr'].value + DY*v/h ;
    for(var u=offset ; u<w ; u+=size){
      var x = V['Cx'].value - 0.5*V['Dr'].value + DX*u/w ;
      var p = pixels[u][v] ;
      p.reset_coords(x,y,u,v,preserveDone) ;
      pixel_queue.push(p) ;
    }
  }
  queue_position = 0 ;
  window.setTimeout(processs_queue, delay) ;
}
function processs_queue(){
  var size = Math.pow(3,nStages-stage) ;
  var offset = 0.5*(size-1) ;
  var time_0 = new Date().getTime() ;
  for(; queue_position<pixel_queue.length ; queue_position++){
    if(kill_queue){
      queue_position = pixel_queue.length ;
      return ;
    }
    if(new Date().getTime()-time_0>100 || queue_position==pixel_queue.length-1){
      var fraction = (1+queue_position)/pixel_queue.length ;
      var span_percent  = Get('span_progress_percent' ) ;
      span_percent.innerHTML = (100*fraction).toPrecision(3) + '%' ;
      var span_fraction = Get('span_progress_fraction') ;
      span_fraction.innerHTML  ='(' + (queue_position+1) + ' / ' + pixel_queue.length + ')' ;
      fill_progress_bar(fraction) ;
      context_explorer.drawImage(canavs_computation, 0, 0) ;
      draw_zoom_rectangle() ;
      break ;
    }
    var p = pixel_queue[queue_position] ;
    iterate_pixel(p, V) ;
    p.set_color(V) ;
    
    context_computation.fillStyle = p.color ;
    context_computation.fillRect(p.u-offset,p.v-offset,size,size) ;
    
    if(false){
      p.set_rgb(V) ;
      for(var k=0 ; k<3 ; k++){ data_fractal[k] = p.rgb[k] ; }
      context_computation.putImageData(dataImage_fractal, p.u, p.v) ;
    }
  }
  
  if(queue_position<pixel_queue.length-1){
    window.setTimeout(processs_queue, delay)
  }
  else{
    stage++ ;
    window.setTimeout(update_canvae_stage, delay) ;
  }
}
function fill_progress_bar(fraction){
  var canvas_progress = Get('canvas_progress') ;
  var context_progress = canvas_progress.getContext('2d') ;
  var width  = progress_bar_width  ;
  var height = progress_bar_height ;
  var df = 1/width ;
  var palette = palettes[V['palette'].value] ;
  context_progress.fillStyle = get_color(0, V, false) ;
  context_progress.fillRect(0, 0, width, height) ;
  context_progress.fillStyle = 'rgb(0,0,255)' ;
  context_progress.fillRect(0, 0, fraction*width, height) ;
}

function toggle_description(){
  var value = Get('submit_toggle_description'.value) ;
  if(value=='Hide'){
    Get('submit_toggle_description').value = 'Show' ;
    Get('div_description').style.display = '' ;
  }
  else{
    Get('submit_toggle_description').value = 'Hide' ;
    Get('div_description').style.display = 'none' ;
  }
}

function update_julia_preview(){
  var jCanvas = Get('canvas_julia_preview') ;
  var jContext = jCanvas.getContext('2d') ;
  var p = new pixel_object(-1, -1, -1, -1) ;
  var VJP = VJuliaPreview ;
  var w = VJP['w'].value ;
  var h = VJP['h'].value ;
  if(V['mode'].value==2){
    VJP['Jx'].value = V['Cx'].value ;
    VJP['Jy'].value = V['Cy'].value ;
  }
  var Dr = VJP['Dr'].value ;
  for(var i=0 ; i<w ; ++i){
    var x = VJP['Cx'].value-0.5*Dr + Dr*i/w ;
    for(var j=0 ; j<h ; ++j){
      var y = VJP['Cy'].value-0.5*Dr + Dr*j/h ;
      p.reset_coords(x, y, i, j, false) ;
      iterate_pixel(p, VJP) ;
      var f = p.nIterations/255.0 ;
      var color = get_color(f, VJP) ;
      jContext.fillStyle = color ;
      jContext.fillRect(i,j,1,1) ;
    }
  }
  if(VJP['mode'].value==2){
    var u = Math.round(w*(0.5 + (V['Jx'].value-VJP['Cx'].value)/VJP['Dr'].value)) ;
    var v = Math.round(h*(0.5 + (V['Jy'].value-VJP['Cy'].value)/VJP['Dr'].value)) ;
    jContext.beginPath() ;
    jContext.arc(u, v, 10, 0, 2*pi(), true) ;
    jContext.strokeStyle = 'rgb(255,255,255)' ;
    jContext.stroke() ;
  }
}
function update_canvae(){
  update_julia_preview() ;
  stage = 0 ;
  queue_position = 0 ;
  context_explorer.fillStyle = get_color(0, V) ;
  context_explorer.fillRect(0,0,V['w'].value,V['h'].value) ;
  update_canvae_stage() ;
}
function update_url(){
  var string = '' ;
  for(var key in V){
    string += key + '=' + V[key].value + '&' ;
  }
  Get('url').href = 'http://www.aidansean.com/mandelbrot/index.php?' + string ;
}
function update_fraction(){
  var f = V['Dr'].value*V['Dr'].value/(2*3.1415) ;
  if(f<0.99){
    var f_exp = f.toExponential(2) ;
    var string = '' + f_exp ;
    string = string.replace('e', '&times;10<sup>') ;
    string = string.replace('+', '') ;
    stirng = string + '</sup>' ;
    Get('span_fraction').innerHTML = string ;
  }
}
function update_coords_table(){
  for(var key in V){
    if(V[key].editable==0) continue ;
    if(key=='palette') continue ;
    if(Get('input_'+key)) Get('input_'+key).value = V[key].value ;
  }
  if(V['mode'].value==2 && false){
    V['Jx'].value = V['Cx'].value ;
    V['Jy'].value = V['Cy'].value ;
  }
}
function change_settings(){
  for(var key in V){
    if(V[key].editable==0) continue ;
    if(key=='mode'){
      V[key].value = Math.round(Get('input_mode').value) ;
    }
    else if(key=='iMin' || key=='iMax'){
      V[key].value = parseInt  (Get('input_'+key).value) ;
    }
    else{
      if(Get('input_'+key)) V[key].value = parseFloat(Get('input_'+key).value) ;
    }
  }
  update_all() ;
}

function generate_julia(){
  var Jx = V['Cx'].value ;
  var Jy = V['Cy'].value ;
  for(key in V){
    if(key=='w' || key=='h') continue ;
    V[key].reset() ;
  }
  V['Jx'].value = Jx ;
  V['Jy'].value = Jy ;
  V['Cx'].value = 0.0 ;
  V['Cy'].value = 0.0 ;
  
  if(V['mode'].value==2) V['mode'].value = 1 ;
  VJuliaPreview['mode'].value = 2 ;
  VJuliaPreview['Cx'  ].value = -0.8 ;
  VJuliaPreview['Cy'  ].value =  0.0 ;
  VJuliaPreview['Dr'  ].value =  3.0 ;
  update_all() ;
  Get('submit_generate_julia').style.display = 'none' ;
}
function centre_00(){
  V['Cx'].value = 0 ;
  V['Cy'].value = 0 ;
  update_all() ;
}
function check_variable_change(e){
  var id = e.target.id ;
  var vName = id.split('_')[1] ;
  if(V[vName].force_recalculate) force_recalculate = true ;
}

function generate_special_image(){
  var c = context_special_image_progress ;
  c.fillStyle = 'rgb(200,200,200)' ;
  c.fillRect(0,0,VSI['w'],VSI['h']) ;
  Get('img_special_image').src = canvas_special_image_progress.toDataURL() ;
  
  kill_special_image = true ;
  
  VSI = duplicate_variables(V) ;
  var option = Get('select_special_image').value ;
  VSI['w'].value = parseInt(option.split('x')[0]) ;
  VSI['h'].value = parseInt(option.split('x')[1]) ;
  if(Get('checkbox_custom_image').checked){
    VSI['w'].value = Math.max(1,parseInt(Get('input_custom_image_width' ).value)) ;
    VSI['h'].value = Math.max(1,parseInt(Get('input_custom_image_height').value)) ;
  }
  
  if(VSI['w'].value==0 || VSI['h'].value==0){
    VSI['w'].value = V['w'].value ;
    VSI['h'].value = V['h'].value ;
  }
  
  var w = VSI['w'].value ;
  var h = VSI['h'].value ;
  canvas_special_image.width  = w ;
  canvas_special_image.height = h ;
  canvas_special_image_progress.width  = w ;
  canvas_special_image_progress.height = h ;
  var img = Get('img_special_image') ;
  img.style.width  = w ;
  img.style.height = h ;
  img.width  = w ;
  img.height = h ;
  
  if(w==V['w'].value && h==V['h'].value){
    //antialias_pixels() ;
    img.src = Get('canvas_computation').toDataURL() ;
    return ;
  }
  
  var max_xy = Math.max(w,h) ;
  var dx = VSI['Dr'].value*w/max_xy ;
  var dy = VSI['Dr'].value*h/max_xy ;
  
  special_image_pixel_queue = [] ;
  special_image_queue_position = 0 ;
  for(var u=0 ; u<w ; ++u){
    var x = VSI['Cx'].value - 0.5*dx + dx*u/w ;
    for(var v=0 ; v<h ; ++v){
      var y = VSI['Cy'].value - 0.5*dy + dy*v/h ;
      special_image_pixel_queue.push([x,y,u,v]) ;
    }
  }
  window.setTimeout(unkill_special_image , 300) ;
  window.setTimeout(process_special_image, 500) ;
}
function unkill_special_image(){ kill_special_image = false ; }
function process_special_image(){
  //if(kill_special_image) return ;
  var p = new pixel_object(-1,-1,-1,-1) ;
  var time_0 = new Date().getTime() ;
  for(; special_image_queue_position<special_image_pixel_queue.length ; special_image_queue_position++){
    if(new Date().getTime()-time_0>100 || special_image_queue_position==special_image_pixel_queue.length-1){
      var fraction = (1+special_image_queue_position)/special_image_pixel_queue.length ;
      var percent_text = (100*fraction).toPrecision(3) + '%' ;
      Get('span_image_progress').innerHTML = percent_text ;
      break ;
    }
    var xyuv = special_image_pixel_queue[special_image_queue_position] ;
    p.reset_coords(xyuv[0], xyuv[1], xyuv[2], xyuv[3]) ;
    iterate_pixel(p, VSI) ;
    p.set_color(VSI, false) ;
    
    var c = context_special_image ;
    c.fillStyle = p.color ;
    c.fillRect(p.u,p.v,1,1) ;
  }
  
  if(special_image_queue_position<special_image_pixel_queue.length-1){
    window.setTimeout(process_special_image, delay) ;
  }
  else{
    window.setTimeout(finish_special_image, delay)
  }
}
function finish_special_image(){
  Get('img_special_image').src = canvas_special_image.toDataURL() ;
}
