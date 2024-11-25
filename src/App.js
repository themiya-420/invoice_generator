import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { format } from "date-fns";
import "./App.css";

function App() {
  const invoiceRef = useRef();
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "001",
    issueDate: format(new Date(), "dd/MM/yyyy"),
    from: "BotSix",
    billTo: "Hostel Management",
    items: [],
    notes: "50% Should be paid as Advance to start the development",
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
      invoiceRef.current.classList.add("printing");

      toPng(invoiceRef.current, {
        quality: 1.0,
        backgroundColor: "white",
        style: {
          background: "white",
        },
      })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "invoice.png";
          link.click();
        })
        .catch((err) => {
          console.error("Error generating image:", err);
        })
        .finally(() => {
          invoiceRef.current.classList.remove("printing");
        });
    }
  };

  const handleDownloadPDF = () => {
    if (invoiceRef.current) {
      invoiceRef.current.classList.add("printing");

      toPng(invoiceRef.current, {
        quality: 1.0,
        backgroundColor: "white",
        style: {
          background: "white",
        },
      })
        .then((dataUrl) => {
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(dataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("invoice.pdf");
        })
        .catch((err) => {
          console.error("Error generating PDF:", err);
        })
        .finally(() => {
          invoiceRef.current.classList.remove("printing");
        });
    }
  };

  const handleFieldChange = (field, value) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  const handleAddItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          description: "",
          details: "",
          nontaxable: "",
          qty: 1,
          price: 0,
        },
      ],
    });
  };

  const handleDeleteItem = (index) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const handleDateChange = (date) => {
    setInvoiceData({
      ...invoiceData,
      issueDate: format(new Date(date), "dd/MM/yyyy"),
    });
  };

  return (
    <div className="App">
      <div ref={invoiceRef} className="invoice">
        <div className="header">
          <div className="company">
            <input
              value={invoiceData.from}
              onChange={(e) => handleFieldChange("from", e.target.value)}
              className="company-input"
            />
          </div>
          <div className="invoice-details">
            <h1>INVOICE</h1>
            <p>
              #
              <input
                value={invoiceData.invoiceNo}
                onChange={(e) => handleFieldChange("invoiceNo", e.target.value)}
                className="small-input"
              />
            </p>
            <p>
              Issued{" "}
              <input
                type="date"
                value={format(
                  new Date(
                    invoiceData.issueDate.split("/").reverse().join("-")
                  ),
                  "yyyy-MM-dd"
                )}
                onChange={(e) => handleDateChange(e.target.value)}
                className="date-input"
              />
            </p>
          </div>
        </div>

        <div className="billing-info">
          <div className="from">
            <h2>FROM</h2>
            <input
              value={invoiceData.from}
              onChange={(e) => handleFieldChange("from", e.target.value)}
            />
          </div>
          <div className="bill-to">
            <h2>BILL TO</h2>
            <input
              value={invoiceData.billTo}
              onChange={(e) => handleFieldChange("billTo", e.target.value)}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>QTY</th>
              <th>Price, LKR</th>
              <th>Amount, LKR</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td className="description-cell">
                  <input
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    className="description-input"
                    placeholder="Item description"
                  />
                  <input
                    value={item.details}
                    onChange={(e) =>
                      handleItemChange(index, "details", e.target.value)
                    }
                    className="details-input"
                    placeholder="Item details"
                  />
                  <input
                    value={item.nontaxable}
                    onChange={(e) =>
                      handleItemChange(index, "nontaxable", e.target.value)
                    }
                    className="nontaxable-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                    className="qty-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    className="price-input"
                  />
                </td>
                <td>රු.{(item.qty * item.price).toFixed(2)}</td>
                <td className="actions-column">
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Total</td>
              <td>රු.{calculateTotal().toFixed(2)}</td>
              <td className="actions-column">
                <button onClick={handleAddItem} className="add-btn">
                  Add Item
                </button>
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="notes">
          <h3>NOTES & PAYMENTS INSTRUCTIONS</h3>
          <textarea
            value={invoiceData.notes}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
            className="notes-input"
            placeholder="Enter notes and payment instructions"
          />
        </div>

        <div className="footer">
          <p>Inv. #{invoiceData.invoiceNo} 1 of 1</p>
        </div>
      </div>
      <div className="actions">
        <button onClick={handleDownloadImage}>Download as Image</button>
        <button onClick={handleDownloadPDF}>Download as PDF</button>
      </div>
    </div>
  );
}

export default App;
