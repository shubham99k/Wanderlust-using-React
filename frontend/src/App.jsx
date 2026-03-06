import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Boilerplate from "./components/layouts/Boilerplate";

import ListingIndex from "./pages/listings/ListingIndex";
import ListingShow from "./pages/listings/ListingShow";
import ListingNew from "./pages/listings/ListingNew";
import ListingEdit from "./pages/listings/ListingEdit";
import Login from "./pages/users/Login";
import Signup from "./pages/users/Signup";
import Profile from "./pages/users/Profile";
import { ErrorPage, PrivacyPage, TermsPage } from "./pages/StaticPages";

import "./index.css";

function Router() {
  const { currentUser, showFlash } = useApp();
  const [page, setPage] = useState("home");
  const [selId, setSelId] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const navigate = (target, id = null) => {
    if ((target === "new" || target === "edit") && !currentUser) {
      showFlash("Please log in to continue.", "error");
      setPage("login");
      return;
    }
    if (id) setSelId(id);
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const page2component = () => {
    switch (page) {
      case "home":
        return (
          <ListingIndex
            onNavigate={navigate}
            onSelectListing={(id) => navigate("show", id)}
          />
        );
      case "show":
        return <ListingShow listingId={selId} onNavigate={navigate} />;
      case "new":
        return (
          <ListingNew
            onNavigate={navigate}
            onCreated={(id) => navigate("show", id)}
          />
        );
      case "edit":
        return <ListingEdit listingId={selId} onNavigate={navigate} />;
      case "login":
        return <Login onNavigate={navigate} />;
      case "signup":
        return <Signup onNavigate={navigate} />;
      case "profile":
        return <Profile onNavigate={navigate} />;
      case "privacy":
        return <PrivacyPage onNavigate={navigate} />;
      case "terms":
        return <TermsPage onNavigate={navigate} />;
      case "error":
        return <ErrorPage message={errMsg} onNavigate={navigate} />;
      default:
        return <ErrorPage message="Page not found." onNavigate={navigate} />;
    }
  };

  return <Boilerplate onNavigate={navigate}>{page2component()}</Boilerplate>;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
