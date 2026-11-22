import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/enquiries`, {        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.name,
          email: form.email,
          phone: form.phone,
          organization: form.organization,
          message: form.message,
          items: [],
        }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Enquiry submission failed");
        }
      });

      setStatus("success");

      setForm({
        name: "",
        email: "",
        phone: "",
        organization: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">
        <section className="contact-heading">
          <span>GET IN TOUCH</span>
          <h1>Let's discuss your requirements.</h1>
          <p>
            Tell us what products your institution is looking for. Submit an
            enquiry and share your requirements with us.
          </p>
        </section>

        <section className="contact-layout">
          <div className="contact-info">
            <span>GRAMSUPPLY</span>
            <h2>How can we assist you?</h2>

            <p>
              Use this form to send a product enquiry or discuss an
              institutional procurement requirement.
            </p>

            <div className="contact-info-line">
              <strong>Product information</strong>
              <span>Ask about catalogue products and specifications.</span>
            </div>

            <div className="contact-info-line">
              <strong>Institutional enquiries</strong>
              <span>Share your organisation's requirements.</span>
            </div>

            <Link to="/products">Explore product catalogue →</Link>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send an enquiry</h2>

            <label>Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label>Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label>Phone number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />

            <label>Organisation</label>
            <input
              name="organization"
              value={form.organization}
              onChange={handleChange}
              placeholder="Gram Panchayat / Institution"
            />

            <label>Your requirements</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe the products or assistance you need..."
              rows="5"
              required
            />

            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Submitting..." : "Submit enquiry"}
            </button>

            {status === "success" && (
              <p className="contact-success">
                Your enquiry was submitted successfully.
              </p>
            )}

            {status === "error" && (
              <p className="contact-error">
                Unable to submit your enquiry. Please try again.
              </p>
            )}
          </form>
        </section>
      </main>
    </>
  );
}

export default Contact;
