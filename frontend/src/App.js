import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import Login from './components/Login';
import Signup from './components/Signup';
import UploadAfter from './components/UploadAfter';
import UploadBefore from './components/UploadBefore';
import Gallery from './components/Gallery';
import Photo from './components/Photo';
import Album from './components/Album';
import AlbumAfter from './components/AlbumAfter';
import AfterImage from './components/AfterImage';
import BeforeImage from './components/BeforeImage';
import LoginSignup from './components/LoginSignup';
import ImagePage from './components/ImagePage';


function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/group/album" element={<UploadAfter />} />
          <Route path="/group/album/upload" element={<UploadBefore />} />
          <Route path="/gallery" element={<Gallery images={Photo}/>} />
          <Route path="/album" element={<Album images={BeforeImage} />} />
          <Route path="/aIbum" element={<AlbumAfter images={AfterImage} />} />

          <Route path="/loginandsignup" element={<LoginSignup />} />

          <Route path="/imagepage" element={<ImagePage />} />
        </Routes>
      </Router>
   
  );
}

export default App;
