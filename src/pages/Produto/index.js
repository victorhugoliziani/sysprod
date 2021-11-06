import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Header from '../../components/Header';
import "./style.css";

function Produto() {

    const baseURL = process.env.REACT_APP_BASE_URL+"produto"
    const baseURL2 = process.env.REACT_APP_BASE_URL+"categoria"
    const baseURLCor = process.env.REACT_APP_BASE_URL+"cor"
    const baseURLTamanho = process.env.REACT_APP_BASE_URL+"tamanho"

    const [data, setData] = useState([]);
    const [dataCategoria, setDataCategoria] = useState([]);
    const [dataCor, setDataCor] = useState([]);
    const [dataTamanho, setDataTamanho] = useState([]);
    const [updateData, setUpdateData] = useState(true);
    const [modalIncluir, setModalIncluir] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalExcluir, setModalExcluir] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState({
        id: '',
        nome: '',
        descricao: '',
        preco : '',
        estoque: '',
        iD_CATEGORIA: '',
        iD_TAMANHO: '',
        iD_COR: '',
        inserE_HISTORICO_ESTOQUE: true
    })

    const abriFecharModalIncluir = () => {
        setModalIncluir(!modalIncluir);
    }

    const abrirFecharModalEditar = () => {
        setModalEditar(!modalEditar);
    }

    const abrirFecharModalExcluir = () => {
        setModalExcluir(!modalExcluir);
    }

    const handleChange = e => {
        const {name, value} = e.target;
        setProdutoSelecionado({
            ...produtoSelecionado,
            [name] : value
        });
    }

    const selecionarProduto = (produto, opcao) => {
        setProdutoSelecionado(produto);
        (opcao === "Editar") ? abrirFecharModalEditar() : abrirFecharModalExcluir();
            
    }

    const obterProdutos = async() => {
        axios.get(baseURL)
        .then(response => {
            setData(response.data);
        }).catch(error => {
            console.error(error);
        });

    }

    const obterCategorias = async() => {
        axios.get(baseURL2)
        .then(response => {
            setDataCategoria(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const obterCores = async() => {
        axios.get(baseURLCor)
        .then(response => {
            setDataCor(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const obterTamanhos = async() => {
        axios.get(baseURLTamanho)
        .then(response => {
            setDataTamanho(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const incluirProduto = async() => {
        delete produtoSelecionado.id;
        axios.post(baseURL, produtoSelecionado)
        .then(response => {
            setData(data.concat(response.data));
            abriFecharModalIncluir();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        })
    }

    const atualizarProduto = async() => {

        let estoqueModificado = false;

        data.filter(produto => {
            if(produto.iD_PRODUTO === produtoSelecionado.iD_PRODUTO) {
                if(produto.estoque != produtoSelecionado.estoque) {
                    estoqueModificado = true;
                }
            }
        });

        axios.put(baseURL+"/"+produtoSelecionado.iD_PRODUTO, produtoSelecionado)
        .then(response => {
            var resposta = response.data;
            var dadosAuxilizar = data;
            dadosAuxilizar.map(produto => {
                if(produto.iD_CATEGORIA === produtoSelecionado.iD_PRODUTO) {
                    produto.nome = resposta.nome;
                    produto.descricao = resposta.descricao;
                    produto.preco = resposta.preco;
                    produto.estoque = resposta.estoque;
                    produto.iD_CATEGORIA = resposta.iD_CATEGORIA;
                    produto.iD_TAMANHO = resposta.iD_TAMANHO;
                    produto.iD_COR = resposta.iD_COR;
                    produto.inserE_HISTORICO_ESTOQUE = estoqueModificado;
                }
            });
            abrirFecharModalEditar();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });
    }

    const excluirProduto = async() => {
        axios.delete(baseURL+"/"+produtoSelecionado.iD_PRODUTO)
        .then(response => {
            setData(data.filter(produto => produto.iD_PRODUTO !== response.data));
            abrirFecharModalExcluir();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        if(updateData) {
            obterProdutos();
            obterCategorias();
            obterCores();
            obterTamanhos();
            setUpdateData(false);
        }
    }, [updateData]);

    return (
        <div class="container">
            <Header />
            <div className="page-produto">
                <h3>
                    <FontAwesomeIcon icon={faTags} />
                    Cadastro de produto
                </h3>
                <header>
                    <button className="btn btn-success btn-incluir" onClick={() => abriFecharModalIncluir()}>
                        <FontAwesomeIcon icon={faPlus} /> {" "}
                        Incluir novo produto
                    </button>
                </header>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Cor</th>
                            <th>Tamanho</th>
                            <th>Preço</th>
                            <th>Estoque</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(produto => (
                                <tr key={produto.iD_PRODUTO}>
                                    <td>{produto.iD_PRODUTO}</td>
                                    <td>{produto.nome}</td>
                                    <td>{produto.nomE_CATEGORIA}</td>
                                    <td>{produto.nomE_COR}</td>
                                    <td>{produto.nomE_TAMANHO}</td>
                                    <td>{produto.preco}</td>
                                    <td>{produto.estoque}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => selecionarProduto(produto, "Editar")}>Editar</button> {" "}
                                        <button className="btn btn-danger" onClick={() => selecionarProduto(produto, "Excluir")}>Excluir</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Modal isOpen={modalIncluir}>
                    <ModalHeader>Incluir novo produto</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label>Categoria</label><br/>
                            <select name="iD_CATEGORIA" className="form-control" onChange={handleChange}>
                                <option value="">Selecione uma opção</option>
                                {
                                    dataCategoria.map(categoria => (
                                        <option value={categoria.id}>{categoria.nome}</option>
                                    ))
                                }    
                            </select><br/>
                            <label>Nome: </label><br/>
                            <input type="text" name="nome" className="form-control" onChange={handleChange} /><br/>
                            <label>Descrição</label><br/>
                            <textarea name="descricao" className="form-control" onChange={handleChange} /><br/>
                            <label>Preço</label><br/>
                            <input type="text" name="preco" className="form-control" onChange={handleChange} /><br/>
                            <label>Cor</label><br/>
                            <select name="iD_COR" className="form-control" onChange={handleChange}>
                                <option>Selecione uma opção</option>
                                {
                                    dataCor.map(cor => (
                                        <option value={cor.iD_COR}>{cor.nome}</option>
                                    ))
                                }
                            </select><br/>
                            <label>Tamanho</label><br/>
                            <select name="iD_TAMANHO" className="form-control" onChange={handleChange}>
                                <option>Selecione uma opção</option>
                                {
                                    dataTamanho.map(tamanho => (
                                        <option value={tamanho.iD_TAMANHO}>{tamanho.nome}</option>
                                    ))
                                }
                            </select><br/>
                            <label>Estoque</label><br/>
                            <input type="text" name="estoque" className="form-control" onChange={handleChange} /><br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={() => incluirProduto()}>Incluir</button> {" "}
                        <button className="btn btn-danger" onClick={() => abriFecharModalIncluir()}>Fechar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalEditar}>
                    <ModalHeader>Editar produto</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label>ID</label><br/>
                            <input type="text" className="form-control" readOnly value={produtoSelecionado && produtoSelecionado.iD_PRODUTO} /><br/>
                            <label>Categoria</label><br/>
                            <select name="iD_CATEGORIA" className="form-control" onChange={handleChange} value={produtoSelecionado && produtoSelecionado.iD_CATEGORIA}>
                                <option value="">Selecione uma opção</option>
                                {
                                    dataCategoria.map(categoria => (
                                        <option value={categoria.id}>{categoria.nome}</option>
                                    ))
                                }    
                            </select><br/>
                            <label>Nome: </label><br/>
                            <input type="text" name="nome" className="form-control" onChange={handleChange} value={produtoSelecionado && produtoSelecionado.nome} /><br/>
                            <label>Descrição</label><br/>
                            <textarea name="descricao" className="form-control" onChange={handleChange} value={produtoSelecionado && produtoSelecionado.descricao} /><br/>
                            <label>Preço</label><br/>
                            <label>Cor</label><br/>
                            <select name="iD_COR" className="form-control" onChange={handleChange} value={produtoSelecionado && produtoSelecionado.iD_COR}>
                                <option>Selecione uma opção</option>
                                {
                                    dataCor.map(cor => (
                                        <option value={cor.iD_COR}>{cor.nome}</option>
                                    ))
                                }
                            </select><br/>
                            <label>Tamanho</label><br/>
                            <select name="iD_TAMANHO" className="form-control" onChange={handleChange} value={produtoSelecionado && produtoSelecionado.iD_TAMANHO}>
                                <option>Selecione uma opção</option>
                                {
                                    dataTamanho.map(tamanho => (
                                        <option value={tamanho.iD_TAMANHO}>{tamanho.nome}</option>
                                    ))
                                }
                            </select><br/>
                            <input type="text" name="preco" className="form-control" onChange={handleChange} value={produtoSelecionado && produtoSelecionado.preco} /><br/>
                            <label>Estoque</label><br/>
                            <input type="text" name="estoque" className="form-control" onChange={handleChange} value={produtoSelecionado && produtoSelecionado.estoque}/><br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={() => atualizarProduto()}>Editar</button> {" "}
                        <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()}>Fechar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalExcluir}>
                    <ModalBody>
                        Tem certeza que deseja excluir o produto {produtoSelecionado && produtoSelecionado.nome}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => excluirProduto()}>Excluir</button> {" "}
                        <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}>Fechar</button>
                    </ModalFooter>
                </Modal>

            </div>
        </div>
    )
}

export default Produto