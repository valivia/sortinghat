import { withRouter } from "next/router";
import styles from "../styles/result.module.scss";
import Head from "next/head";
import React from "react";
import Footer from "../components/footer.module";
import Layout from "../components/layout.module";
import result from "../types/result"
import cookies from "js-cookie";
import ResultBar from "../components/resultBar.module";
import { props, state } from "../types/result.module";

class Result extends React.Component<props, state> {

  constructor(props: props) {
    super(props);
    this.state = { loading: true, invalid: false };
  }

  componentDidMount() {
    const cookie = cookies.get("result");
    if (!cookie) {
      this.setState({ invalid: true, loading: false });
      return;
    }

    const result = JSON.parse(cookie) as unknown as result[];
    if (!result) {
      cookies.remove("result");
      this.setState({ invalid: true, loading: false });
      return;
    }

    this.setState({ data: result, loading: false, invalid: false })
  }

  public reset = () => {
    cookies.remove("answers");
    cookies.remove("result");
    this.props.router.push("/")
  }

  public render = () => {
    if (this.state.loading) return <></>
    if (!this.state.loading && this.state.invalid) {
      this.props.router.push("/");
      return <></>
    }

    let data = this.state.data

    console.log(data);
    data = data.sort((b, a) => a.percentage - b.percentage);

    return (
      <>
        <Head>
          <title>Result</title>
          <meta name="theme-color" content="#B5A691" />
        </Head>
        <Layout>
          <h1>Resultaten</h1>
          <p>Dit zijn de specialisaties die het beste bij jou passen!</p>
          <div className={styles.percentages}>
            {data.map(x => <ResultBar key={x.name} {...x} />)}
          </div>
          <button className={styles.reset} onClick={this.reset}>Opnieuw</button>
        </Layout>

        <Footer />
      </>
    );
  }
}

export default withRouter(Result)