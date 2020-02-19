<?php
header("Access-Control-Allow-Origin: *");
$data = $_POST['data'];
if ($data !== 'the data') {
  header("HTTP/1.0 404 Not Found");
}
echo $_POST['data'];
