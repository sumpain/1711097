<?php
/**
 * Template Name: Download page
 * Template used for downloading the files of a selected order
 *
 */

// Do not allow directly accessing this file.
if ( ! defined( 'ABSPATH' ) ) {
	exit( 'Direct script access denied.' );
}

/**
 * sanitize string
 */
function sanitizeString( $string ) {
	$string = str_replace(' ', '', $string);
	$string = str_replace('&#163;', 'PoundSterling', $string);
	$string = str_replace('&amp;', '', $string);

	return $string;
	//return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

/**
 * get the files from the order
 * and return array of file-location (and some meta)
 */
function get_files( $order_id ) {

	$files = array();

	// Get an instance of the WC_Order object
	$order = wc_get_order( $order_id );
	$items = $order->get_items();

	// get the item, so we can
	foreach ( $items as $item_id => $item_data ) {

		if ( $item_data['File'] ) {

			$fileList_array = explode( ',', $item_data['File'] );

			if ( $fileList_array ) {
				foreach ( $fileList_array as $file ) {
					
					$dom = new DomDocument();
					$dom->loadHTML( $file );
					$output = array();
					foreach ($dom->getElementsByTagName('a') as $item) 
					{
						$output[] = array (
							'str' => $dom->saveHTML($item),
							'href' => $item->getAttribute('href'),
							'anchorText' => $item->nodeValue
						);
					}
					
					$href = trim( str_replace('\"', '', $output[0]['href'] ));
					
					$variations = array();
					array_push( $variations, sanitizeString($item_data['Document Type'] ));
					array_push( $variations, sanitizeString($item_data['Size'] ));
					array_push( $variations, sanitizeString($item_data['Colours'] ));
					array_push( $variations, sanitizeString($item_data['Finish'] ));
					if ( strlen( $item_data['Encapsulation'] ) > 0 )
					{
						array_push( $variations, sanitizeString($item_data['Encapsulation'] ));
					}	
					
					// just get the href tag of it
					$files[] = array( 'url' => $href, 'item' => implode ( '-', $variations ));
				}
			}
		}

	}

	return $files;
}

/**
 *
 * curl_file_get_contents zipfile
 * https://stackoverflow.com/questions/27980682/php-empty-result-file-get-contents
 *
 * @param $url
 *
 * @return string
 */
function curl_file_get_contents( $url )
{
	$ch = curl_init();
	
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, FALSE );
	curl_setopt( $ch, CURLOPT_HEADER, false );
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, true );
	curl_setopt( $ch, CURLOPT_URL, $url );
	curl_setopt( $ch, CURLOPT_REFERER, $url );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, TRUE );
	
	$contents = curl_exec( $ch );
	
	curl_close( $ch );
	
	return $contents;
}

/**
 *
 * create zipfile
 * get files and put them in
 *
 * @param $order_id
 * @param $log_file
 *
 * @return string
 */
function make_zip( $order_id, $log_file ) 
{
	// zipfile location
	$zip_file = sprintf( '%s/zip/%s.zip', wp_upload_dir()['basedir'], $order_id );
	
	file_put_contents( $log_file, sprintf("ORDER ID::: %s\n", $order_id ), FILE_APPEND );
	file_put_contents( $log_file, sprintf("ZIP::: %s\n", $zip_file ), FILE_APPEND );
	
	//
	// delete previous zip file
	//
	if ( file_exists( $zip_file ) ) {
		unlink( $zip_file );
	}

	//
	// generate the zipfile with given files
	//
	$zip = new ZipArchive;
	$res = $zip->open( $zip_file, ZipArchive::CREATE );

	/*
	 * if we have a new zip file
	 * add the files to it
	 * and send it back
	 */
	if ( $res === TRUE ) 
	{
		/* get the files from the order */
		$files = get_files( $order_id );

		/* add them to the zip */
		$item_compare = '';
		foreach ( $files as $file ) 
		{
			$url = 	$file['url'];
			$item = $file['item'];
			
			if( $item_compare != $item )
			{
				$item_compare = $item;
				
				file_put_contents( $log_file, sprintf("\nITEM::: %s\n", $item ), FILE_APPEND );
			}
			file_put_contents( $log_file, sprintf("%s\n", $url ), FILE_APPEND );
			
			/*
			 * FILE CONTENT
			 */
			$file_content = file_get_contents( $url );
			
			file_put_contents( $log_file, sprintf("FILE SIZE::: %s\n", strlen( $file_content ) ), FILE_APPEND );
			
			/*
			 * HTTPS issues: file images were empty, so if the result of file_put_contents is 0, I will use CURL
			 */
			if( strlen( $file_content ) == 0 )
			{
				$file_content = curl_file_get_contents( $url );
				
				file_put_contents( $log_file, sprintf("FILE SIZE AFTER CURL::: %s\n", strlen( $file_content ) ), FILE_APPEND );
			}
			
			$zip->addFromString( 
					sprintf( 'order_%s/%s/%s', $order_id, $item, basename( $url )), 
					$file_content
			);
		}
	}

	$zip->close();
	
	return $zip_file;

}

/**
 * BUSINESS LOGIC
 */
$order_id = absint( $_GET['order_id'] );

if ( ! $order_id ) {
	exit;
}

$log_folder = sprintf( "%s/log/", dirname(__FILE__));
$log_file = sprintf( "%sdownload-zip_orderid-%s_%s.txt", $log_folder, $order_id, date( 'Ymd-His' ));

if( !file_exists( $log_folder ))
{
	mkdir( $log_folder );
}

$zipFile = make_zip( $order_id, $log_file );

// setup the headers for downlaoding the zip
if ( file_exists( $zipFile ) ) {
	header( 'Content-Description: File Transfer' );
	header( 'Content-Type: application/zip' );
	header( 'Content-Disposition: attachment; filename=' . basename( $zipFile ) );
	header( 'Content-Transfer-Encoding: binary' );
	header( 'Expires: 0' );
	header( 'Cache-Control: must-revalidate' );
	header( 'Pragma: public' );
	header( 'Content-Length: ' . filesize( $zipFile ) );
	ob_clean();
	flush();
//	readfile( $zipFile );
	//$fp = fopen($zipFile, 'rb');
	//fpassthru($fp);
	$fp = fopen($zipFile, 'rb');
	if( $fp )
     {
       fpassthru( $fp );
       fclose( $fp );
     }	
	
} else {
	header( 'Location: ' . $_SERVER['HTTP_REFERER'] );
}

exit;

/* Omit closing PHP tag to avoid "Headers already sent" issues. */
