import React from "react";
import { Link } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faProjectDiagram, faTags  } from "@fortawesome/free-solid-svg-icons";


function Header() {

    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">SysProd</a>     
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                        
                            <Link to="/" class="nav-link active" aria-current="page" >
                                <FontAwesomeIcon icon={faHome} />
                                Home
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to="/categoria" class="nav-link">
                                <FontAwesomeIcon icon={faProjectDiagram} />
                                Categoria
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to="/produto" class="nav-link">
                                <FontAwesomeIcon icon={faTags} />
                                Produto
                            </Link>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Configurações
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><Link class="dropdown-item" to="/cor">Cor</Link></li>
                                <li><Link class="dropdown-item" to="/tamanho">Tamanho</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            </nav>
    )
}

export default Header;