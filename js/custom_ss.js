/**
 * custom js to read the pdf pages
 *  enqueued are two extra helper files:
 *
 *      <script src="https://frontenddeveloping.github.io/pdfjs-dist/build/pdf.js"></script>
 *      <script src="https://frontenddeveloping.github.io/pdfjs-dist/build/pdf.worker.js"></script>
 *
 */
var pdfPagesCnt;

jQuery(document).ready(function ($) {

    window.onload = function () {

        /* read a single file input */
        /**
         * this can be changed to read all file inputs
         * per file:
         *  read the file pages and add it up
         *  when all files are ready, update the total
         *
         * on any change (delete/add extra file)
         * read ALL files again
         *
         */

        document.getElementById('input_4_2').addEventListener('change', function (e) {

            console.log(this.files[0]);

            var file = this.files[0];
            linkCounter = 0;
            if (!file) {
                return;
            }

            var fileReader = new FileReader();

            fileReader.onload = function (e) {

                readPDFFile(new Uint8Array(e.target.result));

            };

            fileReader.readAsArrayBuffer(this.files[0]);

        });

    };

    function readPDFFile(pdf) {
        PDFJS.getDocument({data: pdf}).then(function (pdf) {

            pdfPagesCnt =  pdf.pdfInfo.numPages;

            /*
             this is the count per page
             catch it for the grand total
             */
            console.log(pdfPagesCnt);

        });
    };

});