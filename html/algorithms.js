function algorithm_object(){
  this.bailout = 0 ;
  this.isJulia = false ;
  this.Jx = 0 ;
  this.Jy = 0 ;
  this.update_parameters = function(VIn){
    this.bailout = VIn['bailout'].value ;
  }
  this.update_JxJy = function(Jx,Jy){
    this.Jx = Jx ;
    this.Jy = Jy ;
  }
  this.begin_iteration = function(pixel){
    return ;
  }
  this.generic_single_iteration = function(pixel, x, y){
    pixel.x = x ;
    pixel.y = y ;
    pixel.nIterations++ ;
    pixel.orbit.push([x,y]) ;
  }
}

var algorithm_mandelbrot = new algorithm_object() ;
algorithm_mandelbrot.begin_iteration = function(pixel){
  // Check for main cardioid and second bulb
  var x0 = pixel.x0 ;
  var y0 = pixel.y0 ;
  var fail = false ;
  var q = (x0-0.25)*(x0-0.25)+y0*y0 ;
  if(q*(q+x0-0.25)<0.25*y0*y0  ) fail = true ; // Main cardioid
  if(((x0+1)*(x0+1)+y0*y0)*16<1) fail = true ; // Second bulb
  if(fail){
    pixel.nIterations = Vars['iMax'].value ;
    pixel.done = true ;
    pixel.inSet = true ;
  }
}
algorithm_mandelbrot.single_iteration = function(pixel){
  if(pixel.done==true) return ;
  // Now iterate over pixels
  var x = pixel.x0 + pixel.x1*pixel.x1 - pixel.y1*pixel.y1 ;
  var y = pixel.y0 + 2*pixel.x1*pixel.y1                   ;
  if(sqrt(x*x+y*y)>this.bailout){
    pixel.done = true ;
    pixel.inSet = true ;
    return true ;
  }
  this.generic_single_iteration(pixel, x, y) ;
  return false ;
}

var algorithm_mandelbrot3 = new algorithm_object() ;
algorithm_mandelbrot3.single_iteration = function(pixel){
  if(pixel.done==true) return ;
  // Now iterate over pixels
  var x = pixel.x0 + pixel.x1*pixel.x1*pixel.x1 - 3*pixel.x1*pixel.y1*pixel.y1 ;
  var y = pixel.y0 - pixel.y1*pixel.y1*pixel.y1 + 3*pixel.x1*pixel.x1*pixel.y1 ;
  if(sqrt(x*x+y*y)>this.bailout){
    pixel.done = true ;
    pixel.inSet = true ;
  }
  this.generic_single_iteration(pixel, x, y) ;
}

function algorithm_mandelbrotJulia_object(Jx, Jy){
  var algorithm = new algorithm_object() ;
  algorithm.isJulia = true ;
  algorithm.update_JxJy(Jx, Jy) ;
  return algorithm ;
}
var algorithm_mandelbrotJulia = new algorithm_mandelbrotJulia_object(0,0) ;
algorithm_mandelbrotJulia.single_iteration = function(pixel){
  if(pixel.done==true) return ;
  // Now iterate over pixels
  var x = this.Jx +   pixel.x1*pixel.x1 - pixel.y1*pixel.y1 ;
  var y = this.Jy + 2*pixel.x1*pixel.y1                     ;
  if(sqrt(x*x+y*y)>this.bailout){
    pixel.done = true ;
    pixel.inSet = true ;
    return true ;
  }
  this.generic_single_iteration(pixel, x, y) ;
  return false ;
}

function algorithm_mandelbrot3Julia_object(Jx, Jy){
  var algorithm = new algorithm_object() ;
  algorithm.isJulia = true ;
  algorithm.update_JxJy(Jx, Jy) ;
  return algorithm ;
}
var algorithm_mandelbrot3Julia = new algorithm_mandelbrot3Julia_object(0,0) ;
algorithm_mandelbrot3Julia.single_iteration = function(pixel){
  if(pixel.done==true) return ;
  // Now iterate over pixels
  var x = this.Jx + pixel.x1*pixel.x1*pixel.x1 - 3*pixel.x1*pixel.y1*pixel.y1 ;
  var y = this.Jy - pixel.y1*pixel.y1*pixel.y1 + 3*pixel.x1*pixel.x1*pixel.y1 ;
  if(sqrt(x*x+y*y)>this.bailout){
    pixel.done = true ;
    pixel.inSet = true ;
  }
  this.generic_single_iteration(pixel, x, y) ;
}

