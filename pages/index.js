import { Container, Header, Heading, HeadingLevels, Link, Main, PhaseBanner, Tile } from 'lbh-frontend-react'
import Head from 'next/head'
//import Header from '../components/Header'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Header serviceName="Document Evidence Service">
        <title>Document Evidence Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Header>
      <Container>
        <PhaseBanner phase="ALPHA" url="form-url"/>
      </Container>
      <Main>
        <div className="lbh-container">
          <Heading level={HeadingLevels.H1}>Please log in</Heading>
          <Tile link="https://auth.hackney.gov.uk/auth?redirect_uri=http://localhost:3000" title="Log in with Google" />
          {/* <Link href={`https://auth.hackney.gov.uk/auth?redirect_uri=${redirect_uri}`} Login with google></Link> */}
        </div>
      </Main>
    </div>
  )
}
