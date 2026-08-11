export class ServicesRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll(filters) {
    return this.dao.getAll(filters);
  }
  getById(id) {
    return this.dao.getById(id);
  }
  create(data) {
    return this.dao.create(data);
  }
  update(id, data) {
    return this.dao.update(id, data);
  }
  delete(id) {
    return this.dao.delete(id);
  }
}

export default ServicesRepository;
