// History stuff
var history_ = new Array() ;
function history_item(){
  this.V = new Array() ;
  for(var key in V){
    this.V[key] = V[key].value ;
  }
  this.revert = function(){
    for(var key in this.V){
      V[key].value = this.V[key] ;
    }
    update_all() ;
  }
  this.url = function(){
    string = '' ;
    for(var key in this.V){
      string += key + '=' + this.V[key].value + '&' ;
    }
    return 'http://www.aidansean.com/mandelbrot/canvas.php?' + string ;
  }
}
function rollback_history(e){
  var history_index = e.target.id.split('_')[2] ;
  history_[history_index].revert() ;
}
function update_history(){
  var nCol = 7 ;
  var history_index = history_.length ;
  if(history_index%nCol==0){
    var tbody = Get('tbody_history') ;
    var tr = Create('tr') ;
    tr.className = 'tr_history' ;
    for(var i=0 ; i<nCol ; ++i){
      var index = history_index + i ;
      var tdTmp = Create('td') ;
      tdTmp.id = 'td_history_' + index ;
      tdTmp.className = 'history_thumbnail' ;
      tr.appendChild(tdTmp) ;
    }
    tbody.appendChild(tr) ;
  }
  
  var td = Get('td_history_' + history_index) ;
  var can = Get('canvas_thumbnail') ;
  var con = can.getContext('2d') ;
  var p = new pixel_object(-1,-1,-1,-1) ;
  for(var u=0 ; u<100 ; u++){
    var x = V['Cx'].value - 0.5*V['Dr'].value + DX*u/100 ;
    for(var v=0 ; v<100 ; v++){
      var y = V['Cy'].value - 0.5*V['Dr'].value + DY*v/100 ;
      p.reset_coords(x, y, u, v) ;
      iterate_pixel(p, V) ;
      p.set_color(V) ;
      con.fillStyle = p.color ;
      con.fillRect(p.u,p.v,1,1) ;
    }
  }
  var img = Create('img') ;
  var dataURL = can.toDataURL() ;
  img.src = dataURL ;
  img.id = 'img_history_' + history_index ;
  img.addEventListener('click', rollback_history, false) ;
  img.className = 'history' ;
  td.appendChild(img) ;
  history_.push(new history_item()) ;
}