<?php

// Turn on error reporting
ini_set('display_startup_errors',1) ;
ini_set('display_errors'        ,1) ;
error_reporting(-1) ;

include_once('mysql.php') ;

// Connect to database
$mySQL_connection = mysql_connect('localhost', $mysql_username, $mysql_password) or die('Could not connect: ' . mysql_error()) ;
mysql_select_db($mysql_database) or die('Could not select database') ;

function clean($string){
  return mysql_real_escape_string($string) ;
}

$name = clean($_GET['name']) ;
$Cx   = clean($_GET['Cx'  ]) ;
$Cy   = clean($_GET['Cy'  ]) ;
$Dr   = clean($_GET['Dr'  ]) ;
$iMin = clean($_GET['iMin']) ;
$iMax = clean($_GET['iMax']) ;
$mode = clean($_GET['mode']) ;
$palette = clean($_GET['palette']) ;
$palette_scalingPower = clean($_GET['palette_scalingPower']) ;
$palette_periodicity  = clean($_GET['palette_periodicity' ]) ;
$Jx = clean($_GET['Jx']) ;
$Jy = clean($_GET['Jy']) ;

$query = 'INSERT INTO mandelbrot_gallery (name, Cx, Cy, Dr, iMin, iMax, mode, palette, palette_scalingPower, palette_periodicity, Jx, Jy) VALUES (" ' . $name . '",' . $Cx . ',' . $Cy . ',' . $Dr . ',' . $iMin . ',' . $iMax . ',' . $mode . ',' . $palette . ',' . $palette_scalingPower . ',' . $palette_periodicity . ',' . $Jx . ',' . $Jy .  ')' ;
$result = mysql_query($query) ;
echo $query , mysql_error() ;

?>
