const express = require('express');
const AmoCRM = require('amocrm-js');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json())

console.log(process.env.PORT);
console.log(process.env.PUBLIC_URL);


const crm = new AmoCRM({
    domain: 'tunuke.amocrm.ru',
    auth: {
        client_id: 'de2939a1-3054-4ff0-afbc-67889c78912f',
        client_secret: 'JHznoSMGLD1gmrRlMb577uHX934U1HrXizIKy5TdJerXxZ7KXHzmGsgV6Fhs88Pp',
        redirect_uri: process.env.PUBLIC_URL || 'https://e861-46-251-214-117.eu.ngrok.io',
        // code: 'def502008900b8d36fb66f9a6f152641f2a8eff4861b5fe568e7ed354dd33673bef77f2db1000419b430dc832e2843ed67e43c97fd1f73b62f78ceb4f19b98f9ad5f08b9069f51324f341fd416cc80fe7415da89a315ff82063f6f7a8f1cb910c92920ad91c3938bca43147be70d8c4b5029c805a8df5b6cd0871cf6bae064ea14d6505ea7e8df1284df81204317ef4f90b0924e50e0c3ca62ce77800e200ce18f04d5f24eb5c101e197236f978ce1673af35b60bc9fd91b3a01ea79084a296bb1bf770171a8947692e07d8c582ce1bee47429553ddd1b07768f048fe520e845261c1ed354333f34ca5a148a92866c37381002ebc4bd63476d27f23c57cda5db6bcda705ea2d2968c265641284ac41936c70e040ecf39dac02a2349c4fb712281a87f796eb6c1a62467b378e0012f02e1106c410e4aca294ee57dcba7509f92513c115eee47918cbf0aab0a9c4de973cd744d309d4d5c80dcde8a8bc93c91d050f7de79689904102f9e11ef7136f080e64e913331b5ebe4f11c355804faaadf866d22b4fb67aefa3d6edfd9f6d9c63f2b56dc61a8c2ed141a466867086deddec7b4d81fe5d65435410db6ffb2b1f6d6f6fb45c5e99d77730aa910cab9d6a4c3af48f8292ff8da4d55028297782991ab3bc'
        server: {
            port: 3001
        }
    }
});

if(process.env.PORT) {
    const url = crm.connection.getAuthUrl();
    console.log(url);
} else {
    crm.on( 'connection:newToken', response => {
        fs.writeFileSync( './token.json', JSON.stringify( response.data ));
      });
    
      try {
        const currentToken = require( './token.json' );
        crm.connection.setToken( currentToken );
      } catch (e) {
        const url = crm.connection.getAuthUrl();
        console.log({url});
      }
}

app.get('/', (req,res) => {
    res.send('Works');
});

app.post('/api/form', async(req, res) => {
    const data = req.body;

    const fields = [];

    Object.keys(data).forEach(item => {
        switch (item) {
            case "tel": {
                fields.push({
                    field_id: 1000471,
                    values: [
                        {
                            value: data[item]
                        }
                    ]
                }); break;
            };
            case "address": {
                fields.push({
                    field_id: 1000399,
                    values: [
                        {
                            value: data[item]
                        }
                    ]
                }); break;
            };
            case "additional": {
                fields.push({
                    field_id: 1000401,
                    values: [
                        {
                            value: data[item]
                        }
                    ]
                }); break;
            }
        }
    });

    const leads = [{
        source_name: data.type,
        source_uid: 'de2939a1-3054-4ff0-afbc-67889c78912f',
        metadata: {
            form_id: '936421',
            form_name: 'Tunuke',
            form_page: process.env.PUBLIC_URL || 'tunuke.kg',
            form_sent_at: 12312322
        },
        _embedded: {
            leads: [
                {
                    name: data.type,
                    custom_fields_values: fields
                }
            ],
            contacts: [
                {
                    name: data.name
                }
            ]
        }

    }]

    try {
        const response = await crm.request.post('/api/v4/leads/unsorted/forms', leads);
    } catch(err) {
        res.json({
            message: 'error'
        });
    }

    console.log(' - Lead created - ')

    res.json({
        message: 'okey'
    });
});

app.listen(process.env.PORT || 3000, (err) => {
    if(err) return console.log(err);
    console.log('--[Server started]--');
});


// (async ()=>{
//     const leads = [{
//         source_name: "Tunuke.kg",
//         source_uid: 'de2939a1-3054-4ff0-afbc-67889c78912f',
//         metadata: {
//             form_id: '936421',
//             form_name: 'Tunuke',
//             form_page: 'tunuke.kg',
//             form_sent_at: 12312322
//         },
//         _embedded: {
//             leads: [
//                 {
//                     name: 'Tunuke.kg',
//                     custom_fields_values: [
//                         {
//                             field_id: 1000399,
//                             values: [
//                                 {
//                                     value: "г. Москва, Николоямская улица 28/60 стр. 1"
//                                 }
//                             ]
//                         },
//                         {
//                             field_id: 1000401,
//                             values: [
//                                 {
//                                     value: "Матерриалы - Корчинывый кирпич"
//                                 }
//                             ]
//                         },
//                         {
//                             field_id: 1000471,
//                             values: [
//                                 {
//                                     value: "+99632322"
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ],
//             contacts: [
//                 {
//                     name: "Test"
//                 }
//             ]
//         }

//     }]

//     // const res = await crm.request.post('/api/v4/leads/unsorted/forms', leads);
//     // try {
//     //     console.log(res.data['validation-errors'][0].errors); 
//     // } catch(err) {}

//     // const res = await crm.request.post('/api/v4/leads/custom_fields', [
//     //     {
//     //         type: 'text',
//     //         name: "Телефон"
//     //     }
//     // ]);
//     // console.log(res.data._embedded)

//     // const res = await crm.request.get('/api/v4/leads/custom_fields');
//     // console.log(res.data._embedded)
    
// })();

//pscp -i c:/Users/Maks/Desktop/ssh-puttty.ppk c:/Users/Maks/Desktop/server/server.zip  opc@130.61.158.139:/home/opc/