import React from "react";

import Header from "../Header/Header"

const NoMatch = ({profile}) => {
  return (
    <div className="layout__container">
      <Header title="权限管理" profile={profile}/>
      <main>
        <p>您没有权限访问此页面，或页面不存在 ！</p>
      </main>
    </div>
  )
}

export default NoMatch;