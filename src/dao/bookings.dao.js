import BookingModel from '../models/booking.model.js';

export class BookingsDao {
  constructor(model = BookingModel) {
    this.model = model;
  }
  getAll() {
    return this.model.find().lean();
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
}

export default BookingsDao;
