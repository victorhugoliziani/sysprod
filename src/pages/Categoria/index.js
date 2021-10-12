import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faProjectDiagram, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import Header from '../../components/Header';
import './style.css';


function Categoria() {

  const baseURL = process.env.REACT_APP_BASE_URL+"categoria"

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState({
    id: '',
    nome: '',
    descricao: ''
  })
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setCategoriaSelecionada({
      ...categoriaSelecionada,
      [name]: value
    });
  }

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  }

  const pedidoGet = async () => {
    await axios.get(baseURL)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPost = async () => {
    delete categoriaSelecionada.id;
    axios.post(baseURL, categoriaSelecionada)
      .then(response => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
        setUpdateData(true);
      }).catch(error => {
        console.log(error);
      })
  }

  const pedidoPut = async() => {
    await axios.put(baseURL+"/"+categoriaSelecionada.id, categoriaSelecionada)
    .then(response => {
      var resposta = response.data;
      var dadosAuxiliar = data;
      dadosAuxiliar.map(categoria => {
        if(categoria.id === categoriaSelecionada.id) {
          categoria.nome = resposta.nome;
          categoria.descricao = resposta.descricao;
        }
      });
      abrirFecharModalEditar();
      setUpdateData(true);
    }).catch(error => {
      console.error(error);
    });
  }

  const pedidoDelete = async() => {
    await axios.delete(baseURL+"/"+categoriaSelecionada.id)
    .then(response => {
      setData(data.filter(categoria => categoria.id !== response.data));
      abrirFecharModalExcluir();
      setUpdateData(true);
    }).catch(error => {
      console.error(error);
    });
  }

  const selecionarCategoria = (categoria, opcao) => {
    setCategoriaSelecionada(categoria);
    (opcao === "Editar") ? abrirFecharModalEditar() : abrirFecharModalExcluir();
  }

  useEffect(() => {
    if(updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData])

  return (
    <div className="container">
      <Header />
      <div className="page-categoria">
        <h3><FontAwesomeIcon icon={faProjectDiagram} /> Cadastro de Categorias</h3>
        <header>
          <button className="btn btn-success btn-incluir" onClick={() => abrirFecharModalIncluir()}>
            <FontAwesomeIcon icon={faPlus} /> {" "}
              Incluir nova categoria
          </button>
        </header>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map(categoria => (
                <tr key="categoria.id">
                  <td>{categoria.id}</td>
                  <td>{categoria.nome}</td>
                  <td>{categoria.descricao}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => selecionarCategoria(categoria, "Editar")}>
                      <FontAwesomeIcon icon={faEdit} /> {" "}
                      Editar
                    </button> {" "}
                    <button className="btn btn-danger" onClick={() => selecionarCategoria(categoria, "Excluir")}>
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
          <ModalHeader>Incluir nova categoria</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Nome:</label><br />
              <input type="text" className="form-control" name="nome" onChange={handleChange} /><br />
              <label>Descrição:</label><br />
              <input type="text" className="form-control" name="descricao" onChange={handleChange} /><br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={() => pedidoPost()}>Incluir</button>{" "}
            <button className="btn btn-danger" onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalEditar}>
          <ModalHeader>Editar categoria</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>ID: </label><br />
              <input type="text" className="form-control" readOnly value={categoriaSelecionada && categoriaSelecionada.id} /><br/>
              <label>Nome:</label><br />
              <input type="text" className="form-control" name="nome" value={categoriaSelecionada && categoriaSelecionada.nome} onChange={handleChange} /><br />
              <label>Descrição:</label><br />
              <input type="text" className="form-control" name="descricao" value={categoriaSelecionada && categoriaSelecionada.descricao} onChange={handleChange} /><br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={() => pedidoPut()}>Editar</button>{" "}
            <button className="btn btn-danger" onClick={() => abrirFecharModalEditar()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalExcluir}>
          <ModalBody>
            Confirma a exclusão da categoria: {categoriaSelecionada && categoriaSelecionada.nome} ?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => pedidoDelete()}>Sim</button>{" "}
            <button className="btn btn-secondary" onClick={() => abrirFecharModalExcluir()}>Não</button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default Categoria;