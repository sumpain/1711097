<?php
/**
 * some functions here.
 *
 * Lets keep it clear boys!
 *
 *
 */
/*
 * include the ajax calls
 */
include_once ('wp-extensions/ajax_calls.php');
/*
 * include the header files
 */
include_once ('wp-extensions/header_enqueue.php');
/*
 * alter the gravity forms rendering of links
 */
include_once ('gf-extentions/gform_pre_render.php');
/*
 * add extra column to the woocommecer backend (orders)
 */
include_once ('woocommerce/extra_order_column.php');
/*
 * add woocommerce customization
 */
include_once ('woocommerce/customization.php');
/*
 * add general utilities
 */
include_once ('utilities.php');


/*STOPPING ADMIN NOTIFICATIONS ON NEW USER*/

if ( !function_exists( 'wp_new_user_notification' ) ) :
function wp_new_user_notification( $user_id, $plaintext_pass = '' ) {
    $user = get_userdata( $user_id );

    $user_login = stripslashes($user->user_login);
    $user_email = stripslashes($user->user_email);

    $blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);

    if ( empty($plaintext_pass) ) {
        return;
    }

    $message  = sprintf(__('Username: %s'), $user_login) . "\r\n";
    $message .= sprintf(__('Password: %s'), $plaintext_pass) . "\r\n";
    $message .= wp_login_url() . "\r\n";

    wp_mail($user_email, sprintf(__('[%s] Your username and password'), $blogname), $message);
}
endif;