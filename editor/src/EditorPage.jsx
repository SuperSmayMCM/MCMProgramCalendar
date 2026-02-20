import { useState } from 'react'
import './App.css'

function EditorPage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Editor</h1>
      <p>Welcome to the MCM Program Calendar Editor</p>
      <nav>
        <a href="/">Status</a> | <a href="/calendar.html">Calendar</a> | <a href="/editor.html">Editor</a>
      </nav>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Add your editor content here</p>
      </div>
    </div>
  )
}

export default EditorPage
