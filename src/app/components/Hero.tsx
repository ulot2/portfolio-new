import React from "react";

export const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div>
        <h1 className="hero-title fade-up delay-1">Toluwalope Adegoke</h1>

        <p className="hero-tagline fade-up delay-2">Frontend Developer</p>

        <div className="fade-up delay-3">
          <span className="availability">
            <span className="availability-dot" />
            Open to Work
          </span>
        </div>

        <p className="hero-bio fade-up delay-4">
          I am a Frontend Developer with a passion for building beautiful,
          responsive, and high-performance web applications. With over 2 years
          of experience, I specialize in the React ecosystem, design systems,
          and bridging the gap between design and engineering.
        </p>

        <p className="hero-bio fade-up delay-5">
          I put <strong className="text-white">user experience first</strong> at
          the center of everything I build. Whether improving performance or
          fine-tuning interactions, my aim is to create software that feels
          seamless and intuitive.
        </p>
      </div>
    </section>
  );
};
