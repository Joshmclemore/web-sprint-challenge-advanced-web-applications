import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null) // ##### might need null value
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {navigate('/')}
  const redirectToArticles = () => {navigate('/articles')}

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    // ✨ implement
    setMessage("");
    // We should flush the message state, turn on the spinner
    setSpinnerOn(true);
    // and launch a request to the proper endpoint.
    axios.post(loginUrl, {username, password})
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    .then(res => {
      const token = res.data.token
      window.localStorage.setItem('token', token)
      setMessage(res.data.message)
      redirectToArticles()
    })
    .catch(err => {
      debugger
    })
    .finally(() => {
      setSpinnerOn(false)
    })
  } // Complete

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage("");
    setSpinnerOn(true);
    // and launch an authenticated request to the proper endpoint.
    axiosWithAuth().get(articlesUrl)
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    .then(res => {
      setArticles(res.data.articles)
      setMessage(res.data.message)
    })
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    .catch(err => {
      if(err.response.status) {
        redirectToLogin()
      } else {
        console.log(err.response)
        debugger
      }
    })
    .finally(() => {
      setSpinnerOn(false)
    })
    // Don't forget to turn off the spinner!
  } // Complete

  const postArticle = article  => {
    setMessage('');
    setSpinnerOn(true);
    console.log(article)
    axiosWithAuth().post(articlesUrl, article)
      .then(res => {
        console.log(res)
        setArticles([
          ...articles, res.data.article
        ])
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  } // In Process

  const updateArticle = article => {
    // ✨ implement
    setSpinnerOn(true);
    setMessage("");
    const { article_id, ...changes } = article
    axiosWithAuth().put(`${articlesUrl}/${article_id}`, changes)
      .then(res => {
        setArticles(articles.map(art => {
          return art.article_id === article_id
          ? res.data.article 
          : art
        }))
        setMessage(res.data.message)
        setCurrentArticleId(null)
      })
      .catch(err => {
        setMessage(err?.response?.data?.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn}/>
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm article={articles.find(art => art.article_id === currentArticleId)}  currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId} updateArticle={updateArticle} postArticle={postArticle}/>
              <Articles setCurrentArticleId={setCurrentArticleId} deleteArticle={deleteArticle} getArticles={getArticles} articles={articles} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
