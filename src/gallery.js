function gallery_entry(name, Cx, Cy, Dr, iMin, iMax, mode, Jx, Jy, palette, palette_scalingPower, palette_periodicity){
  this.name = name ;
  this.V = duplicate_variables(V) ;
  this.V['Cx'  ].value = Cx ;
  this.V['Cy'  ].value = Cy ;
  this.V['Dr'  ].value = Dr ;
  this.V['iMin'].value = iMin ;
  this.V['iMax'].value = iMax ;
  this.V['mode'].value = mode ;
  this.V['Jx'  ].value = Jx ;
  this.V['Jy'  ].value = Jy ;
  this.V['w'   ].value = 100 ;
  this.V['h'   ].value = 100 ;
  this.V['palette'             ].value = palette ;
  this.V['palette_scalingPower'].value = palette_scalingPower ;
  this.V['palette_periodicity' ].value = palette_periodicity ;
}
function gallery_entry_from_V(name, Vars){
  var g = new gallery_entry(name, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1) ;
  g.V = duplicate_variables(Vars) ;
  g.V['w'].value = 100 ;
  g.V['h'].value = 100 ;
  return g ;
}

function GetXmlHttpObject(){
  if(window.XMLHttpRequest){
    // code for IE7+, Firefox, Chrome, Opera, Safari
    return new XMLHttpRequest() ;
  }
  if(window.ActiveXObject){
    // code for IE6, IE5
    return new ActiveXObject("Microsoft.XMLHTTP") ;
  }
  return null ;
}
var gallery_xmlhhtp = null ;
function add_to_gallery(){
  if(gallery_xmlhhtp==null) gallery_xmlhhtp = GetXmlHttpObject() ;
  var string = 'name=' + input_gallery_name.value ;
  for(var key in V){
    string += '&' + key + '=' + V[key].value ;
  }
  var request = 'add_to_gallery.php?' + string ;
  gallery_xmlhhtp.open('GET', request,true) ;
  gallery_xmlhhtp.send(null) ;
  Get('span_gallery_status').innerHTML = 'Saving...' ;
  gallery_xmlhhtp.onreadystatechange = post_add_to_gallery ;
  add_gallery_thumbnail() ;
}
function post_add_to_gallery(){
  Get('span_gallery_status').innerHTML = 'Saved to gallery!' ;
  window.setTimeout(remove_gallery_success_message, 1000) ;
}
function remove_gallery_success_message(){
  Get('span_gallery_status').innerHTML = '' ;
}
function load_from_gallery(e){
  var id = e.target.id ;
  var index = parseInt(id.split('_')[2]) ;
  var g = gallery_entries[index] ;
  g.V['w'].value = V['w'].value ;
  g.V['h'].value = V['h'].value ;
  V = variable_inheritance(V, g.V) ;
  update_all() ;
}
function prepare_gallery_table(){
  var tbody = Get('tbody_gallery') ;
  var nCol = 7 ;
  var nRow = Math.ceil(gallery_entries.length/nCol) ;
  var counter = 0 ;
  for(var i=0 ; i<nRow ; ++i){
    var tr = Create('tr') ;
    for(var j=0 ; j<nCol ; ++j){
      var td = Create('td') ;
      td.id = 'td_gallery_' + counter ;
      td.className = 'gallery' ;
      td.innerHTML = ' ' ;
      tr.appendChild(td) ;
      counter++ ;
    }
    tbody.appendChild(tr) ;
  }
}
function make_gallery(index){
  var Vg = gallery_entries[index].V ;
  var w = Vg['w'].value ;
  var h = Vg['h'].value ;
  var canvas = Create('canvas') ;
  canvas.id = 'canvas_gallery_' + index ;
  canvas.width  = w ;
  canvas.height = h ;
  canvas.addEventListener('click', load_from_gallery, false) ;
  canvas.title = gallery_entries[index].name ;
  canvas.className = 'gallery' ;
  var context = canvas.getContext('2d') ;
  var Dr = Vg['Dr'].value ;
  var Cx = Vg['Cx'].value ;
  var Cy = Vg['Cy'].value ;
  for(var u=0 ; u<w ; ++u){
    var x = Cx - 0.5*Dr + Dr*u/w ;
    for(var v=0 ; v<h ; ++v){
      var y = Cy - 0.5*Dr + Dr*v/h ;
      var p = new pixel_object(x, y, u, v) ;
      iterate_pixel(p, Vg) ;
      p.set_color(Vg) ;
      context.fillStyle = p.color ;
      context.fillRect(u,v,1,1) ;
    }
  }
  Get('td_gallery_' + index).appendChild(canvas) ;
}
function add_gallery_thumbnail(){
  var nCol = 7 ;
  if(gallery_entries.length%nCol==0){
    var tbody = Get('tbody_gallery') ;
    var tr = Create('tr') ;
    for(var i=0 ; i<nCol ; ++i){
      var td = Create('td') ;
      td.id = 'td_gallery_' + (gallery_entries.length+i) ;
      td.className = 'gallery' ;
      td.innerHTML = ' ' ;
      tr.appendChild(td) ;
    }
    tbody.appendChild(tr) ;
  }
  var entry = gallery_entry_from_V(input_gallery_name.value, V) ;
  gallery_entries.push(entry) ;
  make_gallery(gallery_entries.length-1) ;
}
