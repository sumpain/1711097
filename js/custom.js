/*
 * 
 * 
 * WARNING: 
 * -------
 * every time you change a field in the backend here: /wp-admin/admin.php?page=gf_edit_forms&id=4
 * the system change the ids of the fields.
 * Then, for example, if you use #input_4_32, after the change the id will be different.
 * 
 * 
 */

// declare it globally, so the g_forms can get to this function too.
var readFiles; // ajax function to count all pages in the current multi-upload field

jQuery(document).ready(function ($) {

	var debug = true;
	
	var qtyInit = parseInt( jQuery("#input_4_32").html() );
	
	function getHashValue( key ) 
	{
		var matches = location.hash.match( new RegExp( key+'=([^&]*)' ));
		return matches ? matches[1] : null;
	}
	
	function removeHash( szHash )
	{
		if ( debug ) console.log( 'START REMOVE HASH' );
		
		var hashQty = window.location.hash;
		
		var tmpQty = getHashValue( szHash );

		if ( debug ) console.log( 'HASH BEFORE: ' + window.location.hash );
		
		window.location.hash = hashQty.replace( szHash + '=' + tmpQty, '');
		
		if ( debug ) console.log( 'HASH AFTER: ' + window.location.hash );
		
		return true;
	}
	
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
	
    if (jQuery('.woocommerce-message').length) {
        jQuery('.woocommerce .product').hide();
    }

    jQuery('.woocommerce .checkout.woocommerce-checkout #billing_country').change(function () {
        jQuery('.overseas.delivery').remove();
        if (jQuery(this).val() !== 'GB') {
            var p = '<p class="overseas delivery">Please: email us to organise overseas delivery</p>';
            jQuery('.woocommerce .checkout.woocommerce-checkout #billing_country_field').append(p);
        }
    });
    
    var zindex = 'z-index: 1;';
    if( jQuery( 'body' ).hasClass( 'msie' ))
    {
    	zindex = '';
    }
    	
    jQuery('#gform_browse_button_4_61').replaceWith('<a id="gform_browse_button_4_61" aria-describedby="extensions_message" tabindex="1" style="' + zindex + '" class="gform_button_select_files fusion-button button-flat fusion-button-pill button-large button-custom button-1" target="_self" href="#"><i class="fa fa-cloud-upload button-icon-left"></i><span class="fusion-button-text">Add files</span></a>');
    jQuery('.gform_anchor').remove();

    jQuery("#field_4_36").hide();  // label for the total pages
    jQuery("#gform_page_4_1 .gform_page_footer").hide();  // the next button

    /**
     * we go to the back and do an ajax call to a php function
     * tha function will get all files starting with the given ID number
     * Per file, it will do the count
     * and return the pages found
     */
    var updateFields = function( f, action ){
    	
        jQuery("#input_4_32").html( f ); // update the first page total
        jQuery("span#input_4_29").html( f ); // update the second page total

        jQuery("#ginput_quantity_4_34").val( f );
        /*jQuery("[name='quantity']").val( f );
        
        if ( 'reset' == action )
        {
        	// reset it to one. (option quantity should be one)
        	jQuery("#ginput_quantity_4_34").val( 1 );
        }*/
    }

    readFiles = function ( action ) {

        // get the form_id, generated by GF after the upload
        // var form_id = jQuery("input[name=gform_unique_id]").val();

        // get the file names of current (new) file selection
    	// get the file names of current (new) file selection
        var file_names = [];
        var original_file_names = [];
        var currentFile = null;
        jQuery('#gform_preview_4_61 div').each(function (e) {
        	
        	if ( null == currentFile )
        	{
        		currentFile = jQuery(this).attr( 'id' );
        		
        		if ( debug ) console.log( "CURRENT FILE::: " + currentFile );
        	}

        	var tmpFilename = jQuery( this ).attr('id');
        	var orgFilename = jQuery( this ).find( 'strong' ).text(); // jQuery( this )[0].innerText.trim();
        	
            file_names.push( tmpFilename );
            original_file_names.push( orgFilename );
        });
        
        var uploaded_files = jQuery.parseJSON( jQuery( '#gform_uploaded_files_4' ).attr( 'value' ) );
        
        var isPdf = false; // images
        jQuery( uploaded_files.input_61 ).each(function() {
        	
        	var ext = jQuery( this )[0].uploaded_filename.substr( jQuery( this )[0].uploaded_filename.length - 3 );
        	//var ext1 = jQuery( this )[0].temp_filename.substr( jQuery( this )[0].temp_filename.length - 3 );
        	
        	if ( debug ) console.log( "EXT::: " + ext );
        	
        	//if ( debug ) console.log( "EXT 1::: " + ext );
        	
        	if ( debug ) console.log( "COMPARE ::: " + currentFile + " ... " + jQuery( this )[0].temp_filename );
        	
    		if ( jQuery( this )[0].temp_filename.indexOf( currentFile ) > -1 && ext == 'pdf' )
    		{
    			isPdf = true;
    			return false; /* break the loop */
    		}
    	});

        if ( debug ) ( isPdf ) ? console.log( "CURRENT FILE IS A PDF" ) : console.log( "CURRENT FILE IS NOT A PDF" );

        /** ajax: provide the file_names, and get the total count back **/
        var dataToSend = {};
        dataToSend.file_names = file_names;
        dataToSend.original_file_names = original_file_names;
        
        $.post(
        	a.ajaxurl, 
        	{
        		action: 'get_pages',
        		data: dataToSend,
        	})
        	.done(function( r ){
        		var result = jQuery.parseJSON(r);
            	
                if ( debug ) console.log( "RESULT::: " );
                if ( debug ) console.log( result );

                var footer_class = '#gform_page_4_1 .gform_page_footer';
                	jQuery( footer_class ).attr( 'style', 'display: hide !important' );
                
                if( result.hasOwnProperty( 'exception' ))
                {
                	jQuery( '#input_4_32' ).html( result.exception );
                	
                	jQuery( footer_class ).hide();
                }
                else {
                	updateFields( result.count, null );
                	
                	jQuery( footer_class ).attr( 'style', 'display: block !important' );
                }
        	})
        	.fail(function(xhr, status, error) {
        		if( status == 500 || status == 0 )
        		{
        			// TODO ...
                    // internal server error or internet connection broke  
                	// console.log("internal server error or internet connection broke");
                }
        	});
        
        return false;
    };

    /**
     * will be triggered when a file has been uploaded by plupload (per file)
     */
    jQuery( window ).load(function () {
    	var checkMultiFileUploader = typeof window.gfMultiFileUploader !== 'undefined' ? true : false;
    	
    	if ( checkMultiFileUploader )
    	{
	        window.gfMultiFileUploader.uploaders.gform_multifile_upload_4_61.bind('FileUploaded', function (Up, File, Response) {
	            
	        	if ( debug ) console.log('file added. lets count');
	            
	            jQuery("#input_4_32").html("Calculating..");
	
	            readFiles( null );
	
	            jQuery("#input_4_32").html("Calculating...."); // cheap effect
	
	            if( this.total.uploaded == this.files.length) 
	            {
	                //jQuery(".gform_page_footer").slideDown();
	                jQuery("#field_4_36").slideDown();
	                
	                jQuery("#gform_page_4_1 .gform_page_footer").show();
	                jQuery("#gform_page_4_1 .gform_page_footer").attr("style", "display: block !important");
	            }
	        });
    	}
		jQuery('#gform_4 input:radio:checked').each(function() {
		   //jQuery(this).prop("checked", false);
		   jQuery(this).click();
		});
    });

    /**
     * set the quantity of this form to the amount of pages on the SECOND page
     */
    if ( jQuery("#ginput_quantity_4_34").val() != "" )
    {
        var qty = jQuery("#ginput_quantity_4_34").val();

        updateFields( qty, 'reset' );

		// show the fields again (hidden via style.css)
		$("button[type='submit'], .quantity").css('display', 'block');

    }
    
    // add hash qty - if there are errors in ORDER YOUR PLANS form, you can get the number with the hash 
    jQuery( document ).on( 'click', '#gform_submit_button_4', function( event ) {
    	
    	removeHash( 'form_4' );
    	removeHash( 'qty' );

    	window.location.hash = 'form_4&qty='+ jQuery( '#input_4_29' ).text();
	});
    
    if ( jQuery( '#gform_4') && window.location.hash.indexOf( 'qty' ) > -1 )
    {
    	var hash = location.hash.replace(/^.*?#/, '');
    	var pairs = hash.split('&');
    	var qty = pairs[1].split('=')[1];
    	
    	jQuery( pairs ).each(function() {
    		//if ( debug ) console.log( jQuery( this ) );
    	});

        updateFields( qty, 'reset' );
    }

    if ( jQuery( "#gform_page_4_1" ).css( "display" ) != 'none' )
    {
    	jQuery( "#gform_totals_4" ).hide();
    }

    /*encapsulation */
    jQuery( document ).on( 'click', '#choice_4_25_1', function( event ) {
    	
    	var encapsulationChecked = jQuery( this ).attr( 'checked' );
    	
    	jQuery('input[type="radio"]').each(function () {
    		
    		if ( encapsulationChecked )
    		{
    			if ( jQuery( this ).attr( 'value' ).indexOf( 'Folded' ) > -1 )
            	{
            		jQuery( this ).attr('checked', false);
            	}
            	if ( jQuery( this ).attr( 'value' ).indexOf( 'Rolled' ) > -1 )
            	{
            		jQuery( this ).attr('checked', true);
            	}	
    		}
        });
    });
    
    /* Manually Calculation Final Price */
    var variations = { 
    		docType: "",
    		size: "",
    		colours: "",
    		finish: "",
		    encapsulation: ""
    };

    jQuery( document ).on( 'click', '#gform_4 input[type=radio]', function( event ) {
    	if ( debug ) console.log( "CLICK ON RADIO BUTTON::: " + jQuery( this ).attr( 'id' ) );
    	switch ( jQuery( this ).attr( 'id' ) )
    	{
    		case 'choice_4_6_0':
    		case 'choice_4_6_1':
    			variations.docType = jQuery( this ).val();
    			final_price = 0;
    			//jQuery( '#input_4_999' ).text( '£0' );
    			break;
    		case 'choice_4_9_0':
    		case 'choice_4_9_1':
    		case 'choice_4_9_2':
    		case 'choice_4_9_3':
    		case 'choice_4_9_4':
    		case 'choice_4_13_0':
    		case 'choice_4_13_1':
    		case 'choice_4_13_2':
    			variations.size = jQuery( this ).val();
    			variations.finish = jQuery( this ).val();
				
    			if ( 'choice_4_13_0' == jQuery( this ).attr( 'id' ) || 
    					'choice_4_13_1' == jQuery( this ).attr( 'id' ) || 
    					'choice_4_13_2' == jQuery( this ).attr( 'id' ))
    			{
    				variations.colours = jQuery( '#choice_4_14_0' ).val();
        			variations.finish = jQuery( '#choice_4_17_0' ).val() || jQuery( '#choice_4_18_0' ).val() || jQuery( '#choice_4_19_0' ).val();
    			}
    			
    			break;
    		case 'choice_4_10_0':
    		case 'choice_4_10_1':
    		case 'choice_4_54_0':
    		case 'choice_4_54_1':
    		case 'choice_4_55_0':
    		case 'choice_4_55_1':
            case 'choice_4_56_0':
            case 'choice_4_56_1':
            case 'choice_4_57_0':
            case 'choice_4_57_1':
            case 'choice_4_58_0':
            case 'choice_4_58_1':
            case 'choice_4_59_0':
            case 'choice_4_59_1':
                variations.colours = jQuery( this ).val();
                break;				
    		case 'choice_4_14_0':
    		case 'choice_4_14_1':
    			variations.colours = jQuery( this ).val();
    			break;
    		case 'choice_4_11_0':
    		case 'choice_4_11_1':
    		case 'choice_4_15_0':
    		case 'choice_4_15_1':
    		//case 'choice_4_17_0':
    		case 'choice_4_37_0':
    		case 'choice_4_37_1':
    		case 'choice_4_39_0':
    		case 'choice_4_39_1':
    		case 'choice_4_40_0':
    		case 'choice_4_40_1':
    		case 'choice_4_41_0':
    		case 'choice_4_41_1':
    		case 'choice_4_42_0':
    		case 'choice_4_42_1':
    		case 'choice_4_43_0':
    		case 'choice_4_43_1':
    		case 'choice_4_44_0':
    		case 'choice_4_44_1':
    		case 'choice_4_45_0':
    		case 'choice_4_45_1':
    			variations.finish = jQuery( this ).val();
    			
    			if ( jQuery( this ).attr( 'value' ).indexOf( 'Folded' ) > -1 )
    			{
    				jQuery( '#choice_4_25_1' ).attr( 'checked', false );
    			}

    			break;
            case 'choice_4_25_0':
            case 'choice_4_25_1':
            case 'choice_4_47_0':
            case 'choice_4_47_1':
            case 'choice_4_48_0':
            case 'choice_4_48_1':
            case 'choice_4_49_0':
            case 'choice_4_49_1':
            case 'choice_4_50_0':
            case 'choice_4_50_1':
            case 'choice_4_51_0':
            case 'choice_4_51_1':
            case 'choice_4_52_0':
            case 'choice_4_52_1':
            case 'choice_4_53_0':
            case 'choice_4_53_1':
            case 'choice_4_54_0':
			case 'choice_4_54_1':	
            case 'choice_4_55_0':
            case 'choice_4_55_1':
            case 'choice_4_59_0':
            case 'choice_4_59_1':
				
                variations.encapsulation = jQuery( this ).val();
                break;				
    	}
    	
    	if ( debug ) console.log( "VARIATIONS::: " );
    	if ( debug ) console.log( variations );
    	
    	if ( variations.finish != '' )
    	{
    		var variation_price = parseFloat(variations.finish.split( '|' )[1]);
            var variation_size = parseFloat(variations.size.split( '|' )[1]);
			var variation_colours = (isNaN(variations.colours.split( '|' )[1])) ? 0 : parseFloat(variations.colours.split( '|' )[1]);
			var variation_encapsulation = (isNaN(variations.encapsulation.split( '|' )[1])) ? 0 : parseFloat(variations.encapsulation.split( '|' )[1]);
    		var qty = parseInt(jQuery( '#input_4_29' ).text());
    		// format the price to x.xx
    		/*var final_price = parseFloat(Math.round((variation_price * qty) * 100) / 100).toFixed(2);*/
			var final_price = parseFloat(Math.round(((variation_price + variation_encapsulation + variation_colours + variation_size) * qty) * 100) / 100).toFixed(2);

            if ( debug ) console.log( "VARIATION PRICE::: " + variation_price);
    		if ( debug ) console.log( "QTY::: " + qty );
    		if ( debug ) console.log( "FINAL PRICE::: " + final_price);
    		
    		jQuery( '#input_4_999' ).text( '£' + final_price );
    	}
    });
    
    // check email and confirm email on checkout page
    jQuery( '#customer_details a.continue-checkout' ).click(function( e ){
    	// clean properties
    	jQuery( '.woocommerce-NoticeGroup' ).remove();
    	jQuery( 'input[name=billing_email]' ).css( 'border-color', '#d2d2d2' );
		jQuery( 'input[name=billing_email-2]' ).css( 'border-color', '#d2d2d2' );

    	if ( jQuery( 'input[name=billing_email]' ).val() != jQuery( 'input[name=billing_email-2]' ).val() )
		{
    		e.preventDefault();
    		
    		jQuery( 'input[name=billing_email]' ).css( 'border-color', '#e7a9a9' );
    		jQuery( 'input[name=billing_email-2]' ).css( 'border-color', '#e7a9a9' );
    		
    		jQuery( '#billing_email-2_field' ).append(    		
    			'<div class="woocommerce-NoticeGroup woocommerce-NoticeGroup-checkout"><ul class="woocommerce-error"><li><strong>Email addresses</strong> do not match.</li></ul></div>'
    		);
    		
    		setTimeout(function(){
    			jQuery( '.woocommerce-checkout-nav li' ).attr( 'class', '' );
        		jQuery( '.woocommerce-checkout-nav li:first' ).attr( 'class', 'is-active' );

        		jQuery( '.col-1' ).css( 'display', 'block' );
        		jQuery( '.col-2' ).css( 'display', 'none' );
        		jQuery( '#order_review' ).css( 'display', 'none' );
        		
        		jQuery('html, body').animate({
        	        scrollTop: jQuery( 'input[name=billing_email]' ).offset().top
        	    }, 2000);
			}, 250);
		}
    });
    
    if ( jQuery( '#extensions_message' ).length > 0 )
    {
    	jQuery( '#extensions_message' ).html( jQuery( '#extensions_message' ).html().replace( 'jpeg, ', '' ));
    }
    
    if ( jQuery ( 'body' ).hasClass( 'woocommerce-order-received' ))
    {
    	jQuery( '.order_details .wc-item-meta li' ).each(function (e) {
    		if ( jQuery( this ).find( '.wc-item-meta-label' ).html().toLowerCase().indexOf( 'file' ) > -1 )
    		{
    			jQuery( this ).find( 'a' ).each(function (e) {
    				jQuery( this ).html( truncatefileName( jQuery( this )));
    			});
    		}
    	});
    }	
    
    if ( jQuery ( 'body' ).hasClass( 'page-checkout' ))
    {
        jQuery( 'dd.variation-File li a' ).each(function (e) {
			jQuery( this ).html( truncatefileName( jQuery( this )));
        });
    }
    
    // UPDATE CART when change the qty
    jQuery( document ).on( 'click', '.quantity .plus, .quantity .minus', function( event ) {
        jQuery( '.fusion-update-cart' ).click();
    });
    
    jQuery( '.quantity .qty' ).keypress(function ( e ) {
    	if( e.which == 13 ) // the enter key code
    	{
    		jQuery( '.fusion-update-cart' ).click();
    	}
    }); 
});
