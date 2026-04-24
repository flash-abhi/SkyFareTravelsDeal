import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  PhoneCall,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useContact } from "../context/ContactContext";
import SearchWidget from "../components/SearchWidget";
import "./HomeNew.css";

const routeCards = [
  {
    from: "New York",
    fromCode: "JFK",
    to: "London",
    toCode: "LHR",
    fare: 389,
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&auto=format&fit=crop&q=90",
  },
  {
    from: "Los Angeles",
    fromCode: "LAX",
    to: "Tokyo",
    toCode: "NRT",
    fare: 549,
    image:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=1800&auto=format&fit=crop&q=90",
  },
  {
    from: "Chicago",
    fromCode: "ORD",
    to: "Paris",
    toCode: "CDG",
    fare: 429,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1800&auto=format&fit=crop&q=90",
  },
  {
    from: "Miami",
    fromCode: "MIA",
    to: "Dubai",
    toCode: "DXB",
    fare: 619,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1800&auto=format&fit=crop&q=90",
  },
];

const dealCards = [
  {
    place: "Santorini Escape",
    subtitle: "Ocean-view luxury week",
    discount: "Save 37%",
    from: 729,
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1800&auto=format&fit=crop&q=90",
  },
  {
    place: "Swiss Alps Retreat",
    subtitle: "Snow + rail + resort package",
    discount: "Save 31%",
    from: 679,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
  },
  {
    place: "Maldives Signature",
    subtitle: "Private island quick offer",
    discount: "Save 42%",
    from: 1199,
    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1800&auto=format&fit=crop&q=90",
  },
];

const features = [
  {
    icon: TrendingUp,
    title: "Predictive Pricing",
    text: "AI-backed fare trends to help you book before prices jump.",
  },
  {
    icon: ShieldCheck,
    title: "Protected Checkout",
    text: "Secure booking flow with verified partners and encrypted payments.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Support",
    text: "Travel experts available 24/7 for rebooking, changes, and help.",
  },
];

function HomeNew() {
  const navigate = useNavigate();
  const { contactSettings } = useContact();
  const [statsVisible, setStatsVisible] = useState(false);
  const [stats, setStats] = useState({
    bookings: 0,
    routes: 0,
    support: 0,
    saved: 0,
  });

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".hn-reveal").forEach((element) => {
      revealObserver.observe(element);
    });

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const statsSection = document.querySelector(".hn-stats");
    if (!statsSection) return undefined;

    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    statsObserver.observe(statsSection);
    return () => statsObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return undefined;

    const targets = {
      bookings: 78000,
      routes: 1200,
      support: 24,
      saved: 22,
    };

    const duration = 1800;
    const frames = 60;
    const stepMs = duration / frames;
    let frame = 0;

    const timer = setInterval(() => {
      frame += 1;
      setStats({
        bookings: Math.floor((targets.bookings / frames) * frame),
        routes: Math.floor((targets.routes / frames) * frame),
        support: Math.floor((targets.support / frames) * frame),
        saved: Math.floor((targets.saved / frames) * frame),
      });
      if (frame >= frames) {
        clearInterval(timer);
      }
    }, stepMs);

    return () => clearInterval(timer);
  }, [statsVisible]);

  return (
    <div className="home-new hn-page">
      <section className="hn-hero">
        <div className="hn-glow hn-glow-1" />
        <div className="hn-glow hn-glow-2" />
        <div className="container hn-hero-grid">
          <div className="hn-hero-copy hn-reveal">
            <span className="hn-chip">
              <Sparkles size={14} />
              Smart travel deals in real-time
            </span>
            <h1>
              A Bold New Way to
              <span> Book Flights Worldwide</span>
            </h1>
            <p>
              Faster search, stronger fares, and seamless support from booking
              to boarding. Built for travelers who move quick.
            </p>
            <div className="hn-hero-cta">
              <button
                onClick={() => navigate("/flights")}
                className="hn-btn-primary"
              >
                Explore Flights
                <ArrowRight size={17} />
              </button>
              <a
                href={`tel:${(contactSettings.tfn || "+1-888-859-0441").replace(/[^0-9+]/g, "")}`}
                className="hn-btn-ghost"
              >
                <PhoneCall size={16} />
                {contactSettings.tfn || "+1-888-859-0441"}
              </a>
            </div>
          </div>

          <div className="hn-hero-search hn-reveal">
            <SearchWidget />
          </div>
        </div>
      </section>

      <section className="hn-stats">
        <div className="container hn-stats-grid">
          <div className="hn-stat hn-reveal">
            <strong>{stats.bookings.toLocaleString()}+</strong>
            <span>Bookings completed</span>
          </div>
          <div className="hn-stat hn-reveal">
            <strong>{stats.routes.toLocaleString()}+</strong>
            <span>Global routes indexed</span>
          </div>
          <div className="hn-stat hn-reveal">
            <strong>{stats.support}/7</strong>
            <span>Live support availability</span>
          </div>
          <div className="hn-stat hn-reveal">
            <strong>${stats.saved}M+</strong>
            <span>Saved for customers</span>
          </div>
        </div>
      </section>

      <section className="hn-routes">
        <div className="container">
          <div className="hn-section-head hn-reveal">
            <div>
              <h2>Hot Routes With Live-Like Fare Energy</h2>
              <p>High-demand corridors our travelers are booking today.</p>
            </div>
            <button
              className="hn-btn-primary"
              onClick={() => navigate("/flights")}
            >
              View More
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="hn-route-grid">
            {routeCards.map((route, index) => (
              <article
                key={`${route.fromCode}-${route.toCode}`}
                className="hn-route-card hn-reveal"
                style={{ "--delay": `${index * 80}ms` }}
                onClick={() => navigate("/flights")}
              >
                <div
                  className="hn-route-bg"
                  style={{ backgroundImage: `url(${route.image})` }}
                />
                <div className="hn-route-overlay" />
                <div className="hn-route-content">
                  <span className="hn-route-pill">Trending</span>
                  <div className="hn-route-line">
                    <div>
                      <h3>{route.from}</h3>
                      <small>{route.fromCode}</small>
                    </div>
                    <Plane size={20} />
                    <div>
                      <h3>{route.to}</h3>
                      <small>{route.toCode}</small>
                    </div>
                  </div>
                  <div className="hn-route-price">
                    <span>From</span>
                    <strong>${route.fare}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hn-deals">
        <div className="container">
          <div className="hn-section-head hn-reveal">
            <div>
              <h2>Premium Blue Collection Deals</h2>
              <p>High-pixel destination cards with curated seasonal offers.</p>
            </div>
          </div>

          <div className="hn-deal-grid">
            {dealCards.map((deal, index) => (
              <article
                key={deal.place}
                className="hn-deal-card hn-reveal"
                style={{ "--delay": `${index * 90}ms` }}
              >
                <div
                  className="hn-deal-image"
                  style={{ backgroundImage: `url(${deal.image})` }}
                />
                <div className="hn-deal-shade" />
                <div className="hn-deal-body">
                  <span>{deal.discount}</span>
                  <h3>{deal.place}</h3>
                  <p>{deal.subtitle}</p>
                  <div className="hn-deal-footer">
                    <strong>From ${deal.from}</strong>
                    <button onClick={() => navigate("/flights")}>
                      Book Now
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hn-why">
        <div className="container">
          <div className="hn-section-head hn-reveal">
            <div>
              <h2>Why Travelers Stay With Us</h2>
              <p>
                Performance-first experience with visible confidence signals.
              </p>
            </div>
          </div>

          <div className="hn-feature-grid">
            {features.map((item, index) => (
              <article
                key={item.title}
                className="hn-feature-card hn-reveal"
                style={{ "--delay": `${index * 80}ms` }}
              >
                <div className="hn-feature-icon">
                  <item.icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="hn-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeNew;
