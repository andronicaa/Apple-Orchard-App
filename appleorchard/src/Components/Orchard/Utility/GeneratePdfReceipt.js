import jsPDF from 'jspdf';

export default function generatePdfReceipt(e, product) {
    e.preventDefault();

    // obiect de tipul jspdf (pagina pdf)
    var doc = new jsPDF('p', 'pt');
    // logo-ul aplicatiei
    var w = doc.internal.pageSize.getWidth();
    doc.setFont("times");
    doc.setTextColor(255, 0, 0);
    doc.text('Pixie Crunch', w/2, 70, {align: 'center'});
    var today = new Date();
    var docPdfName = "receipt" + today + product.product + ".pdf";
    doc.save(docPdfName);
}