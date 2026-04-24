import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  Zap,
} from "lucide-react";
import AirportAutocomplete from "../components/AirportAutocomplete";
import "./Flights.css";

function Flights() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    tripType: "round-trip",
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    cabinClass: "economy",
    directFlights: false,
  });

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const passengerDropdownRef = useRef(null);
  const departDateRef = useRef(null);
  const returnDateRef = useRef(null);

  const popularRoutes = [
    {
      from: "New York (JFK)",
      to: "London (LHR)",
      fromCode: "JFK",
      toCode: "LHR",
      price: 450,
      airline: "British Airways",
      airlineLogo: "https://i.ibb.co/B58HfmrD/british-ariway.png",
      trend: "down",
      image:
        "https://images.unsplash.com/photo-1488747279002-c8523379faaa?w=1600&auto=format&fit=crop&q=90",
    },
    {
      from: "Los Angeles (LAX)",
      to: "Tokyo (NRT)",
      fromCode: "LAX",
      toCode: "NRT",
      price: 680,
      airline: "Japan Airlines",
      airlineLogo: "https://i.ibb.co/Rpvyz9xg/japan-airlinees.png",
      trend: "up",
      image:
        "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1600&auto=format&fit=crop&q=90",
    },
    {
      from: "Dubai (DXB)",
      to: "Mumbai (BOM)",
      fromCode: "DXB",
      toCode: "BOM",
      price: 320,
      airline: "Emirates Airlines",
      airlineLogo: "https://i.ibb.co/W72nbhd/emarites.jpg",
      trend: "down",
      image:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&auto=format&fit=crop&q=90",
    },
    {
      from: "Singapore (SIN)",
      to: "Sydney (SYD)",
      fromCode: "SIN",
      toCode: "SYD",
      price: 420,
      airline: "Singapore Airlines",
      airlineLogo: "https://i.ibb.co/QvnsxTb7/singapore.jpg",
      trend: "stable",
      image:
        "https://images.unsplash.com/photo-1506973035872-a4f23ef4f4fd?w=1600&auto=format&fit=crop&q=90",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        passengerDropdownRef.current &&
        !passengerDropdownRef.current.contains(event.target)
      ) {
        setShowPassengerDropdown(false);
      }
    };

    if (showPassengerDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPassengerDropdown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -70px 0px" }
    );

    document.querySelectorAll(".fl-reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const updatePassengers = (type, increment, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    setSearchData((prev) => {
      const currentValue = prev.passengers[type];
      const newValue = currentValue + increment;
      const minValue = type === "adults" ? 1 : 0;
      const finalValue = Math.max(minValue, newValue);

      return {
        ...prev,
        passengers: {
          ...prev.passengers,
          [type]: finalValue,
        },
      };
    });
  };

  const getTotalPassengers = () =>
    searchData.passengers.adults +
    searchData.passengers.children +
    searchData.passengers.infants;

  const swapAirports = () => {
    setSearchData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchData.from || !searchData.to || !searchData.departDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (searchData.tripType === "round-trip" && !searchData.returnDate) {
      alert("Please select a return date for roundtrip flights");
      return;
    }

    const queryParams = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      departDate: searchData.departDate,
      tripType: searchData.tripType,
      adults: searchData.passengers.adults,
      children: searchData.passengers.children,
      infants: searchData.passengers.infants,
      cabinClass: searchData.cabinClass,
    });

    if (searchData.tripType === "round-trip" && searchData.returnDate) {
      queryParams.append("returnDate", searchData.returnDate);
    }
    if (searchData.directFlights) {
      queryParams.append("directFlights", "true");
    }

    navigate(`/flight-results?${queryParams.toString()}`, {
      state: {
        from: searchData.from,
        to: searchData.to,
        date: searchData.departDate,
        departDate: searchData.departDate,
        returnDate:
          searchData.tripType === "round-trip" ? searchData.returnDate : null,
        tripType: searchData.tripType,
        passengers: searchData.passengers,
        cabinClass: searchData.cabinClass,
      },
    });
  };

  const handleRouteClick = (route) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const departDate = tomorrow.toISOString().split("T")[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    const returnDate = nextWeek.toISOString().split("T")[0];

    const queryParams = new URLSearchParams({
      from: route.fromCode,
      to: route.toCode,
      departDate,
      returnDate,
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: "economy",
    });

    navigate(`/flight-results?${queryParams.toString()}`, {
      state: {
        from: route.fromCode,
        to: route.toCode,
        departDate,
        returnDate,
        tripType: "round-trip",
        passengers: { adults: 1, children: 0, infants: 0 },
        cabinClass: "economy",
      },
    });
  };

  return (
    <div className="flights-page">
      <section className="fl-hero">
        <div className="fl-orb fl-orb-one" />
        <div className="fl-orb fl-orb-two" />
        <div className="container fl-hero-inner">
          <div className="fl-reveal">
            <span className="fl-chip">
              <Sparkles size={14} />
              Real-time fare discovery
            </span>
            <h1>
              Modern Flight Search
              <span>Built For Fast Booking</span>
            </h1>
            <p>
              Compare thousands of fares, customize travelers in seconds, and
              get to results with one smooth flow.
            </p>
          </div>
        </div>
      </section>

      <section className="search-container">
        <div className="container">
          <div className="search-card fl-reveal">
            <div className="trip-type-selector">
              <label>
                <input
                  type="radio"
                  value="round-trip"
                  checked={searchData.tripType === "round-trip"}
                  onChange={(e) =>
                    setSearchData({ ...searchData, tripType: e.target.value })
                  }
                />
                <span>Round Trip</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="one-way"
                  checked={searchData.tripType === "one-way"}
                  onChange={(e) =>
                    setSearchData({ ...searchData, tripType: e.target.value })
                  }
                />
                <span>One Way</span>
              </label>
            </div>

            <form onSubmit={handleSearch}>
              <div className="search-field-grid">
                <div className="search-field">
                  <label>From</label>
                  <div className="input-with-icon">
                    <AirportAutocomplete
                      value={searchData.from}
                      onChange={(code) =>
                        setSearchData({ ...searchData, from: code })
                      }
                      placeholder="Departure City or Airport"
                    />
                  </div>
                </div>

                <button type="button" className="swap-btn" onClick={swapAirports}>
                  <ArrowRightLeft color="white" size={20} />
                </button>

                <div className="search-field">
                  <label>To</label>
                  <div className="input-with-icon">
                    <AirportAutocomplete
                      value={searchData.to}
                      onChange={(code) =>
                        setSearchData({ ...searchData, to: code })
                      }
                      placeholder="Arrival City or Airport"
                    />
                  </div>
                </div>

                <div className="search-field">
                  <label>
                    <CalendarDays size={14} />
                    Depart
                  </label>
                  <div
                    className="input-with-icon"
                    onClick={() => departDateRef.current?.showPicker?.()}
                  >
                    <input
                      ref={departDateRef}
                      type="date"
                      id="airport-input"
                      value={searchData.departDate}
                      onChange={(e) =>
                        setSearchData({ ...searchData, departDate: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                {searchData.tripType === "round-trip" && (
                  <div className="search-field">
                    <label>
                      <CalendarDays size={14} />
                      Return
                    </label>
                    <div
                      className="input-with-icon"
                      onClick={() => returnDateRef.current?.showPicker?.()}
                    >
                      <input
                        ref={returnDateRef}
                        type="date"
                        id="airport-input"
                        value={searchData.returnDate}
                        onChange={(e) =>
                          setSearchData({ ...searchData, returnDate: e.target.value })
                        }
                        min={searchData.departDate || new Date().toISOString().split("T")[0]}
                        required={searchData.tripType === "round-trip"}
                      />
                    </div>
                  </div>
                )}

                <div className="search-field passengers-field" ref={passengerDropdownRef}>
                  <label>Passengers</label>
                  <div className="passengers-dropdown">
                    <div
                      className="passengers-summary"
                      onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                    >
                      <span>
                        {getTotalPassengers()} Passenger
                        {getTotalPassengers() !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {showPassengerDropdown && (
                      <div className="passengers-detail" onClick={(e) => e.stopPropagation()}>
                        <div className="passenger-row">
                          <div className="passenger-info">
                            <span className="passenger-type">Adults</span>
                            <span className="passenger-age">12+ years</span>
                          </div>
                          <div className="passenger-controls">
                            <button
                              type="button"
                              onClick={(e) => updatePassengers("adults", -1, e)}
                              disabled={searchData.passengers.adults <= 1}
                            >
                              -
                            </button>
                            <span>{searchData.passengers.adults}</span>
                            <button type="button" onClick={(e) => updatePassengers("adults", 1, e)}>
                              +
                            </button>
                          </div>
                        </div>
                        <div className="passenger-row">
                          <div className="passenger-info">
                            <span className="passenger-type">Children</span>
                            <span className="passenger-age">2-11 years</span>
                          </div>
                          <div className="passenger-controls">
                            <button
                              type="button"
                              onClick={(e) => updatePassengers("children", -1, e)}
                              disabled={searchData.passengers.children <= 0}
                            >
                              -
                            </button>
                            <span>{searchData.passengers.children}</span>
                            <button type="button" onClick={(e) => updatePassengers("children", 1, e)}>
                              +
                            </button>
                          </div>
                        </div>
                        <div className="passenger-row">
                          <div className="passenger-info">
                            <span className="passenger-type">Infants</span>
                            <span className="passenger-age">Under 2</span>
                          </div>
                          <div className="passenger-controls">
                            <button
                              type="button"
                              onClick={(e) => updatePassengers("infants", -1, e)}
                              disabled={searchData.passengers.infants <= 0}
                            >
                              -
                            </button>
                            <span>{searchData.passengers.infants}</span>
                            <button type="button" onClick={(e) => updatePassengers("infants", 1, e)}>
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="search-field">
                  <label>Cabin Class</label>
                  <div className="input-with-icon">
                    <select
                      id="airport-input"
                      className="cabin-class-select"
                      value={searchData.cabinClass}
                      onChange={(e) =>
                        setSearchData({ ...searchData, cabinClass: e.target.value })
                      }
                    >
                      <option value="economy">Economy</option>
                      <option value="premium-economy">Premium Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="direct-flights-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={searchData.directFlights}
                    onChange={(e) =>
                      setSearchData({ ...searchData, directFlights: e.target.checked })
                    }
                  />
                  <span>Direct Flights Only</span>
                </label>
              </div>

              <button type="submit" id="search-button" className="search-flights-btn">
                <Search size={20} />
                Search Flights
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="fl-highlight-strip">
        <div className="container fl-highlight-grid">
          <div className="fl-highlight-card fl-reveal">
            <ShieldCheck size={20} />
            <div>
              <h4>Secure Checkout</h4>
              <p>Protected transactions and verified fare sources.</p>
            </div>
          </div>
          <div className="fl-highlight-card fl-reveal">
            <Clock3 size={20} />
            <div>
              <h4>Instant Results</h4>
              <p>Fast search response even with advanced filters.</p>
            </div>
          </div>
          <div className="fl-highlight-card fl-reveal">
            <Zap size={20} />
            <div>
              <h4>Smart Deals</h4>
              <p>Discover route opportunities before they disappear.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="popular-routes-section">
        <div className="container">
          <div className="section-header fl-reveal">
            <h2>
              <TrendingDown size={32} />
              Popular Routes & Live Prices
            </h2>
            <p>Book your next trip with modern search and transparent fares.</p>
          </div>

          <div className="routes-grid">
            {popularRoutes.map((route, index) => (
              <article
                key={`${route.fromCode}-${route.toCode}`}
                className="route-card fl-reveal"
                style={{ "--delay": `${index * 80}ms` }}
                onClick={() => handleRouteClick(route)}
              >
                <div className="route-visual" style={{ backgroundImage: `url(${route.image})` }}>
                  <div className="route-visual-overlay" />
                  <div className="route-header">
                    <div className="route-cities">
                      <span className="city-from">{route.from}</span>
                      <Plane size={20} className="route-icon" />
                      <span className="city-to">{route.to}</span>
                    </div>
                    <div className={`price-trend ${route.trend}`}>
                      {route.trend === "down" && <TrendingDown size={16} />}
                      {route.trend === "up" && "↗"}
                      {route.trend === "stable" && "→"}
                    </div>
                  </div>
                </div>

                <div className="route-details">
                  <div className="airline-info">
                    <img
                      src={`${route.airlineLogo}`}
                      alt={route.airline}
                      className="airline-logo"
                      onError={(e) => {
                        e.target.src = "/airlines/default.svg";
                      }}
                    />
                    <span className="airline-name">{route.airline}</span>
                  </div>
                  <div className="price-tag">
                    <span className="price">${route.price}</span>
                    <span className="price-label">round trip</span>
                  </div>
                </div>

                <button className="view-flights-btn">
                  <CheckCircle2 size={16} />
                  View Flights
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Flights;
