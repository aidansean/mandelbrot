<?php
include_once($_SERVER['FILE_PREFIX']."/project_list/project_object.php") ;
$github_uri   = "https://github.com/aidansean/mandelbrot" ;
$blogpost_uri = "http://aidansean.com/projects/?tag=mandelbrot" ;
$project = new project_object("mandelbrot", "Mandelbrot explorer", "https://github.com/aidansean/mandelbrot", "http://aidansean.com/projects/?tag=mandelbrot", "mandelbrot/images/project.jpg", "mandelbrot/images/project_bw.jpg", "This project estimates the Mandelbrot set using the HTML5 canvas.  It's one of my longest running projects that has been implemented in PHP, SVG, HTML5 canvas, HTML tables, and even in ROOT.", "Maths", "AJAX,CSS,HTML,JavaScript,MySQL,PHP") ;
?>