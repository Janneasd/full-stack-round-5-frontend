import { useState, useEffect, useRef  } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogAppUser')
      setUser(null)
    } catch (exception) {
      setErrorMessage('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }
 


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>login</h2>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }


  const addBlog = (event) => {
    blogFormRef.current.toggleVisibility()

    event.preventDefault()
    try {
    const blogObject = {
      title: title,
      author: author,
      url: url
    }
  
    

    blogService
      .create(blogObject)
      .then(x => {
        setBlogs(blogs.concat(x))
        setNewBlog('')
        setErrorMessage('new blog added')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
      setTitle('')
      setAuthor('')
      setURL('')
    } catch (exception){
      setErrorMessage('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
      title
      <input
      type="text"
      value={title}
      id="title"
      onChange={({ target }) => setTitle(target.value)}
      />
      </div>
      <div>
      author
      <input
      type="text"
      value={author}
      id="author"
      onChange={({ target }) => setAuthor(target.value)}
      />
      </div>
      <div>
       url
      <input
      type="text"
      value={url}
      id="url"
      onChange={({ target }) => setURL(target.value)}
      />
      </div>
      <button type="submit">add</button>
    </form>  
  )


  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />

      
       {user === null ?
       loginForm(): 
       
       <div>
      <p>{user.name} logged in</p>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
      {blogForm()}
      </Togglable>
     
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <button onClick={handleLogout}>log out</button>
      
       </div>
      }
     
     <Footer />
    </div>
  )
}

export default App
