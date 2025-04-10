import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInvoices, getPaymentMethods, getPayments, createPayment, getProfile, getCredits, addCredits, createInvoice } from "../../api";
import "./credits.css";

export default function Credits() {
  const [invoices, setInvoices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [payments, setPayments] = useState([]);
  const [credits, setCredits] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amountToPay, setAmountToPay] = useState(""); // Monto ingresado por el usuario
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener idUsuario desde el perfil
        const profileData = await getProfile();
        console.log("Perfil obtenido:", profileData);
        setUserId(profileData.id || 15); // "id" según el token

        // Obtener créditos
        const creditsData = await getCredits();
        console.log("Créditos obtenidos:", creditsData);
        setCredits(creditsData.cantidad || 0);

        // Obtener facturas
        const invoicesData = await getInvoices();
        console.log("Facturas obtenidas:", invoicesData);
        setInvoices(invoicesData || []);

        // Obtener métodos de pago
        const methodsData = await getPaymentMethods();
        console.log("Métodos de pago obtenidos:", methodsData);
        setPaymentMethods(methodsData.filter((m) => m.activo) || []);

        // Obtener pagos
        const paymentsData = await getPayments();
        console.log("Pagos obtenidos:", paymentsData);
        setPayments(paymentsData || []);

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setInvoices([]);
        setPaymentMethods([]);
        setPayments([]);
        setCredits(0);
        setLoading(false);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleCreateInvoiceAndPay = async (e) => {
    e.preventDefault();
    if (!amountToPay || !selectedMethod) {
      alert("Por favor, ingresa un monto y selecciona un método de pago.");
      return;
    }

    const monto = parseFloat(amountToPay);
    if (isNaN(monto) || monto <= 0) {
      alert("Por favor, ingresa un monto válido.");
      return;
    }

    try {
      // Paso 1: Crear la factura
      const invoiceData = {
        idPago: 0, // Se actualizará tras el pago si el backend lo requiere
        numeroFactura: Date.now(), // Número único temporal
        totalPagar: monto,
        estadoFactura: "Pendiente",
      };
      const newInvoice = await createInvoice(invoiceData);
      console.log("Factura creada:", newInvoice);
      setInvoices((prev) => [...prev, newInvoice]);
      setSelectedInvoice(newInvoice);

      // Paso 2: Crear el pago asociado a la factura
      const paymentData = {
        monto: monto,
        estado: "Pendiente",
        fechaPago: new Date().toISOString(),
        idUsuario: userId,
        metodoPago: parseInt(selectedMethod),
      };
      const newPayment = await createPayment(paymentData);
      console.log("Pago creado exitosamente:", newPayment);
      setPayments((prev) => [...prev, newPayment]);

      // Paso 3: Agregar créditos basados en el monto pagado
      const creditsToAdd = Math.floor(monto); // 1 crédito = 1 unidad monetaria (ajusta si es diferente)
      const creditData = {
        idUsuario: userId,
        cantidad: creditsToAdd,
      };
      const updatedCredits = await addCredits(creditData);
      console.log("Créditos agregados:", updatedCredits);
      setCredits(updatedCredits.cantidad || credits + creditsToAdd);

      // Limpiar formulario
      setAmountToPay("");
      setSelectedMethod("");
      setSelectedInvoice(null);
      alert(`Factura creada y pago realizado con éxito. Se agregaron ${creditsToAdd} créditos.`);
    } catch (error) {
      console.error("Error al procesar la factura, pago o créditos:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setAmountToPay(invoice.totalPagar.toString());
    setSelectedMethod("");
  };

  if (loading) return <div className="screen-container">Cargando...</div>;

  return (
    <div className="credits-container">
      {/* Créditos Disponibles en la Esquina Superior */}
      <div className="credits-display">
        Créditos Disponibles: {credits}
      </div>

      <h1>Comprar Créditos</h1>

      {/* Formulario para Crear Factura y Pagar */}
      <div className="payment-section">
        <h2>Crear Factura y Pagar</h2>
        <form className="payment-form" onSubmit={handleCreateInvoiceAndPay}>
          <div className="form-group">
            <label>Monto a Pagar:</label>
            <input
              type="number"
              value={amountToPay}
              onChange={(e) => setAmountToPay(e.target.value)}
              placeholder="Ingresa el monto"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Método de Pago:</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              required
            >
              <option value="">Selecciona un método</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.nombreMetodo}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Crear Factura y Pagar</button>
        </form>
      </div>

      {/* Lista de Facturas */}
      <div className="invoices-section">
        <h2>Tus Facturas</h2>
        {invoices.length > 0 ? (
          <div className="invoice-list">
            {invoices.map((invoice) => (
              <div
                key={invoice.numeroFactura}
                className={`invoice-item ${selectedInvoice?.numeroFactura === invoice.numeroFactura ? "selected" : ""}`}
                onClick={() => handleInvoiceSelect(invoice)}
              >
                <span>Factura #{invoice.numeroFactura}</span>
                <span>Total: ${invoice.totalPagar}</span>
                <span>Estado: {invoice.estadoFactura}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay facturas disponibles.</p>
        )}
      </div>

      {/* Historial de Pagos */}
      <div className="payments-section">
        <h2>Tus Pagos</h2>
        {payments.length > 0 ? (
          <div className="payment-list">
            {payments.map((payment) => (
              <div key={payment.id} className="payment-item">
                <span>ID: {payment.id}</span>
                <span>Monto: ${payment.monto}</span>
                <span>Estado: {payment.estado}</span>
                <span>Fecha: {new Date(payment.fechaPago).toLocaleString()}</span>
                <span>Método: {paymentMethods.find((m) => m.id === payment.metodoPago)?.nombreMetodo || "Desconocido"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay pagos registrados aún.</p>
        )}
      </div>
    </div>
  );
}