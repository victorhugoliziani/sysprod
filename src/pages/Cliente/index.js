import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faProjectDiagram, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import Header from '../../components/Header';
import './style.css';

function Cliente() {

    const baseURL = process.env.REACT_APP_BASE_URL+"cliente"

    const [data, setData] = useState([]);
    const [updateData, setUpdateData] = useState(true);
    const [clienteSelecionado, setClienteSelecionado] = useState({
        iD_ENTIDADE : '',
        nome : '',
        cpf: '',
        sexo: '',
        datA_NASCIMENTO : '',
        bairro: '',
        rua: '',
        numero: '',
        cidade : '',
        cep: '',
        estado: '',
        email: '',
        celular: '',
        tamanho: ''
    })

    const [modalIncluir, setModalIncluir] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalExcluir, setModalExcluir] = useState(false);


    const abrirFecharModalIncluir = () => {
        setModalIncluir(!modalIncluir);
    }

    const abrirFecharModalEditar = () => {
        setModalEditar(!modalEditar);
    }

    const abrirFecharModalExcluir = () => {
        setModalExcluir(!modalExcluir);
    }

    const obter = async() => {
        await axios.get(baseURL)
        .then(response => {
            response.data.map(cliente => {
                var p = cliente.datA_NASCIMENTO.split(/\D/g)
                cliente.datA_NASCIMENTO = [p[2],p[1],p[0] ].join("/")
            })
            setData(response.data);
        }).catch(error => {
            console.log(error);
        });
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setClienteSelecionado({...clienteSelecionado, [name]: value});
    }

    const obterEnderecoCep = async() => {
        await axios.get("https://viacep.com.br/ws/"+clienteSelecionado.cep+"/json/")
        .then(response => {
            setClienteSelecionado({
                ...clienteSelecionado,
                bairro : response.data.bairro,
                rua : response.data.logradouro,
                cidade : response.data.localidade,
                estado : response.data.uf
            })
        }).catch(error => {
            console.log(error);
        });
    }

    const selecionarCliente = (cliente, opcao) => {
        setClienteSelecionado(cliente);
        (opcao === "Editar") ? abrirFecharModalEditar() : abrirFecharModalExcluir();
    }

    const incluir = async() => {
        delete clienteSelecionado.iD_ENTIDADE;
        let dia = clienteSelecionado.datA_NASCIMENTO.substring(0, 2);
        let mes = clienteSelecionado.datA_NASCIMENTO.substring(3, 5);
        let ano = clienteSelecionado.datA_NASCIMENTO.substring(6, 10);

        clienteSelecionado.datA_NASCIMENTO = ano+'-'+mes+'-'+dia;

        await axios.post(baseURL, clienteSelecionado)
        .then(response => {
            setData(data.concat(response.data));
            abrirFecharModalIncluir();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });

    }

    const editar = async() => {

        let dia = clienteSelecionado.datA_NASCIMENTO.substring(0, 2);
        let mes = clienteSelecionado.datA_NASCIMENTO.substring(3, 5);
        let ano = clienteSelecionado.datA_NASCIMENTO.substring(6, 10);

        clienteSelecionado.datA_NASCIMENTO = ano+'-'+mes+'-'+dia;

        console.log(clienteSelecionado)

        await axios.put(baseURL+"/"+clienteSelecionado.iD_ENTIDADE, clienteSelecionado)
        .then(response => {
            let resposta = response.data;
            let dadosAuxiliar = data;

            dadosAuxiliar.map(cliente => {
                if(cliente.iD_ENTIDADE === clienteSelecionado.iD_ENTIDADE) {
                    cliente.nome = resposta.nome;
                    cliente.cpf = resposta.cpf;
                    cliente.sexo = resposta.sexo;
                    cliente.datA_NASCIMENTO = resposta.datA_NASCIMENTO;
                    cliente.bairro = resposta.bairro;
                    cliente.rua = resposta.rua;
                    cliente.numero = resposta.numero;
                    cliente.cidade = resposta.cidade;
                    cliente.cep = resposta.cep;
                    cliente.estado = resposta.estado;
                    cliente.email = resposta.email;
                    cliente.celular = resposta.celular;
                    cliente.tamanho = resposta.tamanho;
                }
            });

            abrirFecharModalEditar();
            setUpdateData(true);
            
        }).catch(error => {
            console.log(error);
        });
    }

    const excluir = async() => {
        axios.delete(baseURL+"/"+clienteSelecionado.iD_ENTIDADE)
        .then(response => {
            setData(data.filter(cliente => cliente.iD_ENTIDADE !== response.data));
            abrirFecharModalExcluir();
            setUpdateData(true);
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        if(updateData) {
            obter();
            setUpdateData(false);
        }
    });

    return (
        <div className="container">
            <Header />
            <div className="page-cliente">
                <h3><FontAwesomeIcon icon={faProjectDiagram} /> Cadastro de Clientes</h3>
                <header>
                    <button className="btn btn-success btn-incluir" onClick={() => abrirFecharModalIncluir()}>
                        <FontAwesomeIcon icon={faPlus} /> {" "}
                        Incluir novo cliente
                    </button>
                </header>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Celular</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(cliente => (
                                <tr key={cliente.iD_ENTIDADE}>
                                    <td>{cliente.iD_ENTIDADE}</td>
                                    <td>{cliente.nome}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.celular}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => selecionarCliente(cliente, "Editar")}>
                                            <FontAwesomeIcon icon={faEdit} /> {" "}
                                            Editar
                                        </button> {" "}
                                        <button className="btn btn-danger" onClick={() => selecionarCliente(cliente, "Excluir")}>
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
                    <ModalHeader>Incluir novo cliente</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label>Nome</label><br/>
                            <input type="text" name="nome" className="form-control" onChange={handleChange} /><br/>
                            <label>CPF</label><br/>
                            <InputMask mask="999999999.99" name="cpf" className="form-control" onChange={handleChange} /><br/>
                            <label>Sexo</label><br/>
                            <select name="sexo" className="form-control" onChange={handleChange}>
                                <option value="">Selecione uma opção</option>
                                <option value="m">Masculino</option>
                                <option value="f">Feminino</option>
                            </select><br/>
                            <label>Data Nascimento</label><br/>
                            <InputMask mask="99/99/9999" name="datA_NASCIMENTO" className="form-control" onChange={handleChange} /><br/>
                            <label>Cep</label><br/>
                            <InputMask mask="99999-999" name="cep" className="form-control" onChange={handleChange} onBlur={() => obterEnderecoCep()} /><br/>
                            <label>Bairro</label><br/>
                            <input type="text" name="bairro" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.bairro}  /><br/>
                            <label>Rua</label><br/>
                            <input type="text" name="rua" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.rua} /><br/>
                            <label>Número</label><br/>
                            <input type="text" name="numero" className="form-control" onChange={handleChange} /><br/>
                            <label>Cidade</label><br/>
                            <input type="text" name="cidade" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.cidade} /><br/>
                            <label>Estado</label><br/>
                            <input type="text" name="estado" readOnly className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.estado} /><br/>
                            <label>Email</label><br/>
                            <input type="text" name="email" className="form-control" onChange={handleChange} /><br/>
                            <label>Celular</label><br/>
                            <InputMask mask="(99) 99999-9999" name="celular" className="form-control" onChange={handleChange} /><br/>
                            <label>Obs. Tamanho cliente</label><br/>
                            <input type="text" name="tamanho" className="form-control" onChange={handleChange} /><br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={() => incluir()}>Incluir</button> {" "}
                        <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()}>Fechar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalEditar}>
                    <ModalHeader>Editar cliente</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label>ID</label><br/>
                            <input type="text" readOnly name="iD_ENTIDADE" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.iD_ENTIDADE} />
                            <label>Nome</label><br/>
                            <input type="text" name="nome" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.nome} /><br/>
                            <label>CPF</label><br/>
                            <InputMask mask="999999999.99" name="cpf" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.cpf} /><br/>
                            <label>Sexo</label><br/>
                            <select name="sexo" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.sexo}>
                                <option value="">Selecione uma opção</option>
                                <option value="m">Masculino</option>
                                <option value="f">Feminino</option>
                            </select><br/>
                            <label>Data Nascimento</label><br/>
                            <InputMask mask="99/99/9999" name="datA_NASCIMENTO" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.datA_NASCIMENTO} /><br/>
                            <label>Cep</label><br/>
                            <InputMask mask="99999-999" name="cep" className="form-control" onChange={handleChange} onBlur={() => obterEnderecoCep()} value={clienteSelecionado && clienteSelecionado.cep} /><br/>
                            <label>Bairro</label><br/>
                            <input type="text" name="bairro" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.bairro}   /><br/>
                            <label>Rua</label><br/>
                            <input type="text" name="rua" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.rua} /><br/>
                            <label>Número</label><br/>
                            <input type="text" name="numero" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.numero} /><br/>
                            <label>Cidade</label><br/>
                            <input type="text" name="cidade" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.cidade} /><br/>
                            <label>Estado</label><br/>
                            <input type="text" name="estado" readOnly className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.estado} /><br/>
                            <label>Email</label><br/>
                            <input type="text" name="email" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.email} /><br/>
                            <label>Celular</label><br/>
                            <InputMask mask="(99) 99999-9999" name="celular" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.celular} /><br/>
                            <label>Obs. Tamanho cliente</label><br/>
                            <input type="text" name="tamanho" className="form-control" onChange={handleChange} value={clienteSelecionado && clienteSelecionado.tamanho} /><br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={() => editar()}>Editar</button> {" "}
                        <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()}>Fechar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalExcluir}>
                    <ModalBody>
                        Tem certeza que deseja excluir o cliente {clienteSelecionado && clienteSelecionado.nome}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => excluir()}>Sim</button> {" "}
                        <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}>Não</button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    )
}

export default Cliente;