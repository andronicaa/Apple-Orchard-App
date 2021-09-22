import jsPDF from 'jspdf';
import image from '../../../Imgs/about_img_blur.jpg';
export default function generatePdfReceipt(e, product, receiptType) {
    e.preventDefault();
    console.log("Produsul pentru pdf este: ", product);
    const currentMonth = new Date().getMonth() < 10 ? '0' +  (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
    const currentDay = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    const currentDate = new Date().getFullYear() + "-" + currentMonth + "-" +  currentDay;
    // obiect de tipul jspdf (pagina pdf)
    var doc = new jsPDF('p', 'pt');
    // logo-ul aplicatiei
    var w = doc.internal.pageSize.getWidth();
    var h = doc.internal.pageSize.getHeight();
    doc.setFont("times", 'bold');
    doc.setFontSize(30);
    doc.setTextColor(255, 0, 0);
    doc.text('Marulet', w/2, 70, {align: 'center'});
    doc.setTextColor(0,0,0);
    doc.setFontSize(15);
    doc.text("Data: " + currentDate, 10, 30);
    var today = new Date();
    var docPdfName = "receipt" + today + product.product + ".pdf";
    doc.setFontSize(25);
    doc.text("Detalii", 10, 130);
    doc.setFontSize(15);
    if(receiptType == 'substance') {
        doc.text("Achizitionare substante tratament", w/2, 100, {align: 'center'});
        doc.text("Produs: " + product.product, 10, 160);
        doc.text("Cantitate achizitionata: " + product.quantity + " kg", 10, 180);
        doc.text("Luna achizitionarii: " + product.month, 10, 200);
        doc.text("Pret: " + product.price + product.currency, 10, 220);
    }
    if(receiptType == "trees") {
        doc.text("Achizitionare pomi", w/2, 100, {align: 'center'});
        doc.text("Soi: " + product.name, 10, 160);
        doc.text("Cantitate achizitionata: " + product.quantity + " kg", 10, 180);
        doc.text("Luna achizitionarii: " + product.month, 10, 200);
        doc.text("Pret: " + product.price + product.currency, 10, 220);
    }
    if(receiptType == "equipment") {
        doc.text("Achizitionare utilaj", w/2, 100, {align: 'center'});
        doc.text("Nume: " + product.nameEq, 10, 160);
        doc.text("Tip: " + product.type + " kg", 10, 180);
        doc.text("Luna achizitionarii: " + product.month, 10, 200);
        doc.text("Pret: " + product.price + product.currency, 10, 220);
        doc.text("Categorii permis necesare: " + product.driverCateg, 10, 240);
        doc.text("Capacitate cilindrica: " + product.capacity, 10, 260);
    }
    doc.save(docPdfName);
}