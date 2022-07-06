import React from 'react'
import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';

function FormBuilder() {
  console.log("form builder");
  return (
    <div>
      FormBuilder
      <ReactFormBuilder/>
    </div>
  )
}

export default FormBuilder