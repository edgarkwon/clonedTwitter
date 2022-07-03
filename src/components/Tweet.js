import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route } from "react-router-dom";
import Mint from "routes/Mint";

const Tweet = ({ tweetObj, isOwner }) => {
  const tweetDocRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const tweetUrlRef = ref(storageService, tweetObj.attachmentUrl);
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    if (ok) {
      await deleteDoc(tweetDocRef);
      await deleteObject(tweetUrlRef);
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(tweetDocRef, { text: newTweet });
    setEditing(false);
  };
  const onChange = (event) => {
    const value = event.target.value;
    setNewTweet(value);
  };
  return (
    <div className="nweet">
      <Link
        to={{
          pathname: `/mint/${tweetObj.id}`,
        }}
      >
        <h4>
          {tweetObj.text}: {tweetObj.numOwners}/{tweetObj.number}
        </h4>
        <img src={tweetObj.attachmentUrl} />
      </Link>
    </div>
  );
};

export default Tweet;
