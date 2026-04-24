import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Calendar,
  CheckCircle2,
  Headphones,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { useContact } from "../context/ContactContext";
import "./Hotels.css";

const DESTINATIONS = [
  {
    city: "Santorini, Greece",
    hotels: 1240,
    nightly: 159,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    city: "Kyoto, Japan",
    hotels: 980,
    nightly: 132,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    city: "Dubai, UAE",
    hotels: 1560,
    nightly: 178,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=80",
  },
  {
    city: "New York, USA",
    hotels: 2010,
    nightly: 189,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=1400&q=80",
  },
];

const DEALS = [
  {
    title: "Lagoon Villa Retreat",
    region: "Maldives",
    rating: 4.9,
    reviews: 1284,
    sale: 249,
    original: 389,
    nights: "3 Nights",
    perks: ["Free breakfast", "Airport transfer", "Ocean-view room"],
    badge: "Top Pick",
    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Skyline Grand Suites",
    region: "Singapore",
    rating: 4.8,
    reviews: 942,
    sale: 195,
    original: 310,
    nights: "2 Nights",
    perks: ["Late checkout", "City-view suite", "Free cancellation"],
    badge: "Limited Deal",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Cliffside Wellness Resort",
    region: "Bali",
    rating: 4.8,
    reviews: 1127,
    sale: 169,
    original: 280,
    nights: "3 Nights",
    perks: ["Spa access", "Yoga sessions", "Daily breakfast"],
    badge: "Best Value",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Heritage Riverfront Hotel",
    region: "Prague",
    rating: 4.7,
    reviews: 786,
    sale: 179,
    original: 295,
    nights: "2 Nights",
    perks: ["Old town access", "Buffet breakfast", "Premium room upgrade"],
    badge: "New Offer",
    image:
      "https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=1400&q=80",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure Booking",
    desc: "Encrypted checkout with trusted payment partners worldwide.",
  },
  {
    icon: Sparkles,
    title: "Curated Stays",
    desc: "Handpicked hotels rated for comfort, location, and service.",
  },
  {
    icon: Headphones,
    title: "24/7 Experts",
    desc: "Hotel specialists available anytime for quick booking support.",
  },
];

function Hotels() {
  const navigate = useNavigate();
  const { contactSettings } = useContact();
  const statsRef = useRef(null);

  const [showGuests, setShowGuests] = useState(false);
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: { adults: 2, children: 0 },
    rooms: 1,
  });
  const [statsVisible, setStatsVisible] = useState(false);
  const [stats, setStats] = useState({
    travelers: 0,
    hotels: 0,
    cities: 0,
    savings: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.35 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targets = { travelers: 92000, hotels: 54000, cities: 420, savings: 38 };
    if (!statsVisible) {
      return;
    }

    let frameId;
    const start = performance.now();
    const duration = 1400;

    const animate = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setStats({
        travelers: Math.floor(targets.travelers * eased),
        hotels: Math.floor(targets.hotels * eased),
        cities: Math.floor(targets.cities * eased),
        savings: Math.floor(targets.savings * eased),
      });

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [statsVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".hotel-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const updateGuestCount = (field, delta, min = 0) => {
    setSearchData((prev) => ({
      ...prev,
      guests: {
        ...prev.guests,
        [field]: Math.max(min, prev.guests[field] + delta),
      },
    }));
  };

  const updateRooms = (delta) => {
    setSearchData((prev) => ({
      ...prev,
      rooms: Math.max(1, prev.rooms + delta),
    }));
  };

  const handleSearch = () => {
    if (!searchData.location || !searchData.checkIn || !searchData.checkOut) {
      alert("Please fill destination, check-in, and check-out.");
      return;
    }

    navigate("/hotel-results", {
      state: {
        searchParams: {
          location: searchData.location,
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          guests: searchData.guests,
          rooms: searchData.rooms,
        },
      },
    });
  };

  const totalGuests = searchData.guests.adults + searchData.guests.children;
  const phoneHref = contactSettings?.tfn
    ? `tel:${contactSettings.tfn.replace(/[^0-9+]/g, "")}`
    : "tel:+18001234567";

  return (
    <div className="hotels-page-new">
      <section className="hn-hero">
        <div className="hn-orb hn-orb-a"></div>
        <div className="hn-orb hn-orb-b"></div>
        <div className="hn-orb hn-orb-c"></div>

        <div className="hn-wrap">
          <div className="hn-hero-copy hotel-reveal">
            <p className="hn-kicker">
              <Building2 size={15} />
              Luxe Stays, Better Rates
            </p>
            <h1>
              Book modern hotels with
              <span> premium comfort and smart pricing.</span>
            </h1>
            <p>
              Discover curated stays in top destinations with real guest ratings,
              instant confirmation, and exclusive blue-label deals.
            </p>
            <div className="hn-chip-row">
              {["Dubai", "Tokyo", "London", "Paris"].map((city) => (
                <button
                  key={city}
                  className="hn-chip"
                  onClick={() =>
                    setSearchData((prev) => ({
                      ...prev,
                      location: city,
                    }))
                  }
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="hn-search hotel-reveal">
            <h3>Find Your Hotel</h3>

            <label>
              Destination
              <span className="hn-input">
                <MapPin size={17} />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchData.location}
                  onChange={(e) =>
                    setSearchData((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </span>
            </label>

            <div className="hn-grid-two">
              <label>
                Check-In
                <span className="hn-input">
                  <Calendar size={17} />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) =>
                      setSearchData((prev) => ({ ...prev, checkIn: e.target.value }))
                    }
                  />
                </span>
              </label>

              <label>
                Check-Out
                <span className="hn-input">
                  <Calendar size={17} />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) =>
                      setSearchData((prev) => ({ ...prev, checkOut: e.target.value }))
                    }
                  />
                </span>
              </label>
            </div>

            <div className="hn-guests-wrap">
              <button
                className="hn-guest-trigger"
                onClick={() => setShowGuests((prev) => !prev)}
              >
                <Users size={18} />
                {totalGuests} Guest{totalGuests !== 1 ? "s" : ""} • {searchData.rooms} Room
                {searchData.rooms !== 1 ? "s" : ""}
              </button>

              {showGuests && (
                <div className="hn-guests-dropdown">
                  <div className="hn-counter">
                    <span>Adults</span>
                    <div>
                      <button onClick={() => updateGuestCount("adults", -1, 1)}>-</button>
                      <strong>{searchData.guests.adults}</strong>
                      <button onClick={() => updateGuestCount("adults", 1, 1)}>+</button>
                    </div>
                  </div>
                  <div className="hn-counter">
                    <span>Children</span>
                    <div>
                      <button onClick={() => updateGuestCount("children", -1, 0)}>-</button>
                      <strong>{searchData.guests.children}</strong>
                      <button onClick={() => updateGuestCount("children", 1, 0)}>+</button>
                    </div>
                  </div>
                  <div className="hn-counter">
                    <span>Rooms</span>
                    <div>
                      <button onClick={() => updateRooms(-1)}>-</button>
                      <strong>{searchData.rooms}</strong>
                      <button onClick={() => updateRooms(1)}>+</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="hn-search-btn" onClick={handleSearch}>
              <Search size={18} />
              Search Hotels
            </button>
          </div>
        </div>
      </section>

      <section className="hn-section">
        <div className="hn-wrap">
          <div className="hn-head hotel-reveal">
            <h2>Popular Destination Stays</h2>
            <p>High-quality hotels in high-demand cities.</p>
          </div>

          <div className="hn-destination-grid">
            {DESTINATIONS.map((item, index) => (
              <article
                className="hn-destination-card hotel-reveal"
                key={item.city}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div
                  className="hn-card-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <span className="hn-pill">
                    <Star size={14} /> {item.rating}
                  </span>
                </div>
                <div className="hn-card-body">
                  <h3>{item.city}</h3>
                  <p>{item.hotels.toLocaleString()} verified properties</p>
                  <div>
                    <strong>From ${item.nightly}</strong> / night
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hn-section hn-section-soft">
        <div className="hn-wrap">
          <div className="hn-head hotel-reveal">
            <h2>Handpicked Hotel Deals</h2>
            <p>New markdowns and value stays updated daily.</p>
          </div>

          <div className="hn-deals-grid">
            {DEALS.map((item, index) => (
              <article
                key={item.title}
                className="hn-deal-card hotel-reveal"
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <div
                  className="hn-deal-media"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <span className="hn-badge">{item.badge}</span>
                </div>
                <div className="hn-deal-body">
                  <div className="hn-deal-topline">
                    <span className="hn-deal-region">
                      <MapPin size={13} />
                      {item.region}
                    </span>
                    <span className="hn-deal-rating">
                      <Star size={13} fill="currentColor" />
                      {item.rating} ({item.reviews})
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.nights} package with premium stay inclusions.</p>
                  <ul className="hn-deal-perks">
                    {item.perks.map((perk) => (
                      <li key={perk}>
                        <CheckCircle2 size={14} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <div className="hn-price-row">
                    <div className="hn-price-col">
                      <span className="hn-price">${item.sale}</span>
                      <span className="hn-original">${item.original}</span>
                    </div>
                    <span className="hn-save-tag">
                      Save ${item.original - item.sale}
                    </span>
                  </div>
                  <button className="hn-card-btn" onClick={handleSearch}>
                    Reserve Offer <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hn-section">
        <div className="hn-wrap">
          <div className="hn-head hotel-reveal">
            <h2>Why Travelers Choose Us</h2>
            <p>Fast booking, trusted support, and clear pricing.</p>
          </div>

          <div className="hn-feature-grid">
            {FEATURES.map((feature, index) => (
              <article
                key={feature.title}
                className="hn-feature-card hotel-reveal"
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <feature.icon size={22} />
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hn-stats" ref={statsRef}>
        <div className="hn-wrap">
          <div className="hn-stat-grid">
            <article className="hn-stat-card hotel-reveal">
              <h3>{stats.travelers.toLocaleString()}+</h3>
              <p>Happy Travelers</p>
            </article>
            <article className="hn-stat-card hotel-reveal">
              <h3>{stats.hotels.toLocaleString()}+</h3>
              <p>Hotels Worldwide</p>
            </article>
            <article className="hn-stat-card hotel-reveal">
              <h3>{stats.cities}+</h3>
              <p>Cities Covered</p>
            </article>
            <article className="hn-stat-card hotel-reveal">
              <h3>${stats.savings}M+</h3>
              <p>Total Saved</p>
            </article>
          </div>
        </div>
      </section>

      <section className="hn-callout">
        <div className="hn-wrap">
          <div className="hn-callout-card hotel-reveal">
            <div>
              <p className="hn-kicker">
                <CheckCircle2 size={15} />
                Expert Help Available
              </p>
              <h2>Need help choosing the right hotel?</h2>
              <p>
                Call our booking specialists for instant support and phone-only
                rates on selected properties.
              </p>
            </div>
            <a className="hn-call-btn" href={phoneHref}>
              <BedDouble size={18} />
              {contactSettings?.tfn || "+1 (800) 123-4567"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hotels;
