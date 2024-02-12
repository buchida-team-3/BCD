import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import "./DemoBook.css";
import PageCover from "./PageCover";
import Page from "./Page";

function DemoBook(props) {
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const flipBook = useRef(null);

  useEffect(() => {
    const pageCount = flipBook.current?.pageFlip()?.getPageCount();
    if (pageCount) {
      setTotalPage(pageCount);
    }
  }, []);

  const nextButtonClick = () => {
    flipBook.current?.pageFlip().flipNext();
  };

  const prevButtonClick = () => {
    flipBook.current?.pageFlip().flipPrev();
  };

  const onPage = (e) => {
    setPage(e.data);
  };

  return (
    <div>
      <HTMLFlipBook
        width={620}
        height={580}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={onPage}
        className="demo-book"
        ref={flipBook}
      >
        <PageCover>BOOK TITLE</PageCover>
        <Page number={1}>Lorem ipsum...</Page>
        <Page number={2}>Lorem ipsum...</Page>
        {/* 페이지들을 계속 추가 */}
        <PageCover>THE END</PageCover>
      </HTMLFlipBook>

      <div className="demo-container">
        <div>
          <button type="button" onClick={prevButtonClick}>
            Previous page
          </button>
          [<span>{page}</span> of <span>{totalPage}</span>]
          <button type="button" onClick={nextButtonClick}>
            Next page
          </button>
        </div>
      </div>
    </div>
  );
}

export default DemoBook;
