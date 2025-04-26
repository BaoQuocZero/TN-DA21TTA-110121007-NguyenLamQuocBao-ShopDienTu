const express = require("express");
const db = require("../db-context/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Lấy thông tin 1 user theo ID
async function getUserById(id) {
    try {
        const [rows] = await db.execute(
            `SELECT ID_USER, ID_ROLE, EMAIL, FIRSTNAME, LASTNAME, PHONENUMBER, CODEADDRESS, ADDRESS, CREATEAT, UPDATEAT 
             FROM USER 
             WHERE ID_USER = ? AND ISDELETE = false`,
            [id]
        );

        if (rows.length === 0) {
            return null; // Không tìm thấy user
        }

        return rows[0]; // Trả về user đầu tiên
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
}

// Lấy danh sách tất cả user chưa bị xóa
async function getAllUsers() {
    try {
        const [rows] = await db.execute(
            `SELECT ID_USER, ID_ROLE, EMAIL, FIRSTNAME, LASTNAME, PHONENUMBER, CODEADDRESS, ADDRESS, CREATEAT, UPDATEAT 
             FROM USER 
             WHERE ISDELETE = false`
        );

        return rows;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
}

async function createUser(user) {
    const {
        ID_ROLE,
        EMAIL,
        FIRSTNAME,
        LASTNAME,
        PHONENUMBER,
        CODEADDRESS,
        ADDRESS,
        PASSWORD,
        CREATEAT,
        UPDATEAT,
        ISDELETE,
    } = user;

    try {
        // Hash the password
        const passwordHash = await bcrypt.hash(PASSWORD, 10);

        // Thực hiện insert user vào database
        const [result] = await db.execute(
            `INSERT INTO USERS 
            (ID_ROLE, EMAIL, FIRSTNAME, LASTNAME, PHONENUMBER, CODEADDRESS, ADDRESS, PASSWORD, CREATEAT, UPDATEAT, ISDELETE)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                ID_ROLE,
                EMAIL,
                FIRSTNAME,
                LASTNAME,
                PHONENUMBER,
                CODEADDRESS,
                ADDRESS,
                passwordHash,
                CREATEAT,
                UPDATEAT,
                ISDELETE
            ]
        );

        // Sau khi thêm thành công, trả về user ID mới
        const newUser = {
            ID_USER: result.insertId,
            ID_ROLE,
            EMAIL,
            FIRSTNAME,
            LASTNAME,
            PHONENUMBER,
            CODEADDRESS,
            ADDRESS,
            CREATEAT,
            UPDATEAT,
            ISDELETE
        };

        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error; // Cho controller phía trên bắt lỗi
    }
}

// Cập nhật thông tin user
async function updateUser(id, updateData) {
    try {
        const fields = [];
        const values = [];

        if (updateData.ID_ROLE !== undefined) {
            fields.push('ID_ROLE = ?');
            values.push(updateData.ID_ROLE);
        }
        if (updateData.EMAIL !== undefined) {
            fields.push('EMAIL = ?');
            values.push(updateData.EMAIL);
        }
        if (updateData.FIRSTNAME !== undefined) {
            fields.push('FIRSTNAME = ?');
            values.push(updateData.FIRSTNAME);
        }
        if (updateData.LASTNAME !== undefined) {
            fields.push('LASTNAME = ?');
            values.push(updateData.LASTNAME);
        }
        if (updateData.PHONENUMBER !== undefined) {
            fields.push('PHONENUMBER = ?');
            values.push(updateData.PHONENUMBER);
        }
        if (updateData.CODEADDRESS !== undefined) {
            fields.push('CODEADDRESS = ?');
            values.push(updateData.CODEADDRESS);
        }
        if (updateData.ADDRESS !== undefined) {
            fields.push('ADDRESS = ?');
            values.push(updateData.ADDRESS);
        }
        if (updateData.PASSWORD !== undefined) {
            const hashedPassword = await bcrypt.hash(updateData.PASSWORD, 10);
            fields.push('PASSWORD = ?');
            values.push(hashedPassword);
        }

        // Cập nhật ngày cập nhật
        fields.push('UPDATEAT = ?');
        values.push(new Date());

        values.push(id); // Thêm id vào cuối để binding vào WHERE

        const sql = `UPDATE USER SET ${fields.join(', ')} WHERE ID_USER = ? AND ISDELETE = false`;

        const [result] = await db.execute(sql, values);

        return result;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

// Xóa mềm user (set ISDELETE = true)
async function deleteUser(id) {
    try {
        const [result] = await db.execute(
            `UPDATE USER SET ISDELETE = true, UPDATEAT = ? WHERE ID_USER = ?`,
            [new Date(), id]
        );

        return result;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

module.exports = {
    getUserById,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};