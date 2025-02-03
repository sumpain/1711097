
jQuery(document).ready(function ($) {
	
	var debug = false;
	
	function truncatefileName( element )
	{
		var arrParts = element.html().split( '/' );
		
		var fileName = arrParts[ arrParts.length - 1 ];
		
		/*var size = fileName.length;
		if( fileName.length > 15 )
		{
			size = fileName.length - 15;
			fileName = '...' + arrParts[ arrParts.length - 1 ].substr( size );
		}*/

		return fileName;
	}
	
	/*
    *
    * ==============================
    *
    * WOOCOMMERCE ORDERS - LIST PAGE
    *
    * ==============================
    * 
    */
	if ( jQuery ( 'body' ).hasClass( 'wp-admin' ) && jQuery( 'body' ).hasClass( 'post-type-shop_order' ) && jQuery( '.wp-list-table' ).length > 0 )
	{
		jQuery('[data-popup-close]').on('click', function( e )
		{
	        jQuery('[data-popup="popup-orders"]').fadeOut( 350 );
	 
	        e.preventDefault();
	    });
		
		jQuery('button[type="button"][name="remove_old_orders"]').on('click', function( e )
		{
	        e.preventDefault();
	        
	        loading = jQuery( this ).siblings( '.loading' );
	        
	        jQuery( this ).fadeOut( 150 );
	        loading.fadeIn( 350 );

	        jQuery.post(ajaxurl, {
					action: 'deleteOldOrders',
					data: {},
				},
				function ( data, status ) {
					
		        	if ( debug ) console.log( "Result WOOCOMMERCE ORDERS - LIST PAGE (delete old orders)::: " ) ;
		        	if ( debug ) console.log( data ) ;
					if ( debug ) console.log( data.files_deleted ) ;
					
					if( data.files_deleted > 0 || data.options_deleted > 0 )
					{
						loading.fadeOut( 350 );
						
						jQuery( '.popup[data-popup="popup-orders"]' ).find( '.number_file_deleted' ).html( data.files_deleted );
						jQuery( '.popup[data-popup="popup-orders"]' ).find( '.number_options_deleted' ).html( data.options_deleted );
						
						jQuery( '.popup[data-popup="popup-orders"]' ).find( 'p.user_message' ).fadeIn();
					}
				}
			);
	        
	        setTimeout(function() { 
	        	jQuery('[data-popup="popup-orders"]').fadeOut( 350 ); 
	        }, 5000);
	    });

		jQuery.post(ajaxurl, {
				action: 'checkOldOrders',
				data: {},
			},
			function ( data, status ) {
				
	        	if ( debug ) console.log( "Result WOOCOMMERCE ORDERS - LIST PAGE (check old orders)::: " ) ;
	        	if ( debug ) console.log( data ) ;
				if ( debug ) console.log( data.count_old_orders ) ;
				
				if( data.count_old_orders > 0 )
				{
			        jQuery( '.popup[data-popup="popup-orders"]' ).fadeIn( 350 );
				}
			}
		);
	}
	
	/*
    *
    * ================================
    *
    * WOOCOMMERCE ORDER - DETAILS PAGE
    *
    * ================================
    * 
    */
    if ( jQuery ( 'body' ).hasClass( 'wp-admin' ) && jQuery( 'body' ).hasClass( 'post-type-shop_order' ))
    {
    	jQuery( '#order_line_items .display_meta tbody tr:first-child td' ).append( '<span class="replaced_loading_file">Loading...</span>' );
    	
    	if ( debug ) console.log( "ajaxurl::: " + ajaxurl ) ;
    	
    	jQuery.post(ajaxurl, {
	            action: 'getOptionsNumberPagesToFile',
	            data: { "postID": jQuery( '#post_ID' ).val() },
	        },
	        function ( data, status ) {
	        	
	        	var result = jQuery.parseJSON( data );
	        	
	        	if ( debug ) console.log( "Result WOOCOMMERCE ORDER - DETAILS PAGE ::: " ) ;
	        	if ( debug ) console.log( result ) ;
	        	
    			jQuery( '#order_line_items .display_meta tbody tr:first-child td a' ).each(function (e) {
    				
    				var objAnchorFilename = jQuery( this );
    				
    				var arr_long_name = objAnchorFilename.html().split( '/' );
    				var fileName = arr_long_name[ arr_long_name.length - 1 ];
    				
    				if ( debug ) console.log( "FileName ::: " + fileName ) ;
    				
    				var truncateName = truncatefileName( objAnchorFilename );
    				
    				objAnchorFilename.html( truncateName );
    				objAnchorFilename.attr( 'target', '_blank' );
    				
    				// ADD TOT PAGES
    				if ( result != null )
    	        	{
	    				var c = 0;
	    	        	jQuery.each( result.files, function( i, val ) {
	    	        		
	    	        		if ( debug ) console.log( "OOO ::: " + fileName + " ... " + val + " ... " + result.tot_pages[c] ); 
	    	        		
	    	        		if ( fileName.indexOf( val.split( '.' )[0] ) !== -1 )
		        			{
	    	        			var labelPage = 'page';
	    	        			if ( parseInt( result.tot_pages[c] ) > 1 )
	    	        			{
	    	        				labelPage = 'pages';
	    	        			}
	    	        			
	    	        			var finalString = truncateName + ' - ' + result.tot_pages[c] + ' ' + labelPage;
	    	        		
	    	        			if ( debug ) console.log( "FINAL ::: " + finalString ) ;
	    	        			
	    	        			objAnchorFilename.html( finalString );
	    	        			return;
		        			}
	    	        		
	    	        		c++;
	    	        	});
    	        	}
    			});
	        	
	        	// replace ',' with an ordered list
	        	var file_lists = jQuery( '#order_line_items .display_meta tbody tr:first-child td p' );
	        	if( file_lists.length == 0 )
	        	{
	        		jQuery( '#order_line_items .display_meta tbody tr:first-child td' ).append( '<span class="no_results">Weird... no files found! try later.</span>' );
	        	}
	        	else {
		        	jQuery( file_lists ).each(function ( k, el ) {
		        		
		        		if ( debug ) console.log(k);
		        		if ( debug ) console.log(el);
		        		
		        		if ( typeof jQuery( el ).html() !== 'undefined' )
			        	{
				        	if ( jQuery( el ).html() != '' )
				        	{
				        		var newValue = jQuery( el ).html().replace( /\,/g, '' );
				        		jQuery( el ).html( newValue );
				        	}
				        	jQuery( el ).show();
				        	jQuery( el ).find( 'a' ).wrap( '<li></li>' );
			        	}
		        		
		        		jQuery( el ).find( 'li' ).wrapAll( '<ul style="list-style-type:decimal;"></ul>"' );
		        	});
		        	
		        	jQuery( '.replaced_loading_file' ).remove();
		        	jQuery( '.no_results' ).remove();
	        	}
	        }
	    );
    }
});
