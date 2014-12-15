var palette_tmp = 0 ;

palette_tmp = new palette_object('Rainbow') ;
palette_tmp.add_color_stop(new color_stop_object(0.0/7.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0/7.0, 255,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(2.0/7.0,   0,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(4.0/7.0,   0, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(5.0/7.0, 255, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(6.0/7.0, 255,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(7.0/7.0,   0,   0,   0)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Reverse rainbow') ;
palette_tmp.add_color_stop(new color_stop_object(0.0/7.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0/7.0, 255,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(2.0/7.0, 255, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(3.0/7.0,   0, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(5.0/7.0,   0,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(6.0/7.0, 255,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(7.0/7.0,   0,   0,   0)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Hot rainbow') ;
palette_tmp.add_color_stop(new color_stop_object(0.0/7.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0/7.0, 255,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(2.0/7.0,   0,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(4.0/7.0,   0, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(5.0/7.0, 255, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(6.0/7.0, 255,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(7.0/7.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Reverse hot rainbow') ;
palette_tmp.add_color_stop(new color_stop_object(0.0/7.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0/7.0, 255,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(2.0/7.0, 255, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(3.0/7.0,   0, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(5.0/7.0,   0,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(6.0/7.0, 255,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(7.0/7.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Red') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255,   0,   0)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Blue') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0,   0,   0, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Hot red') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(0.5, 255,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Hot blue') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(0.5,   0,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Very hot red') ;
palette_tmp.add_color_stop(new color_stop_object(0.0, 255,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Very hot blue') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Green') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0,   0, 255,   0)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Cyan') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0,   0, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Hot green') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(0.5,   0, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Hot cyan') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(0.5,   0, 255, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Very hot green') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Very hot cyan') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0, 255, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Magenta') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255,   0, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Yellow') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255,   0)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Hot magenta') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(0.5, 255,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Hot yellow') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(0.5, 255, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Very hot magenta') ;
palette_tmp.add_color_stop(new color_stop_object(0.0, 255,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Very hot yellow') ;
palette_tmp.add_color_stop(new color_stop_object(0.0, 255, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Grey up') ;
palette_tmp.add_color_stop(new color_stop_object(0.0,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 255)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Grey down') ;
palette_tmp.add_color_stop(new color_stop_object(0.0, 255, 255, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0,   0,   0,   0)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Winter') ;
palette_tmp.add_color_stop(new color_stop_object(0.0, 100, 100, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(0.6, 200, 200, 200)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0, 255, 255, 200)) ;
palettes.push(palette_tmp) ;

palette_tmp = new palette_object('Galaxy') ;
palette_tmp.add_color_stop(new color_stop_object(0.0  ,   0,   0,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(0.6  , 255,   0, 255)) ;
palette_tmp.add_color_stop(new color_stop_object(0.999, 255, 255,   0)) ;
palette_tmp.add_color_stop(new color_stop_object(1.0  ,   0,   0,   0)) ;
palettes.push(palette_tmp) ;