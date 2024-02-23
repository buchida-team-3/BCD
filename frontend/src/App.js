import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ImageDataProvider } from './components/ImageContext';

import MainPage from './components/MainPage';
import LoginSignup from './components/LoginSignup';
import ImagePage from './components/ImagePage';
import Edit from './components/Edit';
import BookPage from './components/BookPage';
import LabelPage2 from './components/LabelPage2';
import AlbumListPage from './components/AlbumListPage';
import CreateAlbumPage from './components/CreateAlbumPage';
import MainSelectPage from './components/MainSelectPage';
// import AlbumListPage2 from './components/AlbumListPage2';
import { CardPage } from './components/CardPage';
// import { CardPage2 } from './components/CardPage2';
import CardPage2 from './components/CardPage2';
import LabelPage3 from './components/LabelPage3';
import ImagePage2 from './components/ImagePage2';
import LabelPage from './components/LabelPage';
import ImagePage3 from './components/ImagePage3';
import ImagePage4 from './components/ImagePage4';
import ImagePage5 from './components/ImagePage5';


function App() {
  return (

    <ImageDataProvider>
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
          
          {/* 앨범 페이지 -> 미사용 */}
          {/* <Route path="/book" element={<BookPage />} /> */}

          {/* 앨범 페이지 */}
          <Route path="/album" element={<LabelPage />} />

          {/* 앨범목록 페이지 */}
          {/* <Route path="/albumlist" element={<AlbumListPage />} /> */}

          <Route path="/createalbum" element={<CreateAlbumPage />} />

          {/* 메인 선택 페이지(로그인 후 첫 화면) */}
          {/* <Route path="/home" element={<MainSelectPage />} /> */}

          {/* <Route path="/albumlist" element={<AlbumListPage2 />} /> */}

          {/* 샘플 페이지 */}          
          <Route path="/cardpage" element={<CardPage />} />
          <Route path="/cardpage2" element={<CardPage2 />} />

          {/* 그리드 컴포넌트 */}
          <Route path="/labelpage2" element={<LabelPage2 />} />
          
          {/* <Route path="/aIbum" element={<LabelPage3 />} /> */}
          <Route path="/home" element={<LabelPage3 />} />

          <Route path="/imagepage5" element={<ImagePage2 />} />
          <Route path="/imagepage3" element={<ImagePage3 />} />
          <Route path="/imagepage4" element={<ImagePage4 />} />
          <Route path="/imagepage2" element={<ImagePage5 />} />

        </Routes>
      </Router>
    </ImageDataProvider>
  );
}

export default App;
