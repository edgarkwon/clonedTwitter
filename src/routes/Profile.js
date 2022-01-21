import { authService, dbService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };

  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "tweets"),
      orderBy("createdAt", "desc"),
      where("creatorId", "==", `${userObj.uid}`)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };
  useEffect(() => {
    getMyTweets();
  }, []);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
        />
        <input onChange={onChange} type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
