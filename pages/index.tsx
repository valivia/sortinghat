import type { GetStaticProps } from "next";
import { withRouter } from "next/router";
import styles from "../styles/question.module.scss";
import Head from "next/head";
import React from "react";
import Footer from "../components/footer.module";
import Layout from "../components/layout.module";
import question, { option } from "../types/question";
import cookies, { CookieAttributes } from "js-cookie";
import { props, state } from "../types/question.module";

const api = process.env.NEXT_PUBLIC_API_SERVER as string;
const cookieConfig = { sameSite: "Strict", secure: true } as CookieAttributes;

class Question extends React.Component<props, state> {

  constructor(props: props) {
    super(props)
    this.state = { index: 0, answers: new Map(), loading: true }
  }

  public submit = async (): Promise<void> => {
    const answers = [] as string[];

    this.state.answers.forEach(x => answers.push(x.value));


    const response = await fetch(`${api}/setResult`, {
      method: "POST",
      mode: 'cors',
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ result: answers, user: "amogus" })
    })


    /*
    const temp = [
      { name: "BDAM", percentage: 0.1, max: 100, score: 10 },
      { name: "FICT", percentage: 0.8, max: 100, score: 80 },
      { name: "ES", percentage: 0.5, max: 100, score: 50 },
      { name: "IAT", percentage: 0.26, max: 100, score: 26 },
    ]
    */

    //    {
    //  cookies.set("result", JSON.stringify(temp), cookieConfig)

    if (response.ok) {
      cookies.set("result", JSON.stringify(await response.json()), cookieConfig)
      this.props.router.push("/result");
      return;
    }
  }


  public handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const answers = this.state.answers;
    answers.set(target.alt, { name: target.id, value: target.value });
    this.setState({ answers: answers });
    this.next();
  }

  public changeIndex = (x: number) => {
    const index = this.state.index;
    if (index <= 0 && x < 0) {
      this.props.router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      return;
    }
    if ((index >= this.props.questions.length - 1 && x > 0)) return;
    this.setState({ index: index + x });
  }

  public next = () => {
    this.changeIndex(1);
    const cookieData = JSON.stringify(Object.fromEntries(this.state.answers));
    cookies.set("answers", cookieData, cookieConfig)
  }

  componentDidMount() {
    const cookie = cookies.get("answers");
    if (!cookie) {
      this.setState({ loading: false });
      return;
    }

    const result = JSON.parse(cookie) as unknown;
    if (!result) {
      cookies.remove("answers");
      this.setState({ loading: false });
      return;
    }

    this.setState({ loading: false });
    return;

    const map = new Map(Object.entries(cookie)) as unknown as Map<string, option>;

    this.setState({ answers: map, loading: false })
  }

  public render = () => {
    if (this.state.loading) return <></>
    const questions = this.props.questions
    const currentQuestion = questions[this.state.index]
    const currentAnswer = this.state.answers.size !== 0 ?
      this.state.answers.get(currentQuestion.id) :
      undefined

    return (
      <>
        <Head>
          <title>Question</title>
          <meta name="theme-color" content="#B5A691" />
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
              <button onClick={this.next}>volgende</button>
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

export default withRouter(Question)


export const getStaticProps: GetStaticProps = async () => {
  const questionData = await fetch(`${api}/api/questions`);
  if (!questionData) throw "could not load questions"
  let questions = await questionData.json() as question[];


  if (!questions) return { notFound: true };

  questions = questions.map((x, i) => { x.id = `question${i}`; return x });

  console.log(questions);

  return {
    props: { questions }, revalidate: 86400,
  };
};