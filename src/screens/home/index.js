import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import Library from "../library/library";
import Feed from "../feed/feed";
import Trending from "../trending/trending";
import Player from "../player/player";
import Favorites from "../favorites/favorites";
import Credits from "../credits/credits";
import Files from "../Files/files";
import Login from "../auth/login";
import Register from "../auth/register";
import Profile from "../profile/profile";
import PlayLists from "../playLists/playLists"; // Ajustamos a la carpeta y archivo en disco
import "./home.css";

export default function Home() {
  return (
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/player" element={<Player />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/files" element={<Files />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/playlists" element={<PlayLists />} /> {/* Corregimos el typo */}
        </Routes>
      </div>
    </Router>
  );
}