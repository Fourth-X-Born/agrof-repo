import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
