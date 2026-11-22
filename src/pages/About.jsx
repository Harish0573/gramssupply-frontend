import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./About.css";

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">
        <section className="about-hero">
          <span>ABOUT GRAMSUPPLY</span>

          <h1>
            Making institutional
            <br />
            procurement simpler.
          </h1>

          <p>
            GramSupply is a product catalogue and enquiry platform designed to
            help institutions explore supplies for infrastructure, technology,
            sanitation and everyday needs.
          </p>
        </section>

        <section className="about-content">
          <div>
            <span className="about-kicker">OUR PURPOSE</span>
            <h2>A convenient place to explore institutional supplies.</h2>
          </div>

          <p>
            From office furniture and computers to lighting, water systems and
            village infrastructure products, GramSupply brings different
            procurement categories together in one organised catalogue.
          </p>
        </section>

        <section className="about-values">
          <article>
            <span>01</span>
            <h3>Product discovery</h3>
            <p>Browse products across categories from one platform.</p>
          </article>

          <article>
            <span>02</span>
            <h3>Clear information</h3>
            <p>Explore product descriptions and available details.</p>
          </article>

          <article>
            <span>03</span>
            <h3>Enquiry-based process</h3>
            <p>Share your requirements to request further information.</p>
          </article>
        </section>

        <section className="about-cta">
          <h2>Explore the GramSupply catalogue.</h2>
          <Link to="/products">Browse products →</Link>
        </section>
      </main>
    </>
  );
}

export default About;
