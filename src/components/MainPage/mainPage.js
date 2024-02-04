import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "../MainPage/mainPage.modules.css";
import ilayarajaAudio from "../../Assets/ilayaraja.mp3";
import laugh from "../../Assets/laugh.mp3";
import githubLogo from '../../Assets/github-mark-white.png'
const BASE_URL = "https://valentine-ybw3.onrender.com";

function MainPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [invalidLink, setInvalidLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState("");
  const [imgMarginRight, setImgMarginRight] = useState("60");
  const [yesButtonSize, setYesButtonSize] = useState("1.5");
  const [YesClicked, setYesClicked] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [currentNoPhraseIndex, setCurrentNoPhraseIndex] = useState(0);
  const noAudioRef = useState(null);
  const noPhrases = [
    "No",
    "Reconsider? My dog thinks you should",
    "Think twice? I have pizza and a Netflix subscription",
    "Reconsidering? I'm 90% coffee and 10% charm",
    "No? I was going to share my chocolate stash with you!",
    "I promise I won't sing in the shower",
    "I promise not to steal your fries, just one or two",
  ];
  const handleNoButton = (event) => {
    event.preventDefault();
    setImgMarginRight((prev) => Math.max(prev - 10, 0));
    setYesButtonSize((prev) =>(prev * 1.5));
    const nextIndex = (currentNoPhraseIndex + 1) % noPhrases.length;
    setCurrentNoPhraseIndex(nextIndex);
    if (!audioPlayed) {
      const audio = new Audio(ilayarajaAudio);
      audio.volume = 0.05;
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));

      setAudioPlayed((prev) => !prev);
      noAudioRef.current = audio;
    }
  };

  const handleYesButton = () => {
    setYesClicked(true);
    if(noAudioRef.current){
        noAudioRef.current.pause();
        noAudioRef.current.currentTime =0;
    }
    const yesAudio = new Audio(laugh);
    yesAudio.volume = 0.5;
    yesAudio.play().catch((error) => console.log("Error playing laugh"))
  };

  const handleNewInvite = (event) => {
    event.preventDefault()
    navigate('/')
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/${userId}`);
        if (response.data.message === "User not found") {
          setInvalidLink((prev) => !prev);
        }
        setUserDetails(response.data.details);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId]);

  return (
    <div>
      {loading ? (
        <div>Surprise Loading....</div>
      ) : (
        <div
          className="main-page"
          style={{ background: userDetails.pageColor }}
        >
          {YesClicked ? (
            <>
              <Confetti />
              <div className="boy-girl-gifs">
                <img
                  className="love-bunny"
                  src={"https://media.tenor.com/bVN5MdTrelYAAAAj/yaseen1.gif"}
                  alt="left-bunny"
                ></img>
              </div>
              <div>
                <h1 className="celebrations-message">
                  Let's create some memories
                </h1>
              </div>
              <div>
                <h2 className="create-new-invite" onClick={handleNewInvite}>
                  create new invite
                </h2>
                <a
                  href="https://github.com/surya-nand"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="github-logo"
                    src={githubLogo}
                    alt="github-logo"
                  ></img>
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="boy-girl-gifs">
                <img
                  className="left-bunny"
                  style={{ marginRight: `${imgMarginRight}%` }}
                  src={
                    "https://media.tenor.com/vZZEPrwfe6AAAAAj/happy-amine.gif"
                  }
                  alt="left-bunny"
                ></img>
                <img
                  className="right-bunny"
                  src={
                    "https://media.tenor.com/_mHPg-YIxFEAAAAj/love-you-cute-girl.gif"
                  }
                  alt="right-bunny"
                ></img>
                <p>Will you be my valentine {userDetails.name}?</p>
                <p>{userDetails.pickupLine}</p>
              </div>
              <div className="yes-no-buttons">
                <button
                  onClick={handleYesButton}
                  className="yes-button"
                  style={{ fontSize: `${yesButtonSize}vw` }}
                >
                  Yes
                </button>
                <button onClick={handleNoButton} className="no-button">
                  {noPhrases[currentNoPhraseIndex]}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MainPage;
