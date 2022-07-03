import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import {
  collection,
  query,
  onSnapshot,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import { Routes, Route } from "react-router-dom";
import Mint from "./Mint";

const Home = ({ userObj }) => {
  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "tweets"),
      orderBy("createdAt", "desc"),
      where("creatorId", "==", `${userObj.uid}`)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data().owners?.length);
    });
  };
  useEffect(() => {
    getMyTweets();
  }, []);

  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    onSnapshot(
      query(collection(dbService, "tweets"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const tweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          numOwners: doc.data().owners?.length,
        }));
        setTweets(tweetArray);
      }
    );
  }, []);

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {tweets.map((tweet) => (
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

export default Home;
