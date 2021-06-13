import React from "react";
import { NavLink } from "react-router-dom";

import { useViewContext } from "../../state/view-context";

interface Props {}

const AdminDropdown: React.FC<Props> = () => {
  const { viewMode, setViewMode } = useViewContext();
  return (
    <>
      <div className="sidebar__section">
        <h3
          className="header--center header--orange header--link"
          onClick={() => setViewMode((prev) => (prev === "admin" ? "client" : "admin"))}
        >
          {viewMode === "admin" ? "Switch to client view" : "Switch to admin view"}
        </h3>
      </div>

      {viewMode === "admin" && (
        <div className="sidebar__section sidebar__section--nav">
          <li className="list">
            <NavLink to="/admin/manage-products" className="list-link">
              MANAGE PRODUCTS
            </NavLink>
          </li>
          <li className="list">
            <NavLink to="/admin/manage-orders" className="list-link">
              MANAGE ORDERS
            </NavLink>
          </li>
          <li className="list">
            <NavLink to="/admin/manage-users" className="list-link">
              MANAGE USERS
            </NavLink>
          </li>
        </div>
      )}
    </>
  );
};

export default AdminDropdown;
