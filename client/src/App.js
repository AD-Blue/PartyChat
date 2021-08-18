import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Views/Login.js';
import Register from './Views/Register.js';
import Home from './Views/Home.js';
import Nav from './Views/Components/Nav.js';
import './Styles/app.scss';


function App() {
	return (
		<Router>
			<div className='central'>
				<Nav />

				<Switch>
					<Route exact path='/login'>
						<Login />
					</Route>
					<Route exact path='/register'>
						<Register />
					</Route>
					<Route exact path='/'>
						<Home />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
