import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Header from '../../components/Header';
import "./style.css";

function Tamanho() {

    const baseURL = process.env.REACT_APP_BASE_URL+"tamanho"

    const [data, setData] = useState([]);
    const [modalIncluir, setModalIncluir] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalExcluir, setModalExcluir] = useState(false);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState({
        iD_TAMANHO: '',
        nome: ''
    });
    const [updateData, setUpdateData] = useState(true);

    const abriFecharModalIncluir = () => {
        setModalIncluir(!modalIncluir);
    }

    const abriFecharModalEditar = () => {
        setModalEditar(!modalEditar);
    }

    const abriFecharModalExcluir = () => {
        setModalExcluir(!modalExcluir);
    }

    const handleChange = e => {
        const {name, value} = e.target;
        setTamanhoSelecionado({...tamanhoSelecionado, [name] : value});
    }

    const selecionarTamanho = (tamanho, opcao) => {
        setTamanhoSelecionado(tamanho);
        (opcao === "Editar") ? abriFecharModalEditar() : abriFecharModalExcluir();
    }

    const obter = async() => {
        await axios.get(baseURL)
        .then(response => {
            setData(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const incluir = async() => {
        delete tamanhoSelecionado.iD_TAMANHO;
        await axios.post(baseURL, tamanhoSelecionado)
        .then(response => {
            setData(data.concat(response.data));
            abriFecharModalIncluir();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });
    }

    const atualizar = async() => {
        await axios.put(baseURL+"/"+tamanhoSelecionado.iD_TAMANHO, tamanhoSelecionado)
        .then(response => {
            var resposta = response.data;
            var dadosAuxiliar = data;
            dadosAuxiliar.map(tamanho => {
                if(tamanho.iD_TAMANHO === tamanhoSelecionado.iD_TAMANHO) {
                    tamanho.nome = resposta.nome;
                }
            });
            abriFecharModalEditar();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });
    }

    const excluir = async() => {
        await axios.delete(baseURL+"/"+tamanhoSelecionado.iD_TAMANHO)
        .then(response => {
            setData(data.filter(tamanho => tamanho.iD_TAMANHO !== response.data));
            abriFecharModalExcluir();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        obter();
        setUpdateData(false);
    }, [updateData]);

    return (
        <div className="container">
            <Header />
            <div className="page-tamanho">
                <h3>
                    <FontAwesomeIcon icon={faTags} />
                    Cadastro de tamanhos
                </h3>
                <header>
                    <button className="btn btn-success btn-incluir" onClick={() => abriFecharModalIncluir()}>
                        <FontAwesomeIcon icon={faPlus} /> {" "}
                        Incluir novo tamanho
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
                            data.map(tamanho => (
                                <tr key={tamanho.iD_TAMANHO}>
                                    <td>{tamanho.iD_TAMANHO}</td>
                                    <td>{tamanho.nome}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => selecionarTamanho(tamanho, "Editar")}>
                                            <FontAwesomeIcon icon={faEdit} /> {" "}
                                            Editar
                                        </button> {" "}
                                        <button className="btn btn-danger" onClick={() => selecionarTamanho(tamanho, "Excluir")}>
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
                    <ModalHeader>Incluir novo tamanho</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label>Nome</label><br/>
                            <input type="text" name="nome" className="form-control" onChange={handleChange} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={() => incluir()}>Incluir</button> {" "}
                        <button className="btn btn-danger" onClick={() => abriFecharModalIncluir()}>Fechar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalEditar}>
                    <ModalHeader>Editar tamanho</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label>ID</label><br/>
                            <input type="text" name="iD_TAMANHO" readOnly className="form-control" onChange={handleChange} value={tamanhoSelecionado && tamanhoSelecionado.iD_TAMANHO} /><br/>
                            <label>Nome</label><br/>
                            <input type="text" name="nome" className="form-control" onChange={handleChange} value={tamanhoSelecionado && tamanhoSelecionado.nome} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={() => atualizar()}>Editar</button> {" "}
                        <button className="btn btn-danger" onClick={() => abriFecharModalEditar()}>Fechar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalExcluir}>
                    <ModalBody>
                        Tem certeza que deseja excluir o tamanho {tamanhoSelecionado && tamanhoSelecionado.nome}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => excluir()}>Sim</button> {" "}
                        <button className="btn btn-secondary" onClick={() => abriFecharModalExcluir()}>Não</button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    )
}

export default Tamanho;