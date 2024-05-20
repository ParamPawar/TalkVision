import React from "react";
import '../App.css';

const Homepage = () => {
	return(
		<div className="homepage-container">
			<div className="input-container">			
				<input type="email" placeholder="enter your email"/>
				<input type="text" placeholder="enter your Code"/>
				<button>Enter Room</button>
			</div>
		</div>
	)
	}

export default Homepage
