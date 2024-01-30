import React from 'react';
import Navbar from './Navbar';
import PhotoGrid from './PhotoGrid';
import UploadButtonTwo from './UploadButtonTwo';
import SearchButton from './SearchButton';

function UploadAfter() {
  return (
    <div>
      <Navbar />
      <PhotoGrid />
      <UploadButtonTwo />
      <SearchButton />
    </div>
  );
}

export default UploadAfter;
