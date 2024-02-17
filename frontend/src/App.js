import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginSignup from './components/LoginSignup';
import ImagePage from './components/ImagePage';
import Edit from './components/Edit';
import DemoBook from './components/DemoBook';
import LabelPage from './components/LabelPage';
import AlbumListPage from './components/AlbumListPage';
import CreateAlbumPage from './components/CreateAlbumPage';
import MainSelectPage from './components/MainSelectPage';

function App() {
  return (
    
      <Router>
        <Routes>
          {/* 첫 화면 */}
          <Route path="/" element={<MainPage />} />

          {/* 로그인 및 회원가입 페이지 */}
          <Route path="/loginandsignup" element={<LoginSignup />} />

          {/* 뷰잉 페이지 */}
          <Route path="/imagepage" element={<ImagePage />} />
    
          {/* 이미지 편집 페이지 */}
          <Route path="/edit" element={<Edit />} />
          
          {/* 앨범페이지(데모) */}
          <Route path="/book" element={<DemoBook />} />

          {/* 필터링 페이지 */}
          <Route path="/labelpage" element={<LabelPage />} />

          {/* 앨범목록 페이지 */}
          <Route path="/albumlist" element={<AlbumListPage />} />

          <Route path="/createalbum" element={<CreateAlbumPage />} />

          {/* 메인 선택 페이지(로그인 후 첫 화면) */}
          <Route path="/mainselect" element={<MainSelectPage />} />
        </Routes>
      </Router>
   
  );
}

export default App;
