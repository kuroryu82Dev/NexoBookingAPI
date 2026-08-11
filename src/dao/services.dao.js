import ServiceModel from '../models/service.model.js';

export class ServicesDao {
  constructor(model = ServiceModel) { this.model = model; }
  getAll(filters = {}) { return this.model.find(filters).lean(); }
  getById(id) { return this.model.findById(id).lean(); }
  create(data) { return this.model.create(data).then((document) => document.toObject()); }
  update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true, lean: true });
  }
  delete(id) { return this.model.findByIdAndDelete(id).lean(); }
}

export default ServicesDao;
