const BlogForm = ({ onSubmit, handleChange, value}) => {
    return (
      <div>
        <h2>Create a new blog</h2>
  
        <form onSubmit={onSubmit}>
          <input
            value={value}
            onChange={handleChange}
          />
          <button type="submit">create</button>
        </form>
      </div>
    )
  }
  
  export default BlogForm