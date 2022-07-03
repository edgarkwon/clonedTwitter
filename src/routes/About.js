import React from "react";
const About = () => {
  return (
    <div className="container">
      <h1 className="nft-title">NNFT?</h1>
      <h3 className="about-h3">Not-NFT</h3>
      <p className="about-desc">
        In web3 world, NFT is a tool for building-communities and
        sharing-memories (POAP). It's cool but, every app says
        <strong className="about-quote">
          {" " + '"Hey, where is your wallet?"'}
        </strong>
        <strong className="about-strong">
          👈 Not cool for my ordinary friends.
        </strong>
      </p>
      <h3 className="about-h3">Backlogs.</h3>
      <p className="about-desc">
        Option for selecting power for creators, better design for the profile
        tab, a search engine, ready for scaling up, metamask sync, etc,.
      </p>
      <h3 className="about-h3">Contacts</h3>
      <p className="about-desc">hello@edgarkwon.me</p>
    </div>
  );
};

export default About;
