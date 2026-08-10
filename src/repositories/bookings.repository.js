export class BookingsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll() { return this.dao.getAll(); }
  getById(id) { return this.dao.getById(id); }
  create(data) { return this.dao.create(data); }
  update(id, data) { return this.dao.update(id, data); }
}

export default BookingsRepository;
