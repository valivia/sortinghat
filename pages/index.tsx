import type { GetServerSideProps, GetStaticProps } from "next";
import { withRouter } from "next/router";
import styles from "../styles/question.module.scss";
import Head from "next/head";
import React from "react";
import Footer from "../components/footer.module";
import Layout from "../components/layout.module";
import question, { option } from "../types/question";
import cookies, { CookieAttributes } from "js-cookie";
import { Props, State } from "../types/question.module";

const questionsPath = process.env.NEXT_PUBLIC_QUESTIONS_PATH as string;
const resultPath = process.env.NEXT_PUBLIC_RESULT_PATH as string;
const cookieConfig = { sameSite: "Strict", secure: true } as CookieAttributes;

class Question extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { index: 0, answers: new Map(), loading: true, reachedEnd: false };
  }

  public submit = async (): Promise<void> => {
    const answers = [] as string[];

    this.state.answers.forEach(x => answers.push(x.value));

    const response = await fetch(resultPath, {
      method: "POST",
      mode: "cors",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ result: answers, user: "amogus" }),
    });

    if (response.ok) {
      cookies.set("result", JSON.stringify(await response.json()), cookieConfig);
      this.props.router.push("/result");
      return;
    }
  }


  public handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const answers = this.state.answers;
    answers.set(target.alt, { name: target.id, value: target.value });
    this.setState({ answers: answers });

    const string = JSON.stringify(Object.fromEntries(this.state.answers));
    cookies.set("answers", string, cookieConfig);

    if (!this.state.reachedEnd) this.changeIndex(1);
  }

  public changeIndex = (x: number) => {
    const index = this.state.index;

    if (index <= 0 && x < 0) {
      this.props.router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      return;
    }

    if ((index >= this.props.questions.length - 1 && x > 0)) return;
    if (index + 1 == this.props.questions.length) this.setState({ reachedEnd: true });
    this.setState({ index: index + x });
  }

  componentDidMount() {
    const cookie = cookies.get("answers");
    if (!cookie) {
      this.setState({ loading: false });
      return;
    }

    const json = JSON.parse(cookie);
    if (!json) {
      cookies.remove("answers");
      this.setState({ loading: false });
      return;
    }

    const array = Object.entries(json);
    const map = new Map();

    for (const answer in array) {
      map.set(array[answer][0], array[answer][1]);
    }

    this.setState({ loading: false, answers: map });
  }

  public render = () => {
    if (this.state.loading) return <></>;
    const questions = this.props.questions;
    const currentQuestion = questions[this.state.index];
    const currentAnswer = this.state.answers.size !== 0 ?
      this.state.answers.get(currentQuestion.id) :
      undefined;

    return (
      <>
        <Head>
          <title>sorting hat</title>
          <meta name="theme-color" content="#B5A691" />
          <meta name="robots" content="noindex, nofollow"></meta>
        </Head>
        <Layout>
          <h2>{currentQuestion.question}</h2>

          <menu className={styles.buttons}>
            <button onClick={() => this.changeIndex(-1)}>Vorige</button>
            <progress
              className={styles.progress}
              max={questions.length}
              value={this.state.answers.size}>
            </progress>
            {this.state.index + 1 == this.props.questions.length ?
              <button onClick={this.submit} disabled={this.state.answers.size !== questions.length}>verstuur</button> :
              <button onClick={() => this.changeIndex(1)}>volgende</button>
            }
          </menu>

          <div className={styles.options}>
            {currentQuestion.options.map(data =>
              <div key={data.name}>
                <input
                  type="radio"
                  name="answer"
                  className={styles.option}
                  alt={currentQuestion.id}
                  value={data.value}
                  id={data.name}
                  onChange={this.handleChange}
                  defaultChecked={currentAnswer ? currentAnswer.name == data.name : false}
                />
                <div className={styles.label}>
                  <label className={styles.label} htmlFor={data.name}>{data.name}</label>
                </div>
              </div>
            )}
          </div>

          {this.state.index + 1} / {this.props.questions.length}
        </Layout>

        <Footer />
      </>
    );
  }
}

export default withRouter(Question);


export const getServerSideProps: GetServerSideProps = async () => {
  const questionData = await fetch(questionsPath);
  if (!questionData) throw "could not load questions";
  let questions = await questionData.json() as question[];


  if (!questions) return { notFound: true };

  questions = questions.map((x, i) => {
    x.id = `question${i}`;
    return x;
  });

  return {
    props: { questions },
  };
};