import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../images/logo-fanatics.svg";

export const UserHome = () => {
	return (
		<Container>
			<div className="header-container">
				<img src={logo} alt="Fanatics Logo" className="fanatics-logo" />
				<div className="header">
					<h1 className="heading">FANATICS</h1>
					<h2 className="sub-heading">USER DATABASE</h2>
				</div>
			</div>

			<div className="list-cont">
				<div className="option">
					<h3 className="option-heading">Register New User</h3>
					<Link className="link" to="/registeruser">
						<button className="btn fan-button mr-20 ml-20 wd-80">
							Register
						</button>
					</Link>
				</div>
				<br />
				<div className="option">
					<h3 className="option-heading">
						Update Existing User Details
					</h3>
					<Link className="link" to="/updateuser">
						<button className="btn fan-button mr-20 ml-20 wd-80">
							Update
						</button>
					</Link>
				</div>
				<br />
				<div className="option">
					<h3 className="option-heading">
						Get User Details Using Id
					</h3>
					<Link className="link" to="/userid">
						<button className="btn fan-button ml-20 mr-20 wd-80">
							Id
						</button>
					</Link>
				</div>
				<br />
				<div className="option">
					<h3 className="option-heading">
						Get User Details Using Name
					</h3>
					<Link className="link" to="/username">
						<button className="btn fan-button mr-20 ml-20 wd-80">
							Name
						</button>
					</Link>
				</div>
			</div>
		</Container>
	);
};

const Container = styled.div`
	.header-container {
		background-color: rgb(9, 32, 63);
		padding: 10px;
		display: flex;
		justify-content: center;
		.fanatics-logo {
			width: 180px;
			height: 150px;
		}
		.header {
			margin: 5px 10px;
			padding: 5px 10px;
			text-align: center;
			.heading {
				font-weight: 800;
				font-size: 60px;
				color: rgb(255, 255, 255);
			}
			.sub-heading {
				font-weight: 800;
				font-size: 35px;
				color: rgb(255, 255, 255);
			}
		}
	}
	.list-cont {
		margin: 15px 10px;
		margin-top: 25px;
		list-style-type: none;
		.option {
			padding: 5px 10px;
			font-family: "Trebuchet MS", sans-serif;
			display: flex;
			flex-direction: row;
			justify-content: center;
			.option-heading {
				width: 30%;
				font-size: 36px;
				font-weight: 600;
				color: #08084bea;
				display: inline-block;
			}
			.link {
				padding-top: 8px;
			}
		}
		.fan-button {
			background-color: rgb(28, 84, 197);
			border-color: rgb(28, 84, 197);
			color: white;
			font-family: "Trebuchet MS", sans-serif;
		}
	}
	.mr-20 {
		margin-right: 20px;
	}
	.ml-20 {
		margin-left: 20px;
	}
	.wd-80 {
		width: 80px;
	}
`;
