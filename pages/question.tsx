import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import styles from "../styles/question.module.scss";
import Head from "next/head";
import React from "react";
import Footer from "../components/footer.module";
import Layout from "../components/layout.module";
import question from "../types/question";

const api = process.env.NEXT_PUBLIC_API_SERVER as string;

export default class Question extends React.Component<{ questions: question[] }, state> {
  state = {
    index: 2,
    answers: []
  }

  constructor(props: { questions: question[] }) {
    super(props)
  }

  public submit = async (): Promise<void> => {
    const response = await fetch(api, {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(this.state.answers)
    })

    if (response.ok) return;
  }

  public handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.name)
  }

  public changeIndex = (x: number) => {
    const index = this.state.index;

    if (index >= this.props.questions.length - 1 && x > 0) return;
    if (index <= 0 && x < 0) return;

    this.setState({ index: index + x });
  }

  public next = () => {
    this.changeIndex(1);
  }
  public back = () => { this.changeIndex(-1); }

  public render = () => {

    const questions = this.props.questions
    const currentQuestion = questions[this.state.index]

    return (
      <>
        <Head>
          <title>Question</title>
          <meta name="theme-color" content="#B5A691" />
        </Head>
        <Layout>
          <main className={styles.main}>
            <h2>{currentQuestion.question}</h2>
            {currentQuestion.options.map(data => (
              <><input
                type="radio"
                name={data.name}
                onChange={this.handleChange}
                checked={true}></input>
                <label>{data.name}</label></>
            )
            )}
            <button onClick={this.next}>Next</button>
            <button onClick={this.back}>Back</button>
            {this.state.index}
          </main>
        </Layout>

        <Footer />
      </>
    );
  }
}


export const getStaticProps: GetStaticProps = async () => {
  /*
  const questionData = await fetch(api);
  const questions = await questionData.json() as question[];
  */

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

interface state {
  index: number;
  answers: string[];
}