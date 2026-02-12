import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();


const axios = {
    get: async (...args) => {
        try {
            const response = await axios2.get(...args);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    post: async (...args) => {
        try {
            const response = await axios2.post(...args);
            console.log(response)
            return response;
        } catch (error) {
            return error.response;
        }
    },

    patch: async (...args) => {
        try {
            const response = await axios2.patch(...args);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    delete: async (...args) => {
        try {
            const response = await axios2.delete(...args);
            return response;
        } catch (error) {
            return error.response;
        }
    },

    put: async (...args) => {
        try {
            const response = await axios2.put(...args);
            return response;
        } catch (error) {
            return error.response;
        }
    }
}

const URL = process.env.VITE_BASE_URL;

describe.skip('get otp',  () => {

    const phoneNumber = '7847811867';
    const wrongPhoneNumber = '78477s8698';

    test('if phoneNumber is incorrect', async() => {
        const response = await axios.post(`${URL}/auth/otp/send-otp`, {
            "content": {phoneNumber: wrongPhoneNumber}        
        });

        expect(response.status).toBe(400);
        expect(response.data.message).toBe("Phonenumber is not correct. Please ensure it is correct.");
    });

    
    test('successfully send an otp', async () => {
        const response = await axios.post(`${URL}/auth/otp/send-otp`, {
            "content": {phoneNumber}
        });

        expect(response.status).toBe(200);
        expect(response.data.data).toHaveProperty('redirectURL');
    });

    test("if there is already an otp exist for this number", async () => {
      const response = await axios.post(`${URL}/auth/otp/send-otp`, {
        content: { phoneNumber },
      });

      expect(response.status).toBe(401);
      expect(response.data.data).toHaveProperty("redirectURL");
    });
})


describe('re-send otp', () => {

    const phoneNumber = '7847811867';
    const payload = {
        "content": {
            phoneNumber
        }
    }
    const wrongAuthHeader = 'dikwajsef0df9er9ekrwe9rrf9RKWE9DFeki3KJ9fk';


    test('if there is no authorization header, it should return an error', async () => {
        const response1 = await axios.get(`${URL}/auth/otp/re-send`);

        expect(response1.status).toBe(401);
        expect(response1.data.message).toBe('Invalid token.');
    })

    test('if there is authorization header with no bearer, also throw an error.', async () => {
        const response2 = await axios.get(`${URL}/auth/otp/re-send`, {
            headers: {
                'Authorization': wrongAuthHeader
            }
        });

        expect(response2.status).toBe(401);
        expect(response2.data.message).toBe('Invalid token.');
    })

    // test('if there is no phoneNumber or not a valid phoneNumber, then return an error', async ()=> {
    //     const response3 = await axios.get(`${URL}/auth/otp/re-send`, {
    //         headers: {
    //             'Authorization': `Bearer ${wrongAuthHeader}`
    //         }
    //     });

    //     expect(response3.status).toBe(401);
    //     expect(response3.data.message).toBe('Unauthorized.');
    // })

    // test('if there no otp record in db', async ()=> {
        

    //     const response4 = await axios.get(`${URL}/auth/otp/re-send`, {
    //         headers: {
    //             'Authorization': `Bearer ${correctToken}`
    //         }
    //     });

    //     expect(response4.status).toBe(401);
    //     expect(response4.data.message).toBe('Unauthorized');
    //     expect(response4.data.data).toHaveProperty('redirectURL');
    // })

    test('if there is record but user is trying to resend otp before the tiemout.', async ()=> {
        const response5 = await axios.post(`${URL}/auth/otp/send-otp`, {
            "content": {
                "phoneNumber": phoneNumber
            }
        });

        const response6 = await axios.get(`${URL}/auth/otp/re-send`, {
            headers: {
                'Authorization': `Bearer ${response5.data.data.token}`
            }
        });

        expect(response6.status).toBe(401);
    })
})