export class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll() {
    return this.dao.getAll();
  }
  getById(id) {
    return this.dao.getById(id);
  }
  getByIdRaw(id) {
    return this.dao.getByIdRaw(id);
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

export default BookingsRepository;
