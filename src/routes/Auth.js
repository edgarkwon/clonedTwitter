import AuthForm from "components/AuthForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import nnft_logo from "../components/nnft_logo.png";
import ReactPlayer from "react-player/lazy";

import { authService } from "fbase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import React from "react";

const Auth = () => {
  const onSocialClick = async (event) => {
    const name = event.target.name;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
  };
  return (
    <div className="container">
      <div className="logo">
        <img src={nnft_logo} width="100" style={{ marginBottom: 30 }} />
      </div>
      <div className="player-wrapper">
        <ReactPlayer
          className="react-player"
          url={"https://www.youtube.com/watch?v=ziqEJgcrgPU"} // 플레이어 url
          playing={true} // 자동 재생 on
          muted={true} // 자동 재생 on
          controls={true} // 플레이어 컨트롤 노출 여부
          light={false} // 플레이어 모드
          pip={true} // pip 모드 설정 여부
          onEnded={() => console.log("ended")} // 플레이어 끝났을 때 이벤트
        />
      </div>
      <h3 className="about-h3 white">No spams, costs, and even no verify.</h3>
      <AuthForm />
      <div className="authBtns">
        <button name="google" onClick={onSocialClick} className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button name="github" onClick={onSocialClick} className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
