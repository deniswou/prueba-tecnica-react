import './App.css';
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import TodoList from './component/TodoList.js';
import logo from './img/logo.png';

function App() {

  return (
    <>
      <div className="App">
        <header>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">
                  <img
                    src={logo}
                    alt="Logo"
                    height="35"
                    className="d-inline-block align-top"
                  />
                </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  <a href="https://github.com/deniswou/prueba-tecnica-react" target="_blank" rel="noopener noreferrer">Prueba técnica - Denis Chávez</a>
                </Navbar.Text>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        <div className='px-4 my-4'>
          <TodoList />
        </div>
      </div>
    </>

  );

}

export default App;
