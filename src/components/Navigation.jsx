import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

export const Navigation = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Events</Link>
        </li>
        <li className="event-add-btn">
          <Link to="/event/new">Add new event</Link>
        </li>
      </ul>
    </nav>
  );
};
