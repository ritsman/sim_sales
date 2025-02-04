import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = ({ paths }) => {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  return (
    <nav aria-label="breadcrumb" className="md:pb-2">
      <ol className="flex flex-wrap  p-4 rounded">
        {/* Home link with arrow */}
        <li className="flex items-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-500 hover:underline"
          >
            Home
          </Link>
        </li>
        {/* Map over other path segments */}
        {pathSegments.map((segment, index) => {
          const breadcrumbIndex = paths.findIndex((path) =>
            path.link.includes(segment)
          );
          if (breadcrumbIndex !== -1) {
            return (
              <li key={index} className="flex items-center">
                <svg
                  className="fill-current w-3 h-3 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 17l5-5-5-5v10z" />
                </svg>
                <Link
                  to={paths[breadcrumbIndex].link}
                  className="text-gray-600 hover:text-blue-500 hover:underline"
                >
                  {paths[breadcrumbIndex].title}
                </Link>
              </li>
            );
          } else {
            return null;
          }
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
