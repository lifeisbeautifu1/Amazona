import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

type SidebarProps = {
  isSidebarOpen: boolean;
  categories: string[];
  toggleSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  categories,
  toggleSidebar,
}) => {
  return (
    <div
      className={
        isSidebarOpen
          ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
          : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
      }
    >
      <Nav className="flex-column text-white w-100 p-4">
        <Nav.Item>
          <strong>Categories</strong>
        </Nav.Item>
        {categories.map((category) => (
          <Nav.Item key={category}>
            <LinkContainer
              to={`/search?category=${category}`}
              onClick={toggleSidebar}
            >
              <Nav.Link>{category}</Nav.Link>
            </LinkContainer>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
