const pool = require("../../config/database");


const getPromotion = async (req, res) => {
    try {
        const [results] = await pool.execute(`
        SELECT * FROM promotion
    `);
        return res.status(200).json({
            EM: "Xem thông tin nhãn hiệu thành công",
            EC: 1,
            DT: results,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            EM: "Xem thông tin nhãn hiệu thất bại",
            EC: -1,
            DT: [],
        });
    }
};

module.exports = {
    getPromotion,
};
