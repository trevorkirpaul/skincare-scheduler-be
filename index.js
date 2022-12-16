var $l009i$express = require("express");
var $l009i$cors = require("cors");
var $l009i$mongoose = require("mongoose");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}



const $117283e16e0d9c19$var$createURI = (user, password)=>`mongodb+srv://${user}:${password}@cluster0.chcu6ia.mongodb.net/?retryWrites=true&w=majority`;
const $117283e16e0d9c19$export$50613199f6c5501e = async ()=>{
    const VITE_MONGO_USERNAME = "tkirpaul", VITE_MONGO_PASSWORD = "HyYElZOSNKpn5R4E";
    const URI = $117283e16e0d9c19$var$createURI(VITE_MONGO_USERNAME, VITE_MONGO_PASSWORD);
    try {
        await (0, ($parcel$interopDefault($l009i$mongoose))).connect(URI, {
        });
        console.log("DB: Connected");
    } catch (error) {
        console.log(error);
        throw new Error("connectToDB: Cata fail");
    }
};



/**
 * name
 * ingredients
 * type
 */ const $fe94df7f90283454$var$Schema = new (0, ($parcel$interopDefault($l009i$mongoose))).Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    ingredients: [
        String
    ],
    type: {
        type: String
    }
});
const $fe94df7f90283454$var$Product = (0, ($parcel$interopDefault($l009i$mongoose))).model("Product", $fe94df7f90283454$var$Schema);
var $fe94df7f90283454$export$2e2bcd8739ae039 = $fe94df7f90283454$var$Product;


var $26742774b7a01c30$exports = {};


const $03ea3093ee434e59$var$BASE = "/products";
const $03ea3093ee434e59$export$bc7d04bd56466d1 = (app)=>{
    app.get($03ea3093ee434e59$var$BASE, async (req, res)=>{
        console.log("req.query", req.query);
        const { limit: limit = 10 , skip: skip = 0  } = req.query;
        const products = await (0, $fe94df7f90283454$export$2e2bcd8739ae039).find().limit(limit).skip(skip);
        const pageCount = Math.ceil(await (0, $fe94df7f90283454$export$2e2bcd8739ae039).count() / limit);
        res.status(200).send({
            pageCount: pageCount,
            products: products
        });
    });
    app.post(`${$03ea3093ee434e59$var$BASE}`, async ({ body: body  }, res)=>{
        try {
            const newProduct = await (0, $fe94df7f90283454$export$2e2bcd8739ae039).create(body);
            res.status(201).send(newProduct);
        } catch (error) {
            res.status(400).send({
                error: true,
                message: "error"
            });
        }
    });
    app.post(`${$03ea3093ee434e59$var$BASE}/seed`, async (req, res)=>{
        return res.send({
            blocked: true
        });
    });
};



const $298a501f88d7015c$var$Schema = new (0, ($parcel$interopDefault($l009i$mongoose))).Schema({
    email: {
        type: String,
        required: true
    },
    schedules: [
        {
            type: (0, ($parcel$interopDefault($l009i$mongoose))).Schema.Types.ObjectId,
            ref: "Schedule"
        }, 
    ]
});
const $298a501f88d7015c$var$User = (0, ($parcel$interopDefault($l009i$mongoose))).model("User", $298a501f88d7015c$var$Schema);
var $298a501f88d7015c$export$2e2bcd8739ae039 = $298a501f88d7015c$var$User;



const $ccb93aeb01945b55$var$Schema = new (0, ($parcel$interopDefault($l009i$mongoose))).Schema({
    days: [
        {
            type: (0, ($parcel$interopDefault($l009i$mongoose))).Schema.Types.ObjectId,
            ref: "Day"
        }, 
    ],
    user: {
        type: (0, ($parcel$interopDefault($l009i$mongoose))).Schema.Types.ObjectId,
        ref: "User"
    }
});
const $ccb93aeb01945b55$var$Schedule = (0, ($parcel$interopDefault($l009i$mongoose))).model("Schedule", $ccb93aeb01945b55$var$Schema);
var $ccb93aeb01945b55$export$2e2bcd8739ae039 = $ccb93aeb01945b55$var$Schedule;



const $543e046aaa91e3cd$var$Schema = new (0, ($parcel$interopDefault($l009i$mongoose))).Schema({
    day: {
        required: true,
        type: String
    },
    products: [
        {
            type: (0, ($parcel$interopDefault($l009i$mongoose))).Schema.Types.ObjectId,
            ref: "ScheduledProduct"
        }, 
    ]
});
const $543e046aaa91e3cd$var$Day = (0, ($parcel$interopDefault($l009i$mongoose))).model("Day", $543e046aaa91e3cd$var$Schema);
var $543e046aaa91e3cd$export$2e2bcd8739ae039 = $543e046aaa91e3cd$var$Day;



const $c74da252e155335b$var$Schema = new (0, ($parcel$interopDefault($l009i$mongoose))).Schema({
    day: {
        required: true,
        type: String
    },
    order: {
        // required: true,
        type: Number
    },
    amOrPm: {
        required: true,
        type: String
    },
    product: [
        {
            type: (0, ($parcel$interopDefault($l009i$mongoose))).Schema.Types.ObjectId,
            ref: "Product"
        }, 
    ]
});
const $c74da252e155335b$var$ScheduledProduct = (0, ($parcel$interopDefault($l009i$mongoose))).model("ScheduledProduct", $c74da252e155335b$var$Schema);
var $c74da252e155335b$export$2e2bcd8739ae039 = $c74da252e155335b$var$ScheduledProduct;


const $106a7aca2240c444$var$BASE = "/users";
const $106a7aca2240c444$var$days = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
];
const $106a7aca2240c444$export$8bd653a33461d337 = (app)=>{
    app.get(`${$106a7aca2240c444$var$BASE}/:id`, async ({ params: { id: id  }  }, res)=>{
        const user = await (0, $298a501f88d7015c$export$2e2bcd8739ae039).findById(id).populate("schedules").populate({
            path: "schedules",
            populate: {
                path: "days",
                model: "Day",
                populate: {
                    path: "products",
                    model: "ScheduledProduct",
                    populate: {
                        path: "product",
                        model: "Product"
                    }
                }
            }
        });
        res.status(200).send(user);
    });
    app.get($106a7aca2240c444$var$BASE, async (req, res)=>{
        const users = await (0, $298a501f88d7015c$export$2e2bcd8739ae039).find();
        // .populate('schedules')
        // .populate({
        //   path: 'schedules',
        //   populate: {
        //     path: 'days',
        //     model: 'Day',
        //   },
        // })
        // .populate({
        //   path: 'schedules.days.products',
        //   model: 'days',
        //   populate: {
        //     path: 'products',
        //     model: 'ScheduledProduct',
        //   },
        // })
        res.status(200).send(users);
    });
    app.post($106a7aca2240c444$var$BASE, async (req, res)=>{
        const newUser = await (0, $298a501f88d7015c$export$2e2bcd8739ae039).create(req.body);
        const createdDays = await Promise.all($106a7aca2240c444$var$days.map(async (day)=>await (0, $543e046aaa91e3cd$export$2e2bcd8739ae039).create({
                day: day,
                products: []
            })));
        const newSchedule = await (0, $ccb93aeb01945b55$export$2e2bcd8739ae039).create({
            user: newUser._id,
            days: createdDays.map((d)=>d._id)
        });
        const updatedNewUser = await (0, $298a501f88d7015c$export$2e2bcd8739ae039).findByIdAndUpdate(newUser._id, {
            $addToSet: {
                schedules: newSchedule._id
            }
        });
        res.status(200).send(updatedNewUser);
    });
    app.post(`${$106a7aca2240c444$var$BASE}/day/order`, async ({ body: { dayId: dayId , items: items  }  }, res)=>{
        const updatedDay = await (0, $543e046aaa91e3cd$export$2e2bcd8739ae039).findByIdAndUpdate(dayId, {
            $pullAll: {
                products: items
            }
        }, {
            new: true
        });
        const updatedDayWithUpdatedOrder = await (0, $543e046aaa91e3cd$export$2e2bcd8739ae039).findByIdAndUpdate(dayId, {
            $addToSet: {
                products: items
            }
        }, {
            new: true
        });
        return res.status(200).send({
            updatedDay: updatedDay
        });
    });
    app.post(`${$106a7aca2240c444$var$BASE}/schedule`, async ({ body: { dayId: dayId , productId: productId  }  }, res)=>{
        const newScheduledProduct = await (0, $c74da252e155335b$export$2e2bcd8739ae039).create({
            day: dayId,
            amOrPm: "AM",
            product: [
                productId
            ]
        });
        const updatedDay = await (0, $543e046aaa91e3cd$export$2e2bcd8739ae039).findByIdAndUpdate(dayId, {
            $addToSet: {
                products: newScheduledProduct._id
            }
        }, {
            new: true
        });
        return res.status(200).send({
            newScheduledProduct: newScheduledProduct,
            updatedDay: updatedDay
        });
    });
    app.delete(`${$106a7aca2240c444$var$BASE}/schedule`, async ({ body: { dayId: dayId , productId: productId  }  }, res)=>{
        await (0, $c74da252e155335b$export$2e2bcd8739ae039).findByIdAndDelete(productId);
        const updatedDay = await (0, $543e046aaa91e3cd$export$2e2bcd8739ae039).findByIdAndUpdate(dayId, {
            $pull: {
                products: productId
            }
        }, {
            new: true
        });
        return res.status(200).send({
            updatedDay: updatedDay
        });
    });
};


const $0fed0a37f1519019$var$Routes = (app)=>{
    (0, $03ea3093ee434e59$export$bc7d04bd56466d1)(app);
    (0, $106a7aca2240c444$export$8bd653a33461d337)(app);
    app.get("/", (req, res)=>{
        res.send({
            message: "Works!"
        });
    });
};
var $0fed0a37f1519019$export$2e2bcd8739ae039 = $0fed0a37f1519019$var$Routes;


const $7cae461d24fb566d$export$ea4422ead210593b = ()=>{
    const app = (0, ($parcel$interopDefault($l009i$express)))();
    const port = 3001;
    (0, $117283e16e0d9c19$export$50613199f6c5501e)();
    app.use((0, ($parcel$interopDefault($l009i$cors)))());
    app.use((0, ($parcel$interopDefault($l009i$express))).json());
    (0, $0fed0a37f1519019$export$2e2bcd8739ae039)(app);
    app.listen(port, ()=>{
        console.log(`Example app listening on port ${port}`);
    });
};


(0, $7cae461d24fb566d$export$ea4422ead210593b)();


//# sourceMappingURL=index.js.map