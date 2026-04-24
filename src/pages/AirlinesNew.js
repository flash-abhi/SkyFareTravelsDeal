import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Filter,
  Globe2,
  MapPin,
  Plane,
  Search,
  Star,
  X,
} from "lucide-react";
import { getAllAirlines } from "../data/airlines";
import "./AirlinesNew.css";

const ALLIANCES = ["Star Alliance", "Oneworld", "SkyTeam", "None (Independent)"];

function AirlinesNew() {
  const airlines = getAllAirlines();
  const [searchQuery, setSearchQuery] = useState("");
  const [allianceFilter, setAllianceFilter] = useState("all");

  const filteredAirlines = useMemo(() => {
    return airlines.filter((airline) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        airline.name.toLowerCase().includes(q) ||
        airline.code.toLowerCase().includes(q);
      const matchesAlliance =
        allianceFilter === "all" || airline.alliance === allianceFilter;
      return matchesSearch && matchesAlliance;
    });
  }, [airlines, searchQuery, allianceFilter]);

  const stats = useMemo(() => {
    const totalDestinations = airlines.reduce(
      (sum, airline) => sum + (airline.destinations || 0),
      0
    );
    return {
      total: airlines.length,
      alliances: ALLIANCES.length,
      avgDestinations: Math.round(totalDestinations / Math.max(airlines.length, 1)),
    };
  }, [airlines]);

  return (
    <div className="airlines-modern-page">
      <section className="am-hero">
        <div className="am-blob am-blob-a"></div>
        <div className="am-blob am-blob-b"></div>
        <div className="am-wrap">
          <div className="am-hero-panel">
            <p className="am-kicker">
              <Plane size={15} />
              Global Airline Directory
            </p>
            <h1>
              Choose the right airline with
              <span> trusted route and alliance insights.</span>
            </h1>
            <p>
              Compare carriers by destinations, hubs, and alliances in one modern
              responsive experience.
            </p>
            <div className="am-stat-row">
              <article>
                <strong>{stats.total}</strong>
                <span>Airlines</span>
              </article>
              <article>
                <strong>{stats.alliances}</strong>
                <span>Alliance Groups</span>
              </article>
              <article>
                <strong>{stats.avgDestinations}+</strong>
                <span>Avg Destinations</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="am-controls">
        <div className="am-wrap">
          <div className="am-controls-card">
            <div className="am-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by airline name or code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="am-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="am-filter-box">
              <Filter size={17} />
              <select
                value={allianceFilter}
                onChange={(e) => setAllianceFilter(e.target.value)}
              >
                <option value="all">All Alliances</option>
                {ALLIANCES.map((alliance) => (
                  <option key={alliance} value={alliance}>
                    {alliance}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="am-result-text">
            Showing <strong>{filteredAirlines.length}</strong> airline
            {filteredAirlines.length !== 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <section className="am-grid-section">
        <div className="am-wrap">
          <div className="am-grid">
            {filteredAirlines.length === 0 ? (
              <div className="am-no-results">
                <Plane size={42} />
                <h3>No airlines found</h3>
                <p>Try another search term or alliance filter.</p>
              </div>
            ) : (
              filteredAirlines.map((airline, index) => (
                <Link
                  key={airline.slug}
                  to={`/airlines/${airline.slug}`}
                  className="am-airline-card"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="am-card-head">
                    <div className="am-logo-wrap">
                      {airline.logo ? (
                        <img src={airline.logo} alt={`${airline.name} logo`} />
                      ) : (
                        <Plane size={24} />
                      )}
                    </div>
                    <span className="am-code">{airline.code}</span>
                  </div>

                  <div className="am-card-body">
                    <h3>{airline.name}</h3>
                    <p className="am-alliance">
                      <Star size={13} />
                      {airline.alliance}
                    </p>
                    <div className="am-metrics">
                      <span>
                        <Globe2 size={14} />
                        {airline.destinations} destinations
                      </span>
                      <span>
                        <MapPin size={14} />
                        {airline.hubs?.[0] || "Global hubs"}
                      </span>
                    </div>
                  </div>

                  <div className="am-card-foot">
                    View Airline Details
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AirlinesNew;
