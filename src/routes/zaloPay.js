import axios from 'axios';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import express from 'express';
import bodyParser from 'body-parser';
import qs from 'qs';
import admin from 'firebase-admin';

const router = express();
const db = admin.firestore();

const config = {
    app_id: '2553',
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

router.use(bodyParser.json());

/**
 * methed: POST
 * Sandbox	POST	https://sb-openapi.zalopay.vn/v2/create
 * Real	POST	https://openapi.zalopay.vn/v2/create
 * description: tạo đơn hàng, thanh toán
 */
router.post('/create-payment', async (req, res) => {
    const embed_data = {
        //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
        redirecturl: 'http://localhost:3000/homepage',
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);
    const { userId } = req.body;
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: userId,
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: 100000,
        //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
        //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
        callback_url: 'https://4688-118-69-111-229.ngrok-free.app/api/v1/zalopay/callback',
        description: `VIP Membership - Payment for the order #${transID}`,
        bank_code: '',
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });

        return res.status(200).json(result.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error creating payment', details: error.result ? error.result.data : error });
    }
});

/**
 * method: POST
 * description: callback để Zalopay Server call đến khi thanh toán thành công.
 * Khi và chỉ khi ZaloPay đã thu tiền khách hàng thành công thì mới gọi API này để thông báo kết quả.
 */
router.post('/callback', async (req, res) => {
    let result = {};
    console.log(req.body);
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log('mac =', mac);

        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            // thanh toán thành công
            let dataJson = JSON.parse(dataStr, config.key2);
            console.log(
                "update order's status = success where app_trans_id =",
                dataJson['app_trans_id'],
            );

            // Thanh toán thành công -> Cập nhật trạng thái VIP cho user
            const userId = dataJson.app_user;
            const vipDurationInMonths = 1; // Thời gian VIP là 1 tháng (tùy chỉnh)

            const userRef = db.collection('users').doc(userId);
            const userSnapshot = await userRef.get();

            if (userSnapshot.exists) {
                const userData = userSnapshot.data();

                let currentVipExpiration = moment();

                // Cộng thêm thời gian VIP mới
                const newVipExpiration = currentVipExpiration.add(vipDurationInMonths, 'months').toDate();

                // Cập nhật trạng thái VIP và thời gian hết hạn mới
                await userRef.update({
                    isVip: true,
                    vipExpiration: admin.firestore.Timestamp.fromDate(new Date()), // Cập nhật ngày hiện tại làm ngày kích hoạt
                    vipExpiredAt: admin.firestore.Timestamp.fromDate(newVipExpiration), // Ngày hết hạn mới
                });

                console.log('User VIP status updated successfully for userId:', userId);
            } else {
                console.log('User not found in Firestore');
            }

            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        console.log('lỗi:::' + ex.message);
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
});

/**
 * method: POST
 * Sandbox	POST	https://sb-openapi.zalopay.vn/v2/query
 * Real	POST	https://openapi.zalopay.vn/v2/query
 * description:
 * Khi user thanh toán thành công,
 * ZaloPay sẽ gọi callback (notify) tới merchant để merchant cập nhật trạng thái
 * đơn hàng Thành Công trên hệ thống. Trong thực tế callback có thể bị miss do lỗi Network timeout,
 * Merchant Service Unavailable/Internal Error...
 * nên Merchant cần hiện thực việc chủ động gọi API truy vấn trạng thái đơn hàng.
 */

router.post('/check-status-order', async (req, res) => {
    const { app_trans_id } = req.body;

    let postData = {
        app_id: config.app_id,
        app_trans_id, // Input your app_trans_id
    };

    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
        method: 'post',
        url: 'https://sb-openapi.zalopay.vn/v2/query',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify(postData),
    };

    try {
        const result = await axios(postConfig);
        console.log(result.data);
        return res.status(200).json(result.data);
        /**
         * kết quả mẫu
          {
            "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
            "return_message": "",
            "sub_return_code": 1,
            "sub_return_message": "",
            "is_processing": false,
            "amount": 50000,
            "zp_trans_id": 240331000000175,
            "server_time": 1711857138483,
            "discount_amount": 0
          }
        */
    } catch (error) {
        console.log('lỗi');
        console.log(error);
    }
});
export default router;
