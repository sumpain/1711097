<?php 
/*
 * enlist all header files
 *
 *
 */
function theme_enqueue_styles() {
	wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', array( 'avada-stylesheet' ) );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );
function theme_enqueue_script() {
	/* add some extra scripts in here */
	/* custom script for reading the pdf pages
	wp_enqueue_script( 'pdf-js', get_stylesheet_directory_uri() . '/js/pdf.js',  true );
	wp_enqueue_script( 'pdf-worker-js', get_stylesheet_directory_uri() . '/js/pdf.worker.js',  true );
	wp_enqueue_script( 'my-js-ss', get_stylesheet_directory_uri() . '/js/custom_ss.js',  true );
	 * 
	 */
	/* some other customs stuff */
	wp_enqueue_script( 'my-js', get_stylesheet_directory_uri() . '/js/custom.js', array(), null );
	wp_localize_script( 'my-js', 'a', array( // URL to wp-admin/admin-ajax.php to process the request
	                                         'ajaxurl'          => admin_url( 'admin-ajax.php' ),
	                                         // generate a nonce with a unique ID "myajax-post-comment-nonce"
	                                         // so that you can check it later when an AJAX request is sent
	                                         'postCommentNonce' => wp_create_nonce( 'penp-rumble-nonce' )
	) );
}
add_action( 'wp_enqueue_scripts', 'theme_enqueue_script' );
function my_custom_fonts() 
{
	wp_enqueue_style( 'admin-child-style', get_stylesheet_directory_uri() . '/style-admin.css', array() );
}
add_action('admin_head', 'my_custom_fonts');
/* add google analytics to footer */
function add_google_analytics() 
{
	?>
		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})
		  (window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		  ga('create', 'UA-103177637-8', 'auto');
		  ga('send', 'pageview');		
		</script>
	<?php
}
add_action('wp_footer', 'add_google_analytics');