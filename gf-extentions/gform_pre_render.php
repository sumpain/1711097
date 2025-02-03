<?php
/**
 * this filter will alter the actual link to delete an uploaded file
 * (multiple file uploader)
 *
 * We add in an this hook, cause we want to count the new number of pages of the files that
 * are still in the list, AFTER one of them has been deleted.
 *
 * So, altered the 'onclick' event, to hook into custom function again
 *
 */

add_action( 'gform_pre_render', 'set_number_of_uploaded_images' );

// Set the uploaded images count field and make it readonly
function set_number_of_uploaded_images( $form ) {
	//	// only run hook for form_id = 1
	//	if ( $form['id'] != 1 ) {
	//		return $form;
	//	}
	ob_start();
?>
    <script type="text/javascript">

        // when deleting a file, recount the pages of the files left
        function deletingFiles(formId, fieldId, f) {
			// console.log('Deleted a file. Lets count pages');
            readFiles( 'delete' );
        }

        var checkForm = typeof gform !== 'undefined' ? true : false;
		
        if ( checkForm )
        {
	        gform.addFilter('gform_file_upload_markup', function (html, file, up, strings, imagesUrl) {
	            var formId = up.settings.multipart_params.form_id,
	                fieldId = up.settings.multipart_params.field_id;
	
	            /*html = '<strong>' + file.name + "</strong> <img class='gform_delete' "
	                + "src='" + imagesUrl + "/delete.png' "
	                + "onclick='gformDeleteUploadedFile(" + formId + "," + fieldId + ", this); deletingFiles(" + formId + ", " + fieldId + ", this);' "
	                + "alt='" + strings.delete_file + "' title='" + strings.delete_file + "' />";*/

				html = '<strong>' + file.name + "</strong> <img class='gform_delete' "
	                + "src='https://www.printingandplotting.co.uk/wp-content/plugins/gravityforms/images/delete.png' "
	                + "onclick='gformDeleteUploadedFile(" + formId + "," + fieldId + ", this); deletingFiles(" + formId + ", " + fieldId + ", this);' "
	                + "alt='Delete this file' title='Delete this file' />";
	            	
	            return html;
	        });
        }
    </script>
<?php
	ob_end_clean();
	return $form;
}