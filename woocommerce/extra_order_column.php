<?php
/**
 * in the backend add extra column for the order
 * this column will present a new 'download' button
 * when pressed, it will download all files of this order in one zip
 *
 */

// ADDING COLUMN TITLES (Here 2 columns)
add_filter( 'manage_edit-shop_order_columns', 'custom_shop_order_column', 11 );
function custom_shop_order_column( $columns ) {
	//add columns
	$columns['download_files'] = __( 'Download files', 'theme_slug' );

	return $columns;
}

// adding the data for each orders by column (example)
add_action( 'manage_shop_order_posts_custom_column', 'custom_orders_list_column_content', 10, 2 );
function custom_orders_list_column_content( $column ) {
	global $post, $woocommerce, $the_order;
	$order_id = $the_order->id;

	switch ( $column ) {
		case 'download_files' :
			$myVarOne = wc_get_order_item_meta( $order_id, '_the_meta_key1', TRUE );
			echo '<a class="button tips download" href="' . get_site_url() . "/download/?order_id=" . $order_id . '">Download</a>';

			break;

	}
}