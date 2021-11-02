import type { GetStaticProps } from "next";
import { NextRouter, useRouter, withRouter } from "next/router";
import styles from "../styles/question.module.scss";
import Head from "next/head";
import React from "react";
import Footer from "../components/footer.module";
import Layout from "../components/layout.module";
import question from "../types/question";
import cookies, { CookieAttributes } from "js-cookie";

const api = process.env.NEXT_PUBLIC_API_SERVER as string;
const cookieConfig = { sameSite: "Strict", secure: true } as CookieAttributes;

class Question extends React.Component<props, state> {

  state = {
    index: 0,
    answers: new Map(),
  }

  constructor(props: props) {
    super(props)

    let cookie = cookies.get("answers")
    if (!cookie) return;

    cookie = JSON.parse(cookie);
    if (!cookie) {
      cookies.remove("answers");
      return;
    }

    const map = new Map(Object.entries(cookie));

    console.log(this.state);
  }

  public submit = async (): Promise<void> => {
    const answers = [] as string[];

    this.state.answers.forEach(x => answers.push(x.value));

    const response = await fetch(`${api}/setResult`, {
      method: "POST",
      mode: 'cors',
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(answers)
    })

    const temp = {
      percentages: {
        BDAM: 0.6,
        FICT: 0.1,
        ES: 0.4,
        IAT: 0.9
      }
    }

    if (response.ok) {
      cookies.set("result", JSON.stringify(temp), cookieConfig)
      this.props.router.push("/result");
      return;
    }
  }

  public handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const answers = this.state.answers;
    answers.set(target.alt, { name: target.id, value: target.value })
  }

  public changeIndex = (x: number) => {
    console.log(this.state.answers)
    const index = this.state.index;
    if ((index >= this.props.questions.length - 1 && x > 0) || (index <= 0 && x < 0)) return;
    this.setState({ index: index + x });
  }

  public next = () => {
    this.changeIndex(1);
    const cookieData = JSON.stringify(Object.fromEntries(this.state.answers));
    cookies.set("answers", cookieData, cookieConfig)
  }

  public render = () => {

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
          <main className={styles.main}>
            <h2>{currentQuestion.question}</h2>

            <menu className={styles.buttons}>
              <button onClick={() => this.changeIndex(-1)}>Back</button>
              {this.state.index + 1 == this.props.questions.length ?
                <button onClick={this.submit}>submit</button> :
                <button onClick={this.next}>Next</button>
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
                  <label className={styles.label} htmlFor={data.name}>{data.name}</label>
                </div>
              )}
            </div>

            {this.state.index + 1} / {this.props.questions.length}
          </main>
        </Layout>

        <Footer />
      </>
    );
  }
}

export default withRouter(Question)


export const getStaticProps: GetStaticProps = async () => {
  // const questionData = await fetch(`${api}/getQuestions`);
  // if (!questionData) throw "could not load questions"
  // let questions = await questionData.json() as question[];

  let questions = [
    {
      "question": "Ben je meer een soft of -hardware persoon?",
      "options": [
        { "name": "Software all the way!", "value": "0/0/10/0" },
        { "name": "Mijn 'Hart' ligt bij hardware", "value": "0/5/0/10" },
        { "name": "Het heeft allebei wel wat", "value": "0/3/5/5" }
      ]
    },
    {
      "question": "Jouw droomwerkgever is: ",
      "options": [
        { "name": "Google", "value": "3/3/8/3" },
        { "name": "De Politie", "value": "0/10/0/0" },
        { "name": "Een klein lokaal bedrijf", "value": "5/5/5/5" },
        { "name": "Ik wil later voor mezelf werken", "value": "5/5/5/5" }
      ]
    },

    {
      "question": "Je koelkast is leeg. Wat doe je?",
      "options": [
        { "name": "Je schrijft een programma die automatisch nieuwe producten besteld", "value": "2/0/10/2" },
        { "name": "Je maakt een spreadsheet aan zodat je voortaan goed bij kan houden wat je nog hebt", "value": "10/0/0/2" },
        { "name": "Je gaat opzoek naar bewijsmateriaal voor de dader", "value": "0/10/0/0" },
        { "name": "Je stuurt een bericht in de famile WhatsApp groep, waarbij je iedereen beschuldigt", "value": "0/0/0/10" }
      ]
    }
  ] as question[]


  if (!questions) return { notFound: true };

  questions = questions.map((x, i) => { x.id = `question${i}`; return x });

  return {
    props: { questions }, revalidate: 86400,
  };
};

interface props {
  router: NextRouter;
  questions: question[]
}

interface state {
  index: number;
  answers: Map<string, string>
}