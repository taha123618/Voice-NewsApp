import React, { useState, useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import { Typography } from "@material-ui/core";
import wordsToNumbers from "words-to-numbers";
import images from "./images";
import { NewsCards, Modal } from "./compontents";
import useStyles from "./styles";

// integration with Alan AI
const alankey =
  "3eb3976e1def5a7b251f8097af2042622e956eca572e1d8b807a3e2338fdd0dc/stage";

const App = () => {
  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  // for style class
  const classes = useStyles();
  // for alanbtn button config we useEffect
  useEffect(() => {
    alanBtn({
      key: alankey,
      //   commands for Alan AI
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "instructions") {
          setIsOpen(true);
        } else if (command === "highlight") {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > articles.length) {
            alanBtn().playText("Please try that again...");
          } else if (article) {
            window.open(article.url, "_blank");
            alanBtn().playText("Opening...");
          } else {
            alanBtn().playText("Please try that again...");
          }
        }
      },
    });
  }, []);

  return (
    <>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}>
              <Typography variant="h5" component="h2">
                Try saying: <br />
                <br />
                Open article number [4]
              </Typography>
            </div>
            <div className={classes.card}>
              <Typography variant="h5" component="h2">
                Try saying: <br />
                <br />
                Go back
              </Typography>
            </div>
          </div>
        ) : null}
        <img
          src={images.logo}
          className={classes.alanLogo}
          alt="logo"
        />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
            Created by
            <a
              className={classes.link}
              href="https://www.linkedin.com/in/taha-ahmed1999/" target="_blank">
              Taha Ahmed
            </a>
            -
            {/* <a
              className={classes.link}
              href="https://www.linkedin.com/in/taha-ahmed1999/"
            >
              taha Ahmed
            </a> */}
          </Typography>
          <img
            className={classes.image}
            src={images.logo}
            height="50px"
            alt="logo"
          />
        </div>
      ) : null}
    </>
  );
};

export default App;
