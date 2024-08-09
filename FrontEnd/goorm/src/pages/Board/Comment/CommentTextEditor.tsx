import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommentEditorWrapper } from './CommentEditorStyle';

interface Props {
  defaultValue: string;
  onChange: (data: string) => void;
}

class CommentTextEditor extends React.Component<Props> {
  render() {
    const editorConfig = {
      toolbar: [], // 댓글 에디터에서 툴바를 사용하지 않음
    };

    return (
      <CommentEditorWrapper>
        <CKEditor
          editor={ClassicEditor}
          data={this.props.defaultValue}
          config={editorConfig}
          onChange={(event, editor) => {
            const data = editor.getData();
            this.props.onChange(data);
          }}
        />
      </CommentEditorWrapper>
    );
  }
}

export default CommentTextEditor;
