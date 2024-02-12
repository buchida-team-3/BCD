import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import "./DemoBook.css";
import PageCover from "./PageCover";
import Page from "./Page";
import EditModal from "./EditModal"; // EditModal 컴포넌트를 불러옵니다. (아래에서 구현)

function DemoBook(props) {
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTexts, setEditTexts] = useState({}); // 페이지 번호를 키로 하는 객체
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

  const openEditModal = () => {
    setIsModalOpen(true);
  };

  const saveTexts = (leftText, rightText) => {
    setEditTexts({ ...editTexts, [page]: leftText, [page + 1]: rightText });
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openEditModal}>Edit Text</button>
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
        {/* 페이지 번호와 텍스트를 Page 컴포넌트에 전달 */}
        <Page number={1} text={editTexts[1] || "Page 1 Default Text"} />
        <Page number={2} text={editTexts[2] || "Page 2 Default Text"} />
        <Page number={3} text={editTexts[3] || "Page 3 Default Text"} />
        <Page number={4} text={editTexts[4] || "Page 4 Default Text"} />
        <Page number={5} text={editTexts[5] || "Page 5 Default Text"} />
        <Page number={6} text={editTexts[6] || "Page 6 Default Text"} />
        <PageCover>THE END</PageCover>
      </HTMLFlipBook>

      <EditModal
        isOpen={isModalOpen}
        leftPageText={editTexts[page] || ""}
        rightPageText={editTexts[page + 1] || ""}
        onSave={saveTexts}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default DemoBook;