<?php

// Turn on error reporting
ini_set('display_startup_errors',1) ;
ini_set('display_errors',1) ;
error_reporting(-1) ;

$mysql_username = 'dice' ;
$mysql_password = 'scores'   ;
$mysql_database = 'aidansean' ;
$mysql_prefix   = '' ;

// Connect to database
$mySQL_connection = mysql_connect('localhost', $mysql_username, $mysql_password) or die('Could not connect: ' . mysql_error()) ;
mysql_select_db($mysql_database) or die('Could not select database') ;

echo 'var gallery_entries = [] ;' , PHP_EOL ;

$query = 'SELECT * FROM mandelbrot_gallery' ;
$result = mysql_query($query) ;
while($row = mysql_fetch_assoc($result)){
  echo 'gallery_entries.push( new gallery_entry("' ,
    $row['name'] , '", ' ,
    $row['Cx'] , ',' ,
    $row['Cy'] , ',' ,
    $row['Dr'] , ',' ,
    $row['iMin'] , ',' ,
    $row['iMax'] , ',' ,
    $row['mode'] , ',' ,
    $row['Jx'] , ',' ,
    $row['Jy'] , ',' ,
    $row['palette'] , ',' ,
    $row['palette_scalingPower'] , ',' ,
    $row['palette_periodicity'] , ') ) ;' , PHP_EOL ;
}

?>