import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
	const [tarea, setTarea] = useState("")
	const [listaTareas, setListaTareas] = useState([])

	function agregarTarea(event) {
		//console.log(event); para ver donde se guarda lo escrito
		setTarea(event.target.value);
	}

	function agregarLista(event) {
		//console.log(event);
		// condicionar el evento al presionar enter
		if (event.keyCode === 13 && event.target.value != "") {

			// crear la nueva tarea usando postman 

			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");

			const raw = JSON.stringify({
				"label": tarea,
				"is_done": false
			});

			const requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow"
			};

			fetch("https://playground.4geeks.com/todo/todos/lmezza", requestOptions)
				.then((response) => response.json())
				.then((result) => {
					//console.log(result) ver como salen los datos antes de ser procesados
					let newArray = listaTareas.concat(result)
					setListaTareas(newArray)
					setTarea("");
				})
				.catch((error) => console.error(error));
		}
	}

	const eliminarTarea = (id) => {
		//console.log(id);

		const requestOptions = {
			method: "DELETE",
			redirect: "follow"
		};

		fetch(`https://playground.4geeks.com/todo/todos/${id}`, requestOptions)
			.then((response) => response.text())
			.then((result) => consultaListaTareas(result))
			.catch((error) => console.error(error));

	}

	//esta funcion obtiene todas las tareas del servidor 
	function consultaListaTareas() {
		const requestOptions = {
			method: "GET",
			redirect: "follow"
		};

		fetch("https://playground.4geeks.com/todo/users/lmezza", requestOptions)
			.then((response) => {
				//console.log(response); para ver donde genera el codigo de error
				if (response.status === 404) {
					createUser();
				}
				return response.json()
			})
			.then((result) => setListaTareas(result.todos))
			.catch((error) => console.error(error));
	}
	// esta funcion crea un usuario si no existe
	function createUser() {
		const raw = "";

		const requestOptions = {
			method: "POST",
			body: raw,
			redirect: "follow"
		};

		fetch("https://playground.4geeks.com/todo/users/lmezza", requestOptions)
			.then((response) => {
				//console.log(response); para ver donde genera el codigo de error
				if (response.status === 201) {
					consultaListaTareas();
				}
				return response.json()
			})
			.then((result) => console.log(result))
			.catch((error) => console.error(error));
	}

	//debe ir al final antes del return
	useEffect(() => {
		consultaListaTareas()
	}, [])


	// Ejercicio a base de Bootstrap
	return (
		<div className="container mt-5 w-50">
			<div className="d-flex justify-content-center fs-2 mb-2"><input className="w-75 border-2 rounded-pill text-center" type="text" placeholder="What do you need to do?" onKeyDown={agregarLista} value={tarea} onChange={agregarTarea} /></div>
			<ul className="my-2 p-0 d-flex justify-content-between">
				{/* Crear con map lista */}
				<div className="list-group">
					{listaTareas.length > 0 ? listaTareas.map((item) => <li className="list-group-item list-group-item-dark" key={item.id}>{item.label}<button type="button" className="btn btn-light position end-0" onClick={() => eliminarTarea(item.id)}>x</button></li>) : null}
				</div>
			</ul>
			{listaTareas.length + ` Task left`}
		</div>
	);
};

export default Home;
