import styled from 'styled-components';

export const CommentEditorWrapper = styled.div`
  .ck.ck-toolbar {
    display: none; // 댓글 에디터에서는 툴바를 숨김
  }

  .ck.ck-editor__editable_inline {
    border-left: 1;
    border-right: 1;
    height: 50px; // 댓글 에디터 높이를 더 작게 설정
    border-bottom: 1;
    overflow-y: auto; 
  }

  .ck-content {
    word-spacing: 3px;
    letter-spacing: 1px;
    & * {
      margin-bottom: 7px;
    }
    strong {
      font-weight: bold;
    }
    i {
      font-style: italic;
    }
    a {
      color: blue;
      text-decoration: underline;
    }
    blockquote {
      display: inline-block;
      padding-top: 7px;
      padding-left: 20px;
      padding-right: 20px;
      border-left: 10px solid '#999'};
    }
  }
`;
