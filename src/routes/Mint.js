import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dbService } from "fbase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
const Mint = ({ userObj }) => {
  const { id } = useParams();
  const docRef = doc(dbService, "tweets", id);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [desc, setDesc] = useState("");
  const [owners, setOwners] = useState([]);
  const [ownersId, setOwnersId] = useState([]);
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [edition, setEdition] = useState("");

  const onClick = async () => {
    setOwners([
      { id: userObj.uid, name: userObj.displayName, email: userObj.email },
      ...owners,
    ]);
    setOwnersId([userObj.uid, ...ownersId]);
    console.log("ownersId", ownersId);
    console.log("owners", owners);
    await updateDoc(docRef, {
      owners: [
        {
          id: userObj.uid,
          name: userObj.displayName,
          email: userObj.email,
          edition: owners.length + 1,
        },
        ...owners,
      ],
      ownersId: [userObj.uid, ...ownersId],
    });
  };

  useEffect(async () => {
    const docRef = doc(dbService, "tweets", id);
    const docSnap = await getDoc(docRef);
    setAttachmentUrl(docSnap.data().attachmentUrl);
    setTitle(docSnap.data().text);
    setNumber(docSnap.data().number);
    setDesc(docSnap.data().desc);
    setOwners(docSnap.data().owners);
    setOwnersId(docSnap.data().ownersId);
    setCreatorEmail(docSnap.data().creatorEmail);
    setCreatorName(docSnap.data().creatorName);
  }, [title]);

  return (
    <div className="mint-nft">
      <h1 className="nft-title">{title}</h1>
      <img src={attachmentUrl} style={{ marginBottom: 15 }} />
      <span className="desc">
        {desc + " "}
        <span className="creator-info">
          - created by {creatorName}, {creatorEmail}
        </span>
      </span>

      {ownersId.includes(userObj.uid) ? (
        <p className="you-have">
          🚀 You've got a <span className="you-have-title">{title}</span>. Cool!
        </p>
      ) : owners.length == number ? (
        <p>sold out</p>
      ) : (
        <button onClick={onClick} className="mint-button">
          Mint your nnft (100% FREE)
        </button>
      )}
      <h3 className="owner-list-label">
        Owners list ({owners.length}/{number})
      </h3>
      {owners &&
        owners
          .slice(0)
          .reverse()
          .map((owner) => (
            <span key={owner.id}>
              #{owner.edition}. {owner.name} ({owner.email})
            </span>
          ))}
    </div>
  );
};

export default Mint;
