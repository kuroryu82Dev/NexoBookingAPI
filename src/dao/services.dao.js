import ServiceModel from '../models/service.model.js';

export class ServicesDao {
  constructor(model = ServiceModel) {
    this.model = model;
  }
  getAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc' } = options;
    return this.model
      .find(filters)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }
  count(filters = {}) {
    return this.model.countDocuments(filters);
  }
  getById(id) {
    return this.model.findById(id).lean();
  }
  create(data) {
    return this.model.create(data).then((document) => document.toObject());
  }
  update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true, lean: true });
  }
  delete(id) {
    return this.model.findByIdAndDelete(id).lean();
  }
}

export default ServicesDao;
