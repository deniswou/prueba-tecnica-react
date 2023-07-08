import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Form, Button, Card, Modal, Pagination, Row, Col } from 'react-bootstrap';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filtro, setFiltro] = useState('all');
  const [editTodo, setEditTodo] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage] = useState(10);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    const listado = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        setTodos(response.data);
      } catch (error) {
        toast.error('Error al obtener el listado', { position: toast.POSITION.TOP_CENTER, autoClose: 5000 });
        return;
      }
    };
    listado();
  }, []);

  /* Manejador de Estados */
  const handleEstado = (todoId, newEstado) => {
    const updateTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: newEstado } : todo
    );
    setTodos(updateTodos);
  };

  /* Manejador de Filtros */
  const handleFiltro = (event) => {
    setFiltro(event.target.value);
    setCurrentPage(1);
  };

  /* Manejador de Edición de Title */
  const handleEdit = (todo) => {
    setEditTodo(todo);
    setNewTitle(todo.title);
    setShowModal(false);
    setShowEditModal(true);
  };

  /* Manejador de Cancelación Edición de Title */
  const handleCancelEdit = () => {
    setEditTodo(null);
    setNewTitle('');
    setShowEditModal(false);
  };

  /* Cierra visualización del dialogo */
  const handleModalClose = () => {
    setShowModal(false);
  };

  /* Manejador Eliminar Todo */
  const handleEliminar = (todo) => {
    if (todos.length === 0) {
      toast.error('Error en el servicio. Por favor, intenta nuevamente más tarde.', {
        position: toast.POSITION.TOP_CENTER, autoClose: 5000,
      });
      return;
    }
    const todoToDelete = todos.find((todoItem) => todoItem.id === todo.id);
    if (!todoToDelete) {
      toast.info('Este registro ya ha sido eliminado.', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
      return;
    }
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    toast.success('Registro eliminado', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
  };

  /* Manejador Agregar Todo */
  const handleAgregar = () => {
    if (todos.length === 0) {
      toast.error('Error en el servicio. Por favor, intenta nuevamente más tarde.', {
        position: toast.POSITION.TOP_CENTER, autoClose: 5000,
      });
      return;
    }

    if (newTodoTitle.trim() === '') {
      toast.warning('El título está vacío', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
      return;
    }

    if (/\d/.test(newTodoTitle)) {
      toast.warning('El título contiene caracteres numéricos', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
      return;
    }

    const newTodo = {
      id: todos.length + 1,
      title: newTodoTitle,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    toast.success('Agregado exitosamente', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
    setNewTodoTitle('');
    setShowModal(false);
  };

  /* Manejador Guardar Edición */
  const handleGuardar = () => {
    if (todos.length === 0) {
      toast.error('Error en el servicio. Por favor, intenta nuevamente más tarde.', {
        position: toast.POSITION.TOP_CENTER, autoClose: 5000,
      });
      return;
    }

    if (newTitle.trim() === '') {
      toast.warning('El título está vacío', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
      return;
    }

    if (/\d/.test(newTitle)) {
      toast.warning('El título contiene caracteres numéricos', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
      return;
    }

    const updatedTodo = {
      ...editTodo,
      title: newTitle,
    };

    const updateTodos = todos.map((todo) => (todo.id === editTodo.id ? updatedTodo : todo));

    setTodos(updateTodos);
    toast.success('Registro actualizado', { position: toast.POSITION.TOP_CENTER, autoClose: 3000 });
    setShowEditModal(false);
  };

  /* Filtro */
  const getFiltroTodos = () => {
    let filteredTodos = todos;

    if (filtro === 'completed') {
      filteredTodos = filteredTodos.filter((todo) => todo.completed);
    } else if (filtro === 'incomplete') {
      filteredTodos = filteredTodos.filter((todo) => !todo.completed);
    }
    return filteredTodos;
  };

  /* Paginado del listado */
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = getFiltroTodos().slice(indexOfFirstTodo, indexOfLastTodo);
  const totalPages = Math.ceil(getFiltroTodos().length / todosPerPage);

  return (
    <div className="container">
      <h2>Listado de TODOS</h2>
      {/* Data table */}
      <div className="mt-1">
        <Card className="card">
          <Card.Body>
            <Row className="w-100 glassmorphism-row">
              <Col xs={12} sm={6} md={4} lg={5} className="d-flex align-items-center justify-content-end">
                <Form.Group controlId="filterState" className="mb-0">
                  <Form.Label className="glassmorphism-label">Filtrar Estado:</Form.Label>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} lg={5}>
                <Form.Group controlId="filterState" className="mb-0 d-flex justify-content-end">
                  <Form.Control as="select" value={filtro} onChange={handleFiltro} className="glassmorphism-select">
                    <option value="all">Todos</option>
                    <option value="completed">Completado</option>
                    <option value="incomplete">Pendiente</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={4} lg={2} className="mb-0 d-flex justify-content-end">
                <Button variant="primary" onClick={() => setShowModal(true)} className="glassmorphism-button">
                  Añadir Todo
                </Button>
              </Col>
            </Row>
            <Table responsive striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentTodos.map((todo) => (
                  <tr key={todo.id} className={!todo.completed ? 'table-warning' : ''}>
                    <td>{todo.id}</td>
                    <td>{todo.title}</td>
                    <td>
                      {todo.completed ? (
                        <Form.Switch
                          id={`switch-${todo.id}`}
                          checked={todo.completed}
                          onChange={(e) => handleEstado(todo.id, e.target.checked)}
                          label={todo.completed ? 'Completado' : 'Pendiente'}
                        />
                      ) : (
                        <Form.Switch
                          id={`switch-${todo.id}`}
                          checked={todo.completed}
                          onChange={(e) => handleEstado(todo.id, e.target.checked)}
                          label={todo.completed ? 'Completado' : 'Pendiente'}
                        />
                      )}</td>
                    <td className="d-flex align-items-center">
                      <Button variant="link" size="sm" onClick={() => handleEdit(todo)} title="Editar Todo">
                        <BsPencil style={{ color: 'green' }} />
                      </Button>
                      <Button variant="link" size="sm" onClick={() => handleEliminar(todo)} title="Eliminar Todo">
                        <BsTrash style={{ color: 'red' }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>
      {/* Paginado */}
      <div className="d-flex justify-content-center mt-1">
        <Pagination >
          <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </Pagination>
      </div>

      {/* Diálogo Editar Registro */}
      <Modal show={showEditModal} onHide={handleCancelEdit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Ingresar nuevo título:</Form.Label>
            <Form.Control type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleCancelEdit}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Diálogo Añadir Registro */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Ingresar título:</Form.Label>
            <Form.Control
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={handleModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAgregar}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default TodoList;