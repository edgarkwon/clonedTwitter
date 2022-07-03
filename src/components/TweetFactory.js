import { dbService, storageService } from "fbase";
import { collection, addDoc } from "firebase/firestore";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [count, setCount] = useState("");
  const [desc, setDesc] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const uploadFile = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(uploadFile.ref);
    }
    const tweetObj = {
      text: tweet,
      number: count,
      createdAt: Date.now(),
      creatorEmail: userObj.email,
      creatorName: userObj.displayName,
      attachmentUrl,
      desc,
      owners: [],
      ownersId: [],
    };
    await addDoc(collection(dbService, "tweets"), tweetObj);
    setTweet("");
    setAttachment("");
    setCount("");
    setDesc("");
  };
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "title") {
      setTweet(value);
    } else if (name === "count") {
      setCount(value);
    } else if (name === "desc") {
      setDesc(value);
    }
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          value={tweet}
          name="title"
          onChange={onChange}
          type="text"
          placeholder="*NNFT title"
          maxLength={40}
          className="factoryInput__input"
          required
        />
        <input
          value={count}
          name="count"
          onChange={onChange}
          type="number"
          min="1"
          max="100"
          placeholder="*Number of NNFT (1~100)"
          className="factoryInput__input"
          required
        />
        <input
          value={desc}
          name="desc"
          onChange={onChange}
          type="text"
          maxLength={100}
          placeholder="Describe it!"
          className="factoryInput__input"
        />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add your NNFT image</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
        required
      />
      <input
        style={{ cursor: "pointer" }}
        type="submit"
        value="CREATE"
        className="factoryInput__arrow"
      />

      {attachment && (
        <div className="factoryForm__attachment">
          <img
            alt={tweet}
            src={attachment}
            style={{ backgroundImage: attachment }}
            width="50px"
            height="50px"
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};
export default TweetFactory;
