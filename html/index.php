<?php

$title = 'Fractals on the canvas' ;

$js_scripts = array() ;
$js_scripts[] = 'helper.js'         ;
$js_scripts[] = 'variables.js'      ;
$js_scripts[] = 'palettes.js'       ;
$js_scripts[] = 'palettes_data.js'  ;
$js_scripts[] = 'algorithms.js'     ;
$js_scripts[] = 'history.js'        ;
$js_scripts[] = 'controls.js'       ;
$js_scripts[] = 'functions.js'      ;
$js_scripts[] = 'gallery.js'        ;
$js_scripts[] = 'gallery_data.php'  ;
$stylesheets = array() ;
$stylesheets[] = 'style.css' ;

$fb_image = 'fb2.jpg' ;

if(isset($_GET['xMin']) && isset($_GET['xMax']) && isset($_GET['yMin']) && isset($_GET['yMax'])){
  $_GET['Cx'] = 0.5*($_GET['xMin']+$_GET['xMax']) ;
  $_GET['Cy'] = 0.5*($_GET['yMin']+$_GET['yMax']) ;
  $_GET['Dr'] = max($_GET['xMax']-$_GET['xMin'],$_GET['yMax']-$_GET['yMin']) ;
}

include('../_core/preamble.php') ;

echo '<script>' , PHP_EOL ;
foreach(array_keys($_GET) as $key){
  echo "VURI['" , $key , "'] = new variable_object('" , $key , "', " , $_GET[$key] , ", false, false) ;" , PHP_EOL ;
}
foreach(array_keys($_GET) as $key){
  echo "VURI['" , $key , "'].value = " , $_GET[$key] , ' ;' , PHP_EOL ;
}
echo '</script>' , PHP_EOL ;
?>

    <div class="right">
      <h3>About this page <input type="submit" id="submit_toggle_description" value="Hide"/></h3>
      <div class="blurb">
        <div id="div_description">
          <p>This page generates different fractals using your browser's built in Javascript engine.  The centre of the image is defined by the \(C_x\) and \(C_y\) variables, while the \(\Delta r\) variable defines the width and height of the image.  For a Julia set the constant is defined by \(J_x\) and \(J_y\).</p>
        
          <p>Each time you click on the explorer canvas it will zoom in based on the "Zoom factor" variable.  Javascript has a finite precision, so as you zoom in very deep you may reach the limits of the software.  Each point on the Mandelbrot set corresponds to a Julia set, and you can generate the relevant Julia set by clicking on the button.  You can pan up, down, left, and right using the arrow keys.</p>
        
          <p>You can select a different palette by clicking on the palette you want to use.  If you want the palette to repeat itself simply adjust the "Palette periodicity" variable.  If you want the palette to be more sensitive to lower or higher numbers of iterations adjust the "Palette scaling power" variable.  Values smaller than \(1\) will make the palette more sensitive to the lower number of iterations, whereas values larger than \(1\) will make the palette more sensitive to the higher number of iterations.  You can see the effect on the current palette at the top of the page.</p>
        
          <p>You can create a png image of any fractal you make.  The fastest method is to simply copy the canvas directly, but there is also support for images of any size, so you can generate very large, print quality images.  This page will also keep a history of the steps you've made so that you can go back to a previous step if you find yourself in a boring region.</p>
        
          <p>You can share your favourite parts of the fractals in the gallery.  Just give the fractal and name and press the "Save to gallery"  button.  To see someone else's fractal simply click on the thumbnail.</p>
        </div>
      </div>
    </div>
    
    <div id="div_progress_wrapper">
      <h3>Progress</h3>
      <table id="table_progress">
        <tbody>
          <tr>
            <td id="td_progress_number">
              <span id="span_progress_percent"></span> <span id="span_progress_fraction"></span>
            </td>
            <td id="td_progress_bar">
              <canvas id="canvas_progress" width="550" height="20"></canvas>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3>Current palette</h3>
    <table>
      <tbody>
        <tr>
          <th class="palette_settings">Scaling power</th>
          <td>
            <canvas id="canvas_palette_scalingPower" width="600" height="25"></canvas>  
          </td>
        </tr>
        <tr>
          <th class="palette_settings"><span id="span_palette_wait"></span></th>
          <td>
            <canvas id="canvas_palette_preview"      width="600" height="25"></canvas>
          </td>
        </tr>
        <tr>
          <th class="palette_settings">Frequency</th>
          <td>
            <canvas id="canvas_palette_periodicity"  width="600" height="25"></canvas>
          </td>
        </tr>
      </tbody>
    </table>
    
    <h3>Explorer</h3>
    <p>Hint: Increase the value of "Max iterations" to see more detail.  If you can't see details very well consider increasing "Palette frequency".</p>
    <canvas id="canvas_explorer" width="729" height="729"></canvas>
    <canvas id="canvas_computation" width="729" height="729" style="display:none"></canvas>
    
    <h3>Settings and information</h3>
    <div class="tab">
      <div class="tab_cell">
        <table class="coords">
          <tbody>
            <tr>
              <th class="coords">\( C_x = \)</th>
              <td><input type="input" id="input_Cx" class="text" value=""/></td>
            </tr>
            <tr>
              <th class="coords">\( C_y = \)</th>
              <td><input type="input" id="input_Cy" class="text" value=""/></td>
            </tr>
            <tr>
              <th class="coords">\( \Delta r = \)</th>
              <td><input type="input" id="input_Dr" class="text" value=""/></td>
            </tr>
            <tr>
              <th class="coords">\( J_x = \)</th>
              <td><input type="input" id="input_Jx" class="text" value=""/></td>
            </tr>
            <tr>
              <th class="coords">\( J_y = \)</th>
              <td><input type="input" id="input_Jy" class="text" value=""/></td>
            </tr>
            <tr>
              <th class="coords">Min iterations:</th>
              <td><input type="input" id="input_iMin" class="text" value=""/></td>
            </tr>
            <tr>
              <th class="coords">Max iterations:</th>
              <td><input type="input" id="input_iMax" class="text" value=""/></td>
            </tr>
            <tr>
              <td class="coords" style="text-align:right">Palette scaling power</td>
              <td class="coords"><input type="text" id="input_palette_scalingPower" class="text" value="1.0"/></td>
            </tr>
            <tr>
              <td class="coords" style="text-align:right">Palette frequency</td>
              <td class="coords"><input type="text" id="input_palette_periodicity" class="text" value="1.0"/></td>
            </tr>
            <tr>
              <td class="coords" style="text-align:right">Zoom factor</td>
              <td class="coords"><input type="text" id="input_zoomSize" class="text" value="1"/></td>
            </tr>
            <tr>
              <td class="coords" style="text-align:right">Mode</td>
              <td class="coords"><input type="text" id="input_mode" class="text" value="2"/></td>
            </tr>
            <tr>
              <td class="coords" style="text-align:right">Anti alias</td>
              <td class="coords"><input type="text" id="input_antialias" class="text" value="0"/></td>
            </tr>
            <tr>
              <td class="coords" colspan="2"><input type="submit" id="submit_change_settings" value="Update settings"/></td>
            </tr>
            <tr>
              <td class="coords" colspan="2"><input type="submit" id="submit_centre" value="Centre on (0,0)"/></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="tab_cell">
        <p class="center">
          <span id="span_fraction">100%</span> of interesting fractal space.<br />
          <a id="url" href="">Link to current fractal</a>
        </p>
        <p class="center">
          <input type="submit" id="submit_generate_julia" value="Generate Julia set"/><br />
          <canvas id="canvas_julia_preview" width="200" height="200"/></canvas>
        </p>
      </div>
    </div>
    
    <div class="right">
      <h3>Palettes</h3>
      <div class="blurb center">
        <table id="table_palette">
          <tbody id="tbody_palette">
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="right">
      <h3>Image</h3>
      <div class="blurb center">
      <p id="p_special_image">
        <select id="select_special_image">
          <option value="0x0">Standard quick image (size of canvas)</option>
          <option value="851x315">Facebook cover photo (851 x 315 pixels)</option>
          <option value="1500x500">Twitter header photo (1500 x 500 pixels)</option>
          <option value="2560x1600">Desktop wallpaper (2560 x 1600 pixels)</option>
          <option value="1920x1080">Desktop wallpaper (1920 x 1080 pixels)</option>
          <option value="1366x768">Desktop wallpaper (1366 x 768 pixels)</option>
          <option value="1280x1024">Desktop wallpaper (1280 x 1024 pixels)</option>
          <option value="1280x800">Desktop wallpaper (1280 x 800 pixels)</option>
          <option value="1024x768">Desktop wallpaper (1024 x 768 pixels)</option>
          <option value="800x600">Desktop wallpaper (800 x 600 pixels)</option>
          <option value="640x480">Desktop wallpaper (640 x 480 pixels)</option>
          <option value="640x480">Desktop wallpaper (640 x 480 pixels)</option>
          <option value="2481x3510">A4 paper @ 300 dpi (2481 x 3510 pixels)</option>
          <option value="3510x4950">A3 paper @ 300 dpi (3510 x 4950 pixels)</option>
          <option value="4950x7020">A2 paper @ 300 dpi (4590 x 7020 pixels)</option>
          <option value="7020x9930">A1 paper @ 300 dpi (7020 x 9930 pixels)</option>
          <option value="9930x14040">A0 paper @ 300 dpi (9930 x 14040 pixels)</option>
          <option value="100x100">Icon (100 x 100 pixels)</option>
        </select>
        <br />
        <input type="checkbox" id="checkbox_custom_image"/>
        Custom size:
        <input type="text" id="input_custom_image_width" value="300"/> x <input type="text" id="input_custom_image_height" value="300"/> pixels <br />
        <input type="submit" id="submit_generate_special_image" value="Generate image"/><br />
        <span id="span_image_progress"></span>
      </p>
      <canvas id="canvas_special_image" style="display:none"></canvas>
      <canvas id="canvas_special_image_progress" style="display:none"></canvas>
      <p class="center"><img id="img_special_image" width="10px" height="10px"/></p>
    </div>
    </div>
    
    <div class="right">
      <h3>Gallery</h3>
      <div class="blurb center" id="div_gallery">
        Fractal name: <input type="text" id="input_gallery_name" />
        <input type="submit" id="submit_add_to_gallery" value="Save to gallery"/><span id="span_gallery_status"></span>
        <table id="table_gallery">
          <tbody id="tbody_gallery">
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="right">
      <h3>History</h3>
      <div class="blurb center">
        <table id="table_history">
          <tbody id="tbody_history">
          </tbody>
        </table>
      </div>
      <canvas id="canvas_thumbnail" style="display:none" width="100px" height="100px"></canvas>
    </div>
    
    <pre id="pre_debug"></pre>
    
<?php foot() ; ?>
