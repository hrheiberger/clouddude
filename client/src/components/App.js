import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import About from "./pages/About";
import Play from "./pages/Play";
import Home from "./pages/Home";
import Game from "./modules/Game";
import LevelEditor from "./pages/LevelEditor";
import Repository from "./pages/Repository";
import NavBar from "./modules/NavBar";
import Footer from "./modules/Footer";

import "../utilities.css";
import "./App.css";

import { socket } from "../client-socket";

import { get, post } from "../utilities";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);
  const [name, setName] = useState("User");

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setName(user.name);
      }
    });
  }, []);

  const handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      setName(user.name);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <>
      <NavBar
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        userId={userId}
        // publishedLevels="hardcorded 30"
        // levelsWon="hardcorded 20"
        // userName={name}
      />
      <Router>
        <Skeleton
          path="/example"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
        />
        <LevelEditor
          path="/leveleditor"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
        />
        <Repository
          path="/repository"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
        />
        <About
          path="/about"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
        />

        <Game path="/play" />
        <Home path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
        <NotFound default />
      </Router>
      <Footer
        className="fixed-bottom"
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        userId={userId}
      />
    </>
  );
};

export default App;
