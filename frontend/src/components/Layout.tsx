import React from "react";
import { Outlet } from "react-router";
import TopMenu from "./TopMenu";

const Layout: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-900 to-gray-900">
    <div className="flex flex-col w-full min-h-screen">
      <TopMenu />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="border-t-2 border-amber-500 min-h-16 bg-transparent">
        <h3>Footer</h3>
      </footer>
    </div>
  </div>
);

export default Layout;
