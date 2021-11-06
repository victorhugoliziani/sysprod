import React from "react";
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import Categoria from './pages/Categoria';
import Produto from './pages/Produto';
import Cor from './pages/Cor';
import Tamanho from "./pages/Tamanho";
import Cliente from "./pages/Cliente";
import Venda from "./pages/Venda";

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={Categoria} path="/categoria" />
            <Route component={Produto} path="/produto" />
            <Route component={Cor} path="/cor" />
            <Route component={Tamanho} path="/tamanho" />
            <Route component={Cliente} path="/cliente" />
            <Route component={Venda} path="/venda" />
        </BrowserRouter>
    )
}

export default Routes;