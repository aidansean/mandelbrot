function variable_object(name, default_value, user_can_edit, force_recalculate){
  this.name = name ;
  this.def = default_value ;
  this.value = default_value ;
  this.editable = user_can_edit ;
  this.force_recalculate = force_recalculate ;
  this.changed = false ;
  this.reset = function(){
    this.value = this.def ;
  }
}
function duplicate_variables(Vin){
  var Vout = new Array() ;
  for(var key in Vin){
    var v = Vin[key] ;
    Vout[key] = new variable_object(v.name, v.def, v.editable, v.force_recalculate) ;
    Vout[key].value = v.value ;
  }
  return Vout ;
}
function variable_inheritance(VBase, VCompare){
  for(var keyBase in VBase){
    for(var keyCompare in VCompare){
      if(keyBase==keyCompare){
        VBase[keyBase].value = VCompare[keyCompare].value ;
      }
    }
  }
  return VBase ;
}

// All the variables
var V    = new Array() ;
var VURI = new Array() ;

V['Cx'] = new variable_object('Cx', -0.8, true , true) ;
V['Cy'] = new variable_object('Cy',  0.0, true , true) ;
V['Dr'] = new variable_object('Dr',  3.0, true , true) ;
V['Jx'] = new variable_object('Jx',  0.0, true , true) ;
V['Jy'] = new variable_object('Jy',  0.0, true , true) ;

V['w' ] = new variable_object('w' ,  729, false, true) ;
V['h' ] = new variable_object('h' ,  729, false, true) ;

V['iMin'] = new variable_object('iMin',   1, true, false) ;
V['iMax'] = new variable_object('iMax', 255, true, true ) ;

V['mode'] = new variable_object('mode',   2, true, true) ;
V['antialias'] = new variable_object('antialias', 1, true, true) ;

V['bailout'] = new variable_object('bailout', 1e20, true, true) ;

V['stripeAverage'] = new variable_object('stripeAverage', false, true, true) ;
V['stripeDensity'] = new variable_object('stripeDensity', 1, true, true) ;

V['palette'             ] = new variable_object('palette'             , 0, false, false) ;
V['palette_scalingPower'] = new variable_object('palette_scalingPower', 1, true , false) ;
V['palette_periodicity' ] = new variable_object('palette_periodicity' , 1, true , false) ;
V['zoomSize'            ] = new variable_object('zoomSize'            , 3, true , true ) ;

var VJuliaPreview = duplicate_variables(V) ;
VJuliaPreview['w'].value = 200 ;
VJuliaPreview['h'].value = 200 ;
VJuliaPreview['Jx'].value = V['Cx'].value ;
VJuliaPreview['Jy'].value = V['Cy'].value ;
VJuliaPreview['mode'].value = 1 ;
VJuliaPreview['Cx'].value = 0.0 ;
VJuliaPreview['Cy'].value = 0.0 ;
VJuliaPreview['Dr'].value = 4.0 ;

var DX = V['Dr'].value ;
var DY = V['Dr'].value ;

