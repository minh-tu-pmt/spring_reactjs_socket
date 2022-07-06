import React, { useState } from 'react'
import { ReactFormBuilder } from 'react-form-builder2'

const items = [
// Additional standard components, you don't need full definition if no modification is required. 
{  
  key: 'Header',
}, {
  key: 'TextInput',
}, {
  key: 'TextArea',
}, {
  key: 'RadioButtons',
}, {
  key: 'Checkboxes',
}, {
  key: 'Image',
}];

function CustomFormBuilder(props) {
  const [form, setForm] = useState([]);
  const handleUpdate = (e, data) => {
    console.log(e);
    console.log(data);
  }
  const handleSubmit = (e, data) => {
    console.log(e);
    console.log(data);
  }
  return (
    <div>
      <ReactFormBuilder
        edit
        data={form}
        //toolbarItems={items}
        customToolbarItems={items}
        onChange={handleUpdate}
        onSubmit={handleSubmit}
/>
    </div>
  )
}

export default CustomFormBuilder