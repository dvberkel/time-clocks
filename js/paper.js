/*global document, Reveal, PDFJS*/
;(function(document, Reveal, PDFJS){
    'use strict';
    var alreadyRendered = false;
    Reveal.addEventListener('pdf', function(){
        if (!alreadyRendered) {
            alreadyRendered = true;
            var canvas = document.getElementById('pdf');
            var context = canvas.getContext('2d');

            PDFJS.getDocument('pdf/time-clocks.pdf')
                .then(function(pdf){
                    return pdf.getPage(1);
                })
                .then(function(page){
                    var originalViewport = page.getViewport(1);
                    var scale = canvas.width / originalViewport.width;
                    page.render({
                        canvasContext: context,
                        viewport: page.getViewport(scale)
                    });

                });
        }
    });
})(document, Reveal, PDFJS);
