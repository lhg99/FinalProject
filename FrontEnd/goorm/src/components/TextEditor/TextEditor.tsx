import axiosInstance from '../../api/axiosInstance';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import React, { ComponentProps } from 'react';
import styles from './TextEditor.module.scss';

class UploadAdapter {
  private loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file: File) => new Promise((resolve, reject) => {
      const fd = new FormData();
      fd.append('upload', file);
      axiosInstance.post('/s3/ck/upload', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          resolve({ default: response.data.url });  
        })
        .catch(error => {
          reject('Server Error');
          console.error('Server Error:', error);
        });
    }));
  }

  abort() {
    console.log('Upload aborted');
  }
}

interface Props {
  defaultValue: string;
  onChange: (data: string) => void;
  toolbar?: string[];
}

const TextEditor  = ({ toolbar, defaultValue, onChange }: Props) => {
  function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader);
    };
  }

  const editorConfig: ComponentProps<typeof CKEditor>['config'] = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
    toolbar: toolbar || [
      'undo', 'redo', '|',
      'imageUpload', 'imageStyle:full', 'imageStyle:side', '|',
      'heading', '|',
      'bold', 'italic', 'link', '|',
      'bulletedList', 'numberedList', 'insertTable',
    ],
    image: {
      styles:  {
        options: [
          {
            name: 'default',
            title: 'Default',
            icon: 'default',
            className: styles.defaultImageSize,
            modelElements: ['imageBlock']
          }
        ]
      },
      toolbar: ['imageTextAlternative']
    },
  };

  return (
    <div className={styles.container}>
      <CKEditor
        editor={ClassicEditor}
        data={defaultValue}
        config={editorConfig}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
}

export default TextEditor;
