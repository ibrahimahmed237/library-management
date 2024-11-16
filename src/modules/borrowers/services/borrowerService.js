const Borrower = require("../models/Borrower.js");
const BorrowingHistory = require("../../borrowing/models/BorrowingHistory.js");
const BookModel = require("../../books/models/Book.js");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const appError = require("../../../shared/utils/appError.js");

class BorrowerService {
  async updateBorrower(id, updateData) {
    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }

    // If email is being updated, check for uniqueness
    if (updateData.email) {
      const existingBorrower = await Borrower.findOne({
        where: {
          email: updateData.email,
          id: { [Op.ne]: id },
        },
      });

      if (existingBorrower) {
        throw new appError("Email already in use", 400);
      }
    }

    const updated = await Borrower.update(updateData, {
      where: { id },
      returning: true,
    });

    if (!updated) {
      throw new appError("Borrower not found", 404);
    }

    // Fetch and return updated borrower (excluding password_hash)
    return await this.getBorrower(id);
  }

  async deleteBorrower(id) {
    // Check for active borrowings
    const activeBorrowings = await BorrowingHistory.findOne({
      where: {
        borrower_id: id,
        is_returned: false,
      },
    });

    if (activeBorrowings) {
      throw new appError("Cannot delete borrower with active borrowings", 400);
    }

    const deleted = await Borrower.destroy({
      where: { id },
    });

    if (!deleted) {
      throw new appError("Borrower not found", 404);
    }

    return deleted;
  }

  async getBorrower(id) {
    const borrower = await Borrower.findByPk(id, {
      attributes: {
        exclude: [
          "password_hash",
          "verification_token",
          "verification_token_expiry",
          "is_admin",
        ],
      },
    });

    if (!borrower) {
      throw new appError("Borrower not found", 404);
    }

    return borrower;
  }

  async listBorrowers({ page = 1, limit = 10, search = "" }) {
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const borrowers = await Borrower.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: [
          "password_hash",
          "verification_token",
          "verification_token_expiry",
        ],
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["registered_at", "DESC"]],
    });

    return {
      borrowers: borrowers.rows,
      total: borrowers.count,
      totalPages: Math.ceil(borrowers.count / limit),
      currentPage: parseInt(page),
    };
  }

  async getBorrowingHistory(borrowerId) {
    return await BorrowingHistory.findAll({
      where: { borrower_id: borrowerId },
      include: [
        {
          model: BookModel,
          attributes: ["title", "author", "ISBN"],
        }
      ],
      attributes: [
        "id", 
        "book_id", 
        "borrower_id", 
        "checkout_date", 
        "return_date", 
        "returned_date", 
        "is_returned"
      ],
      order: [["checkout_date", "DESC"]],
    });
  }

}

module.exports = new BorrowerService();
