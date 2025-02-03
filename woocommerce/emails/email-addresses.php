<?php
/**
 * Email Addresses
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-addresses.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates/Emails
 * @version     3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$text_align = is_rtl() ? 'right' : 'left';

?>

<div class="customer details contact">
	<h2 style='color: #8cc640; display: block; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif; font-size: 18px; font-weight: bold; line-height: 130%; margin: 16px 0 8px; text-align: left;'>
		<?php _e( 'Customer details', 'woocommerce' ); ?>
	</h2>
	<ul>
		<?php if ( $order->get_customer_note() ) : ?>
			<li>
		        <strong><?php _e( 'Note', 'woocommerce' ); ?>:</strong> 
		        <span class="text" style='color: #3c3c3c; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;'>
		        	<?php echo wptexturize( $order->get_customer_note() ); ?>
		        </span>
		    </li>
		<?php endif; ?>
		<?php if ( $order->get_billing_email() ) : ?>
		    <li>
		        <strong><?php _e( 'Email address', 'woocommerce' ); ?>:</strong> 
		        <span class="text" style='color: #3c3c3c; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;'>
		        	<?php echo $order->get_billing_email(); ?>
		        </span>
		    </li>
	    <?php endif; ?>
	    <?php if ( $order->get_billing_phone() ) : ?>
		    <li>
		        <strong><?php _e( 'Phone', 'woocommerce' ); ?>:</strong> 
		        <span class="text" style='color: #3c3c3c; font-family: "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif;'>
		        	<?php echo $order->get_billing_phone(); ?>
		        </span>
		    </li>
		<?php endif; ?>
	</ul>
</div>
