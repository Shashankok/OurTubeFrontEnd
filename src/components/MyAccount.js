import React from "react";
import "./myAccount.css";

const MyAccount = () => {
  return (
    <div>
      <div className="myAccount-container">
        <div className="myAccount-left-container">
          <img
            className="myAccount-logo"
            src={localStorage.getItem("logoUrl")}
            alt="logo"
          />
        </div>
        <div className="myAccount-right-container">
          <h1 className="myAccount-heading">
            {localStorage.getItem("channelName")}
          </h1>
          <p className="channel-id">
            <span style={{ fontWeight: "600" }}>UserId : </span>
            {localStorage.getItem("userId")}
          </p>
          <p className="myAccount-subscriber-count">
            <span style={{ fontWeight: "600" }}>Subscribers : </span>0
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
