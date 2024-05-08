import Employee from "../models/employee.model.js";
import { errorHandler } from "../utils/error.js";


export const create = async(req, res, next) => {
    if (!req.user.isAdmin) {
        return next(
            errorHandler(403, "You are not allowed to create an employee!")
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

    const newEmployee = new Employee({
        secreteKey: req.body.secreteKey,
        category: req.body.category,
        registerNumber: req.body.registerNumber,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        image: req.body.image,
    });

    try {
        const savedEmployee = await newEmployee.save();
        res.status(200).json(savedEmployee);
    } catch (error) {
        next(error);
    }
};
export const getemployees = async(req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const employees = await Employee.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalEmployees = await Employee.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthEmployees = await Employee.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            employees,
            totalEmployees,
            lastMonthEmployees,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteemployee = async(req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(401, "You can delete only your account!"));
    }
    try {
        await Employee.findByIdAndDelete(req.params.employeeId);
        res.status(200).json("Employee has been deleted!");
    } catch (error) {
        next(error);
    }
};

export const updateemployee = async(req, res, next) => {
    if (!res.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(401, "You can update only your account!"));
    }
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.employeeId, {
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
        res.status(200).json(updatedEmployee);
    } catch (error) {
        next(error);
    }
};