import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Header from '../../components/Header';
import "./style.css";

function Cor() {

    const baseURL = process.env.REACT_APP_BASE_URL+"cor"

    const [data, setData] = useState([]);
    const [updateData, setUpdateData] = useState(true);
    const [corSelecionada, setCorSelecionada] = useState({
        iD_COR: '',
        nome: ''
    })

    const [modalIncluir, setModalIncluir] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalExcluir, setModalExcluir] = useState(false);


    const abriFecharModalIncluir = () => {
        setModalIncluir(!modalIncluir);
    }

    const abriFecharModalEditar = () => {
        setModalEditar(!modalEditar);
    }

    const abriFecharModalExcluir = () => {
        setModalExcluir(!modalExcluir);
    }

    const selecionaCor = (cor, opcao) => {
        setCorSelecionada(cor);
        (opcao === "Editar") ? abriFecharModalEditar() : abriFecharModalExcluir();
    }

    const handleChange = e => {
        const {name, value} = e.target;
        setCorSelecionada({...corSelecionada, [name] : value});
    }

    const obterCores = async() => {
        axios.get(baseURL)
        .then(response => {
            setData(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    const inserirCor = async() => {
        delete corSelecionada.id_cor;
        axios.post(baseURL, corSelecionada)
        .then(response => {
            setData(data.concat(response.data));
            abriFecharModalIncluir();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });

    }

    const atualizarCor = async() => {
        axios.put(baseURL+"/"+corSelecionada.iD_COR, corSelecionada)
        .then(response => {
            var resposta = response.data;
            var dadosAuxilizar = data;
            dadosAuxilizar.map(cor => {
                if(cor.iD_COR === corSelecionada.iD_COR) {
                    cor.iD_COR = resposta.iD_COR;
                    cor.nome = resposta.nome;
                }
            });
            abriFecharModalEditar();
            setUpdateData(true);

        }).catch(error => {
            console.log(error);
        });
    }

    const excluirCor = async() => {
        axios.delete(baseURL+"/"+corSelecionada.iD_COR)
        .then(response => {
            setData(data.filter(cor => cor.iD_COR !== response.data));
            abriFecharModalExcluir();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        if(updateData) {
            obterCores();
            setUpdateData(false);
        }
    }, [updateData]);

    return (
        <div className="container">
            <Header />
            <div className="page-cor">
                <h3>
                    <FontAwesomeIcon icon={faTags} />
                    Cadastro de cores
                </h3>
                <header>
                    <button className="btn btn-success btn-incluir" onClick={() => abriFecharModalIncluir()}>
                        <FontAwesomeIcon icon={faPlus} /> {" "}
                        Incluir nova cor
                    </button>
                </header>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(cor => (
                                <tr key={cor.iD_COR}>
                                    <td>{cor.iD_COR}</td>
                                    <td>{cor.nome}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => selecionaCor(cor, "Editar")}>
                                            <FontAwesomeIcon icon={faEdit} /> {" "}
                                            Editar
                                        </button>{" "}
                                        <button className="btn btn-danger" onClick={() => selecionaCor(cor, "Excluir")}>
                                            <FontAwesomeIcon icon={faTrash} /> {" "}
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Modal isOpen={modalIncluir}>
                    <ModalHeader>Incluir nova cor</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label>Nome</label><br/>
                            <input type="text" name="nome" className="form-control" onChange={handleChange} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={() => inserirCor()}>Incluir</button> {" "}
                        <button className="btn btn-danger" onClick={() => abriFecharModalIncluir()}>Fechar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalEditar}>
                    <ModalHeader>Editar cor</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label>ID</label><br/>
                            <input type="text" name="iD_COR" className="form-control" readOnly onChange={handleChange} value={corSelecionada && corSelecionada.iD_COR} /><br/>
                            <label>Nome</label><br/>
                            <input type="text" name="nome" className="form-control" onChange={handleChange} value={corSelecionada && corSelecionada.nome} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={() => atualizarCor()}>Editar</button> {" "}
                        <button className="btn btn-danger" onClick={() => abriFecharModalEditar()}>Fechar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalExcluir}>
                    <ModalBody>
                        Tem certeza que deseja excluir a cor {corSelecionada && corSelecionada.nome}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => excluirCor()}>Sim</button> {" "}
                        <button className="btn btn-secondary" onClick={() => abriFecharModalExcluir()}>Não</button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    )
}

export default Cor;