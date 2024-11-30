

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import PropTypes from 'prop-types';

const TextEditor = ({ value, onChange, placeholder }) => {
  return (
    <div className="text-editor-container">
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        theme="snow"
        className="react-quill"
      />
    </div>
  );
};

// PropTypes for validation
TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default TextEditor;
