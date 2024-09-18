import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoriesCrud = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const [editCategory, setEditCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openModal = (type, category = null) => {
    setModalType(type);
    if (type === 'edit' && category) {
      setEditCategory(category);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setNewCategory({ name: '', image: '' });
    setEditCategory(null);
    setShowModal(false);
  };


  const addCategory = async () => {
    if (newCategory.name === '' || newCategory.image === '') {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      const response = await axios.post('https://api.escuelajs.co/api/v1/categories', newCategory);
      setCategories([...categories, response.data]);
      Swal.fire('Éxito', 'Categoría agregada exitosamente', 'success');
      closeModal();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };


  const editCategorySubmit = async () => {
    if (editCategory.name === '' || editCategory.image === '') {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      await axios.put(`https://api.escuelajs.co/api/v1/categories/${editCategory.id}`, editCategory);
      fetchCategories();
      Swal.fire('Éxito', 'Categoría editada exitosamente', 'success');
      closeModal();
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };


  const deleteCategory = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://api.escuelajs.co/api/v1/categories/${id}`);
          fetchCategories();
          Swal.fire('Eliminado', 'La categoría ha sido eliminada', 'success');
        } catch (error) {
          console.error('Error deleting category:', error);
        }
      }
    });
  };

  return (
    <div className="container">
      <h1>CRUD de Categorías</h1>


      <button className="btn btn-primary mb-3" onClick={() => openModal('add')}>
        Agregar Categoría
      </button>


      <ul className="list-group mb-4">
        {categories.map((category) => (
          <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <img src={category.image} alt={category.name} style={{ width: '50px', marginRight: '10px' }} />
              {category.name}
            </div>
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => openModal('edit', category)}>
                Editar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(category.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>


      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalType === 'add' ? 'Agregar Categoría' : 'Editar Categoría'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  placeholder="Nombre de la categoría"
                  className="form-control mb-2"
                  value={modalType === 'edit' && editCategory ? editCategory.name : newCategory.name}
                  onChange={(e) =>
                    modalType === 'edit' && editCategory
                      ? setEditCategory({ ...editCategory, name: e.target.value })
                      : setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="URL de la imagen"
                  className="form-control mb-2"
                  value={modalType === 'edit' && editCategory ? editCategory.image : newCategory.image}
                  onChange={(e) =>
                    modalType === 'edit' && editCategory
                      ? setEditCategory({ ...editCategory, image: e.target.value })
                      : setNewCategory({ ...newCategory, image: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={modalType === 'edit' ? editCategorySubmit : addCategory}
                >
                  {modalType === 'edit' ? 'Guardar Cambios' : 'Agregar Categoría'}
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesCrud;
