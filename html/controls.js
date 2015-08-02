var mouse_x = -1 ;
var mouse_y = -1 ;
var mouse_in_canvas = false ;

var palette_scalingPower_active = false ;
var palette_periodicity_active  = false ;

function keyDown(e){
  var keyDownID = window.event ? event.keyCode : (e.keyCode != 0 ? e.keyCode : e.which) ;
  var isInput = (document.activeElement.nodeName.toLowerCase()=='input') ;
  switch(keyDownID){
    case 37: // left
    case 38: // up
    case 39: // right
    case 40: // down
      if(isInput) return ;
      e.preventDefault() ;
  }
  switch(keyDownID){
    case 13: change_settings() ; break ; // enter
    case 27: kill_queue = true ; break ; // escape
    case 37: moveW() ; break ; // left
    case 38: moveN() ; break ; // up
    case 39: moveE() ; break ; // right
    case 40: moveS() ; break ; // down
  }
}
function get_mouse_xy_tabled(e){
  var BB = e.target.getBoundingClientRect();
  var x = Math.round(e.pageX - BB.left) ;
  var y = Math.round(e.pageY - BB.top ) ;
  return [x,y] ;
}
function get_mouse_xy(e){
  var x = e.pageX - e.target.offsetLeft ;
  var y = e.pageY - e.target.offsetTop  ;
  return [x,y] ;
}
function canvas_fractal_click(e){
  var XY = get_mouse_xy(e) ;
  var w = V['w'].value ;
  var h = V['h'].value ;
  V['Cx'].value += DX*(XY[0]-0.5*w)/w ;
  V['Cy'].value += DY*(XY[1]-0.5*h)/h ;
  V['Dr'].value /= V['zoomSize'].value ;
  force_recalculate = true ;
  update_all() ;
}
function canvas_fractal_mouseover(e){
  mouse_in_canvas = true ;
  canvas_fractal_mousemove(e) ;
}
function canvas_fractal_mousemove(e){
  context_explorer.drawImage(canavs_computation, 0, 0) ;
  var XY = get_mouse_xy(e) ;
  mouse_x = XY[0] ;
  mouse_y = XY[1] ;
  draw_zoom_rectangle() ;
}
function canvas_fractal_mouseout(e){
  mouse_in_canvas = false ;
  context_explorer.drawImage(canavs_computation, 0, 0) ;
}
function draw_zoom_rectangle(){
  if(mouse_x<0 || mouse_y<0) return ;
  var du = Math.floor(0.5*V['w'].value/V['zoomSize'].value) ;
  var dv = Math.floor(0.5*V['h'].value/V['zoomSize'].value) ;
  var x = mouse_x - du ;
  var y = mouse_y - dv ;
  context_explorer.fillStyle = 'rgba(255,255,255,0.5)' ;
  context_explorer.fillRect(x,y,2*du,2*dv) ;
}

function moveN(){ V['Cy'].value -= 0.5*DY/V['zoomSize'].value ; update_all() ; }
function moveS(){ V['Cy'].value += 0.5*DY/V['zoomSize'].value ; update_all() ; }
function moveW(){ V['Cx'].value -= 0.5*DX/V['zoomSize'].value ; update_all() ; }
function moveE(){ V['Cx'].value += 0.5*DX/V['zoomSize'].value ; update_all() ; }

