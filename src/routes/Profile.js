import Tweet from "components/Tweet";
import { authService, dbService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };

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
  const [myNNFTs, setMyNNFTs] = useState([]);
  useEffect(() => {
    onSnapshot(
      query(
        collection(dbService, "tweets"),
        where("ownersId", "array-contains", `${userObj.uid}`),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const myNNFTArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          numOwners: doc.data().owners?.length,
        }));
        setMyNNFTs(myNNFTArray);
      }
    );
  }, []);

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          onChange={onChange}
          type="submit"
          value="Update Profile"
          className="formBtn"
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
      <div style={{ marginTop: 30 }}>
        {myNNFTs.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
