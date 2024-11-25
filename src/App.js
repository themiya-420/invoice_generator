import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const invoiceRef = useRef();
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "001",
    issueDate: "24/11/2024",
    from: "BotSix",
    billTo: "Hostel Management",
    items: [
      {
        description: "React Native Application ( Android )",
        details:
          "Android application fully functional with features as mentioned by the client",
        nontaxable: "nontaxable",
        qty: 1,
        price: 35000.0,
      },
      {
        description: "React Admin Pannel",
        details:
          "Configured fully functional client side app to manage back end",
        nontaxable: "nontaxable",
        qty: 1,
        price: 5000.0,
      },
      {
        description: "Node.js Backend",
        details: "Fully functional backend to handle app and web contents",
        nontaxable: "nontaxable",
        qty: 1,
        price: 10000.0,
      },
    ],
    notes: "25,000 Should be paid as Advance to start the development",
  });

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "qty" || field === "price" ? Number(value) : value,
    };
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
  };

  const handleDownloadImage = () => {
    if (invoiceRef.current) {
      toPng(invoiceRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "invoice.png";
          link.click();
        })
        .catch((err) => {
          console.error("Error generating image:", err);
        });
    }
  };

  const handleDownloadPDF = () => {
    if (invoiceRef.current) {
      toPng(invoiceRef.current)
        .then((dataUrl) => {
          const pdf = new jsPDF();
          pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297); // A4 dimensions in mm
          pdf.save("invoice.pdf");
        })
        .catch((err) => {
          console.error("Error generating PDF:", err);
        });
    }
  };

  return (
    <div className="App">
      <div ref={invoiceRef} className="invoice">
        <div className="header">
          <div className="company">BotSix</div>
          <div className="invoice-details">
            <h1>INVOICE</h1>
            <p>#{invoiceData.invoiceNo}</p>
            <p>Issued {invoiceData.issueDate}</p>
          </div>
        </div>

        <div className="billing-info">
          <div className="from">
            <h2>FROM</h2>
            <p>{invoiceData.from}</p>
          </div>
          <div className="bill-to">
            <h2>BILL TO</h2>
            <p>{invoiceData.billTo}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>QTY</th>
              <th>Price, LKR</th>
              <th>Amount, LKR</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td className="description-cell">
                  <div className="description">{item.description}</div>
                  <div className="details">{item.details}</div>
                  <div className="nontaxable">{item.nontaxable}</div>
                </td>
                <td>{item.qty}</td>
                <td>රු.{item.price.toFixed(2)}</td>
                <td>රු.{(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total</td>
              <td>රු.{calculateTotal().toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="notes">
          <h3>NOTES & PAYMENTS INSTRUCTIONS</h3>
          <p>{invoiceData.notes}</p>
        </div>

        <div className="footer">
          <p>Inv. #{invoiceData.invoiceNo} 1 of 1</p>
        </div>
      </div>
      <button onClick={handleDownloadImage}>Download as Image</button>
      <button onClick={handleDownloadPDF}>Download as PDF</button>
    </div>
  );
}

export default App;
