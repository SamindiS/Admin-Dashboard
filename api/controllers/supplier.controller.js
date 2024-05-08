import Supplier from "../models/supplier.model.js";
import { errorHandler } from "../utils/error.js";
export const createsupplier = async(req, res, next) => {

    if (!req.user.isAdmin) {
        return next(
            errorHandler(403, "You are not allowed to create an supplier!")
        );
    }

    if (!req.body.secreteKey ||
        !req.body.category ||
        !req.body.registerNumber ||
        !req.body.username ||
        !req.body.email ||
        !req.body.phoneNumber ||
        !req.body.image
    ) {
        return next(errorHandler(400, "All fields are required!"));
    }

    const newSupplier = new Supplier({
        secreteKey: req.body.secreteKey,
        category: req.body.category,
        registerNumber: req.body.registerNumber,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        image: req.body.image,
    });
    try {
        const savedSupplier = await newSupplier.save();
        res.status(200).json(savedSupplier);
    } catch (error) {
        next(error);
    }

};

export const getsuppliers = async(req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const suppliers = await Supplier.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalSuppliers = await Supplier.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthSuppliers = await Supplier.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            suppliers,
            totalSuppliers,
            lastMonthSuppliers,
        });
    } catch (error) {
        next(error);
    }
};

export const deletesupplier = async(req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(401, "You can delete only your account!"));
    }
    try {
        await Supplier.findByIdAndDelete(req.params.supplierId);
        res.status(200).json("Supplier has been deleted!");
    } catch (error) {
        next(error);
    }
};

export const updatesupplier = async(req, res, next) => {
    if (!res.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(401, "You can update only your account!"));
    }
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.supplierId, {
                $set: {
                    secreteKey: req.body.secreteKey,
                    category: req.body.category,
                    registerNumber: req.body.registerNumber,
                    username: req.body.username,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    image: req.body.image,
                }
            }, { new: true });
        res.status(200).json(updatedSupplier);
    } catch (error) {
        next(error);
    }
};