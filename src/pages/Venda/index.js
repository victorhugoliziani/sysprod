import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faProjectDiagram, faPlus, faEdit, faTrash, faCartPlus, faSearch, faCheck, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import Header from '../../components/Header';
import './style.css';

var valor_total = 0;

function Venda() {

    const baseURL = process.env.REACT_APP_BASE_URL+"venda";
    const baseURLCliente = process.env.REACT_APP_BASE_URL+"cliente";
    const baseURLProduto = process.env.REACT_APP_BASE_URL+"produto";
    const baseURLVenda = process.env.REACT_APP_BASE_URL+"venda";

    const [dataVenda, setDataVenda] = useState({
        iD_CLIENTE: 0,
        valoR_TOTAL: 0.00,
        itens: []
    });
    const [dataCliente, setDataCliente] = useState([]);
    const [dataProduto, setDataProduto] = useState([]);
    const [dataProdutoFiltrado, setDataProdutoFiltrado] = useState([]);
    const [dataClienteFiltrado, setDataClienteFiltrado] = useState([]);
    const [dataItens, setDataItens] = useState([]);
    const [updateData, setUpdateData] = useState(true);
    const [clienteSelecionado, setClienteSelecionado] = useState();
    const [clienteSelecionadoPesquisa, setClienteSelecionadoPesquisa] = useState({
        cpf: ""
    });
    const [produtoSelecionadoPesquisa, setProdutoSelecionadoPesquisa] = useState({
        nome_produto: ""
    });
    const [produtoSelecionado, setProdutoSelecionado] = useState({
        iD_PRODUTO: "",
        nome: "",
        preco: "",
        quantidade: ""
    });
    const [itemSelecionado, setItemSelecionado] = useState({
        iD_PRODUTO: "",
        nome: "",
        preco: 0.00,
        quantidade: 0
    });

    const [modalPesquisaCliente, setModalPesquisaCliente] = useState(false);
    const [modalPesquisaProduto, setModalPesquisaProduto] = useState(false);
    const [habilitaBotaoFinalizar, setHabilitaBotaoFinalizar] = useState(true);

    const abrirFecharModalPesquisaCliente = () => {
        setModalPesquisaCliente(!modalPesquisaCliente);
    }

    const abrirFecharModalPesquisaProduto = () => {
        setModalPesquisaProduto(!modalPesquisaProduto);
    }

    const selecionarCliente = (cliente) => {
        setClienteSelecionado(cliente);
        setDataVenda({
            iD_CLIENTE : cliente.iD_ENTIDADE
        })
        abrirFecharModalPesquisaCliente();
        setUpdateData(true);
    }

    const selecionarProduto = (produto) => {
        setProdutoSelecionado(produto);
        abrirFecharModalPesquisaProduto();
    }

    const handleChangeCliente = e => {
        const {name, value} = e.target;
        setClienteSelecionado({...clienteSelecionado, [name]: value});
    }

    const handleChangeitem = e => {
        const {name, value} = e.target;
        setProdutoSelecionado({...produtoSelecionado, [name]: value});
    }

    const handleChangeClientePesquisa = e => {
        const {name, value} = e.target;
        setClienteSelecionadoPesquisa({...clienteSelecionadoPesquisa, [name]: value});
    }

    const handleChangeProdutoPesquisa = e => {
        const {name, value} = e.target;
        setProdutoSelecionadoPesquisa({...produtoSelecionadoPesquisa, [name]: value});
    }

    const ObterClientes = async() => {
        await axios.get(baseURLCliente)
        .then(response => {
            setDataCliente(response.data);
            setDataClienteFiltrado(response.data);
            setUpdateData(true);
        }).catch(error =>  {
            console.log(error);
        });

    }

    const ObterClienteCPF = async() => {
        await axios.get(baseURLCliente+"/"+clienteSelecionadoPesquisa.cpf)
        .then(response => {

           var clienteResponse = response.data;

            var dadosAux = []

            var clienteFiltro = dataCliente.filter(cliente => cliente.iD_ENTIDADE == clienteResponse.iD_ENTIDADE);
        
            if(clienteFiltro.length > 0) {
                dadosAux.push({
                    iD_ENTIDADE : clienteFiltro[0].iD_ENTIDADE,
                    nome : clienteFiltro[0].nome,
                    cpf: clienteFiltro[0].cpf
                })
            }

            setDataClienteFiltrado(dadosAux);
            
            setUpdateData(true);
            
        }).catch(error => {
            console.log(error);
        });

    }

    const ObterProdutos = async() => {
        await axios.get(baseURLProduto)
        .then(response => {
            setDataProduto(response.data);
            setDataProdutoFiltrado(response.data)
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });
    }

    const ObterProdutosNome = async() => {
        await axios.get(baseURLProduto+"/"+produtoSelecionadoPesquisa.nome_produto)
        .then(response => {
            
            var dadosAux = []
            response.data.map(produtoResponse => {

                var produtoFiltro = dataProduto.filter(produto => produto.iD_PRODUTO == produtoResponse.iD_PRODUTO);
        
                if(produtoFiltro) {
                    dadosAux.push({
                        iD_PRODUTO : produtoFiltro[0].iD_PRODUTO,
                        nome : produtoFiltro[0].nome,
                        preco: produtoFiltro[0].preco
                    })
                }
            })

            setDataProdutoFiltrado(dadosAux);
            
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });
    }

    const AdcionarItem = () => {

        if(produtoSelecionado.iD_PRODUTO != "" && produtoSelecionado.nome != "" && produtoSelecionado.quantidade != undefined) {

            var itemSelecionado = {
                iD_PRODUTO: produtoSelecionado.iD_PRODUTO,
                nome: produtoSelecionado.nome,
                valor: produtoSelecionado.preco,
                quantidade: produtoSelecionado.quantidade
            }

            var produtoExist = dataItens.filter(produto => produto.iD_PRODUTO === produtoSelecionado.iD_PRODUTO);

            if(produtoExist.length == 0) {
                
                valor_total = valor_total + (itemSelecionado.valor * itemSelecionado.quantidade)

                setDataItens(dataItens.concat(itemSelecionado));
    
                setDataVenda({
                    ...dataVenda,
                    valoR_TOTAL: valor_total,
                    itens: dataItens.concat(itemSelecionado)
                })
        
                setProdutoSelecionado({
                    iD_PRODUTO : "",
                    nome : "",
                    preco : "",
                    quantidade: ""
                });  
                setUpdateData(true);
            } else {
                alert("O produto já está adicionado");
            }

        } else {
            console.log("Precisa selecionar o produto corretamente");
        }

    }

    const ExcluirItem = (itemExcluir) => {
        let dadosAux = dataItens;
        
        setDataItens(dataItens.filter(produto => produto.iD_PRODUTO != itemExcluir.iD_PRODUTO));
       
        setUpdateData(true);
    }

    const validaParaHabilitarBtnFinalizar = () => {
        
        if(dataVenda.iD_CLIENTE != "" && dataItens.length > 0) {
            setHabilitaBotaoFinalizar(false);
        } else {
            setHabilitaBotaoFinalizar(true);
        }

    }

    const FinalizarVenda = async() => {
        await axios.post(baseURLVenda, dataVenda)
        .then(response => {
            console.log(response.data);
            alert("Venda finalizada com sucesso");
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });
        
    }

    useEffect(() => {

        if(updateData) {
           ObterClientes();
            ObterProdutos();
            setUpdateData(false);
        }
    }, [])

    useEffect(() => {
        validaParaHabilitarBtnFinalizar();
    }, [AdcionarItem, ExcluirItem])

    return (
        <div className="container">
            <Header />
            <div className="page-venda">
                <h3><FontAwesomeIcon icon={faCartPlus} /> Nova Venda</h3>
                <div className="group-pesquisa">
                    <div class="form-group group-cliente">
                        <label>ID</label>
                        <input type="text" readOnly name="iD_ENTIDADE" class="form-control" value={clienteSelecionado && clienteSelecionado.iD_ENTIDADE} onChange={handleChangeCliente} />
                        <label>Cliente</label>
                        <input type="text" readOnly name="nome_cliente" class="form-control" value={clienteSelecionado && clienteSelecionado.nome} onChange={handleChangeCliente} />
                        <button className="btn btn-secondary" onClick={() => abrirFecharModalPesquisaCliente()}>
                            <FontAwesomeIcon icon={faSearch} />
                            Buscar
                        </button>
                    </div>
                    <div className="form-group group-produto">
                        <label>ID</label><br/>
                        <input type="text" name="iD_PRODUTO" readOnly  className="form-control" value={produtoSelecionado && produtoSelecionado.iD_PRODUTO} onChange={handleChangeitem} /><br/>
                        <label>Produto</label><br/>
                        <input type="text" name="nome" readOnly  className="form-control" value={produtoSelecionado && produtoSelecionado.nome} onChange={handleChangeitem} /><br/>
                        <label>Qtd.</label><br/>
                        <input type="text" name="quantidade" className="form-control" value={produtoSelecionado && produtoSelecionado.quantidade} onChange={handleChangeitem} /><br/>
                        <button className="btn btn-secondary" onClick={() => abrirFecharModalPesquisaProduto()}>
                            <FontAwesomeIcon icon={faSearch} />
                            Buscar
                        </button>
                        <button className="btn btn-primary" onClick={() => AdcionarItem()}>Adicionar</button><br/>
                    </div>
                </div>

                <table className="table table-bordered table-items">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataItens.map(item => (
                                <tr key={item.iD_PRODUTO}>
                                    <td>{item.iD_PRODUTO}</td>
                                    <td>{item.nome}</td>
                                    <td>{item.valor.toLocaleString('pt-br', {minimumFractionDigits: 2}).replace(".", ",") }</td>                              
                                    <td>{item.quantidade}</td>                                                      
                                    <td>
                                        <button className="btn btn-danger" onClick={() => ExcluirItem(item)}>Excluir</button>                                                                      
                                    </td>                                                     
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <button className="btn btn-primary" disabled={habilitaBotaoFinalizar} onClick={() => FinalizarVenda()}>Finalizar venda</button>
               

                <Modal isOpen={modalPesquisaCliente}>
                    <ModalHeader>
                        Procurar clientes
                        <button className="btn btn-danger btn-fechar" onClick={() => abrirFecharModalPesquisaCliente()}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <div className="filtro">
                                <label>CPF</label>
                                <input type="text" name="cpf" className="form-control" onChange={handleChangeClientePesquisa} />
                                <button className="btn btn-secondary" onClick={() => ObterClienteCPF()}>
                                    <FontAwesomeIcon icon={faSearch} />
                                    Buscar
                                </button><br/>
                            </div>
                            <table className="table table-bordered table-global">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>CPF</th>
                                        <th>Escolher</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataClienteFiltrado.map(cliente => (
                                            <tr key={cliente.iD_ENTIDADE}>
                                                <td>{cliente.iD_ENTIDADE}</td>
                                                <td>{cliente.nome}</td>
                                                <td>{cliente.cpf}</td>
                                                <td>
                                                    <button className="btn btn-secondary" onClick={() => selecionarCliente(cliente)}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={modalPesquisaProduto}>
                    <ModalHeader>
                        Procurar produtos
                        <button className="btn btn-danger btn-fechar" onClick={() => abrirFecharModalPesquisaProduto()}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <div className="filtro">
                                <label>Nome</label>
                                <input type="text" name="nome_produto" className="form-control" onChange={handleChangeProdutoPesquisa}  />
                                <button className="btn btn-secondary" onClick={() => ObterProdutosNome()}>
                                    <FontAwesomeIcon icon={faSearch} />
                                    Buscar
                                </button>
                            </div>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Preço</th>
                                        <th>Escolher</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataProdutoFiltrado.map(produto => (
                                            <tr key={produto.iD_PRODUTO}>
                                                <td>{produto.iD_PRODUTO}</td>
                                                <td>{produto.nome}</td>
                                                <td>{Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(produto.preco)}</td>
                                                <td>
                                                    <button className="btn btn-secondary" onClick={() => selecionarProduto(produto)}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    )
}

export default Venda;