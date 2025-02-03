<?php
/*
 *
 * ===================================
 *
 * UTILITIES
 *
 * ===================================
 *
 */

// disable update notifications for akismet, you will do it like
function filter_plugin_updates( $value ) 
{
	unset( $value->response['no-captcha-recaptcha-for-woocommerce/no-captcha-recaptcha-for-woocommerce.php'] );
	return $value;
}
//add_filter( 'site_transient_update_plugins', 'filter_plugin_updates' );

// Disable Admin Bar for All Users Except for Administrators
function remove_admin_bar() 
{
	if (!current_user_can('administrator') && !is_admin()) 
	{
		show_admin_bar(false);
	}
}
add_action('after_setup_theme', 'remove_admin_bar');

/**
* remove the query strings
*/
function _remove_script_version( $src )
{
       if ( strpos( $src, 'Avada-Child-Theme' ) === false && strpos( $src, 'gravityforms' ) === false)
	{
		$parts = explode( '?', $src );		
		return $parts[0];
	}
	else {
		return $src;
        }
}
//add_filter( 'script_loader_src', '_remove_script_version', 15, 1 );
//add_filter( 'style_loader_src', '_remove_script_version', 15, 1 );

/**
* change the default image optimizer quality
**/
add_filter( 'jpeg_quality', create_function( '', 'return 70;' ) );

function avada_lang_setup()
{
	$lang = get_stylesheet_directory() . '/languages';
	load_child_theme_textdomain( 'Avada', $lang );
}
add_action( 'after_setup_theme', 'avada_lang_setup' );

function admin_enqueue( $hook ) 
{
	wp_enqueue_script( 'my_custom_script', get_stylesheet_directory_uri() . '/js/admin_custom.js' );
}
add_action('admin_enqueue_scripts', 'admin_enqueue');

// PAGE SLUG BODY CLASS
function add_slug_body_class( $classes )
{
	global $post;
	if ( isset( $post ) )
	{
		$classes[] = $post->post_type . '-' . $post->post_name;
	}
	return $classes;
}
add_filter( 'body_class', 'add_slug_body_class' );

function browser_body_class( $classes ) 
{
	global $is_lynx, $is_gecko, $is_IE, $is_opera, $is_NS4, $is_safari, $is_chrome, $is_iphone;
	
	if($is_lynx) $classes[] = 'lynx';
	elseif($is_gecko) $classes[] = 'gecko';
	elseif($is_opera) $classes[] = 'opera';
	elseif($is_NS4) $classes[] = 'ns4';
	elseif($is_safari) $classes[] = 'safari';
	elseif($is_chrome) $classes[] = 'chrome';
	elseif($is_IE) {
		$classes[] = 'ie';
		if(preg_match('/MSIE ([0-9]+)([a-zA-Z0-9.]+)/', $_SERVER['HTTP_USER_AGENT'], $browser_version))
			$classes[] = 'ie'.$browser_version[1];
	} 
	else {
		if (( strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false || strpos($_SERVER['HTTP_USER_AGENT'], 'Trident') !== false || strpos($_SERVER['HTTP_USER_AGENT'], 'Edge') !== false) && strpos($_SERVER['HTTP_USER_AGENT'], 'Win') !== false )
		{
			$classes[] = 'msie';
		}
		else {
			$classes[] = 'unknown';
		}
	}
	
	if($is_iphone) $classes[] = 'iphone';
	if ( stristr( $_SERVER['HTTP_USER_AGENT'],"mac") ) 
	{
		$classes[] = 'osx';
	} elseif ( stristr( $_SERVER['HTTP_USER_AGENT'],"linux") ) {
		$classes[] = 'linux';
	} elseif ( stristr( $_SERVER['HTTP_USER_AGENT'],"windows") ) {
		$classes[] = 'windows';
	}
	return $classes;
}
add_filter( 'body_class', 'browser_body_class' );

/*
 * WOOCOMMERCE
 * *************************************************** */

/*
 * Check and delete old files (more than one month life)
 */
function check_orders_files() {
	global $wpdb;
	
	$orders_posts = $wpdb->get_results( sprintf( 'SELECT * FROM %sposts WHERE post_type = "shop_order" AND post_date <= "%s"', $wpdb->prefix, date( 'Y-m-d', strtotime( '-30 days' ) ) ), OBJECT );

	foreach( $orders_posts as $order_post ){
		$gf_lead_meta = $wpdb->get_results( sprintf( 'SELECT entry_id FROM %sgf_entry_meta WHERE meta_value = %s AND meta_key = "woocommerce_order_number"', $wpdb->prefix, $order_post->ID ), OBJECT );
		if (!empty($gf_lead_meta)) {
			$gf_entry_id = $gf_lead_meta[0]->entry_id;
			$gf_lm = $wpdb->get_results( sprintf( 'SELECT meta_value FROM %sgf_entry_meta WHERE entry_id = %s AND meta_key = 31', $wpdb->prefix, $gf_entry_id ), OBJECT );
			if (!empty($gf_lm)) {
			$filesList = json_decode( $gf_lm[0]->meta_value );
				foreach( $filesList as $f ) {
					$uploads = wp_upload_dir();
					$file_path = str_replace( $uploads['baseurl'], $uploads['basedir'], $f );
					if ( file_exists( $file_path )) {
						unlink( $file_path );
					}
				}
			}
		}
	}
}
if (!wp_next_scheduled('check_orders_files_hook')) {
  wp_schedule_event( time(), 'weekly', 'check_orders_files_hook' );
}
add_action( 'check_orders_files_hook', 'check_orders_files' );

/* Deleting all the Sage Pay references */
function custom_woocommerce_email_customer_details ()
{
	echo '';
}

remove_action( 'woocommerce_email_customer_details', 'sage_woocommerce_email_customer_details', 99 );
add_action( 'woocommerce_email_customer_details', 'custom_woocommerce_email_customer_details', 99, 2 );
