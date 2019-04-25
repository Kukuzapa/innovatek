<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    header('Content-Type: text/html; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');

    include 'helper.php';

    $new = new Helper;

    $request = [];
    
    $command = $_COOKIE['command'];

    foreach ( json_decode( $_COOKIE['request'] ) as $i => $value ) {
        $request[$i] = urldecode( $value );
    }

    $result = $new->$command( $request );

    //print_r( $result );

    foreach ( $result as $i => $value ) {
        setcookie( $i, json_encode( $value, JSON_UNESCAPED_UNICODE ), 0, '/' );
    }

    echo 'OK';
?>