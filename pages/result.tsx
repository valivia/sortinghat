import { NextRouter, withRouter } from "next/router";
import styles from "../styles/result.module.scss";
import Head from "next/head";
import React from "react";
import Footer from "../components/footer.module";
import Layout from "../components/layout.module";
import result from "../types/result"
import cookies from "js-cookie";

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

    const result = JSON.parse(cookie) as unknown as result;
    if (!result) {
      this.setState({ invalid: true, loading: false });
      return;
    }

    this.setState({ data: result, loading: false, invalid: false })
  }

  public render = () => {
    if (this.state.loading) return <></>
    if (!this.state.loading && this.state.invalid) {
      this.props.router.push("/question");
      return <></>
    }

    return (
      <>
        <Head>
          <title>Result</title>
          <meta name="theme-color" content="#B5A691" />
        </Head>
        <Layout>
          <div className={styles.percentages}>
            <span>{this.state.data.percentages.BDAM}</span>
            <span>{this.state.data.percentages.FICT}</span>
            <span>{this.state.data.percentages.ES}</span>
            <span>{this.state.data.percentages.IAT}</span>
          </div>
        </Layout>

        <Footer />
      </>
    );
  }
}

export default withRouter(Result)


interface state {
  invalid: boolean;
  loading: boolean;
  data: result;
}

interface props {
  router: NextRouter;
}