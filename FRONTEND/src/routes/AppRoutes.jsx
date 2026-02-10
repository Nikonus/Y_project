import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Watch from "../pages/Watch";
import Upload from "../pages/Upload";
import ProtectedRoute from "../components/ProtectedRoute";
import Channel from "../pages/Channel";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import EditVideo from "../pages/EditVideo";
import Playlists from "../pages/Playlists";
import CreatePlaylist from "../pages/CreatePlaylist";
import Profile from "../pages/Profile";   
import PlaylistDetails from "../pages/PlaylistDetails";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:videoId" element={<Watch />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/channel/:channelId" element={<Channel />} />
          <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit/:videoId" element={<EditVideo />} />
          <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/create" element={<CreatePlaylist />} />
            <Route path="/playlists/:playlistId" element={<PlaylistDetails />} />
          <Route path="/channel/:userId" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
