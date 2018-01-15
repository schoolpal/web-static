import React from 'react'

const CourseType = ({name}) => (
  <select name={name || "courseType"} className="form-control">
    <option value="">请选择</option>
    <option value="类别1">类别1</option>
    <option value="类别2">类别2</option>
  </select>
);

export default CourseType;