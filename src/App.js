import React, {Component} from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: true,
      items: [],
      totalItems: null,
      currentSearch: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { isLoaded, currentSearch } = this.state;

    this.setState({isLoaded: !isLoaded});

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${currentSearch}`)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.items,
              totalItems: result.totalItems
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
      )
  }

  handleChange = (event) => {
    this.setState({currentSearch: event.target.value});
  }

  render() {
    const { error, isLoaded, items, totalItems, currentSearch } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="App">
          <header>
            <ul>
              <li>
                Main page
              </li>
              <li>
                Recent
              </li>
            </ul>
          </header>
          <section id="main">
            <article>
              <h1>Search for books</h1>
              <form className="form" id="searchItemForm" onSubmit={this.handleSubmit}> 
                <input
                  type="text"
                  className="input"
                  id="searchInput"
                  value={currentSearch}
                  placeholder="Type book name..."
                  onChange={this.handleChange}
                />
                <button type="submit" disabled={!currentSearch}>
                  Search in google books
                </button>
              </form>
            </article>
            <article>
              {items.length && <h2>Results ({totalItems})</h2>}
              <ul>
                {items.map(item => (
                  <li key={item.id}>
                    <div>
                      {item.id}
                    </div>
                    <div>
                      Title: {item.volumeInfo.title}
                    </div>
                    <div>
                      Authors: <ul>
                        {item.volumeInfo.authors && item.volumeInfo.authors.map(author => <li>{author}</li>)}
                      </ul>
                    </div>
                    <div>
                      Publisher: <ul>
                        {item.volumeInfo.publisher}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          </section>
          <section id="recent"></section>
        </div>
      );
    }
  }
}

export default App;
