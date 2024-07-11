const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({ 
    fild:String,
    value:Number
});
var countermodul = mongoose.model('cashwalletcounters', counterSchema);

const userSchema = new mongoose.Schema({ 
    userName:String,
    userID:Number,
    transactionPin:String,
    accountNumber:String,
    multyCurrencyPermition:String,
    password:String,
    email:String,
    mobile:String,
    varyficatinStatus:String,
    country:String,
    countryCode:String,
    currency:String,
    currencySymbol:String,
    accountBalance:String,
    usdtBalance:String,
    lastBalanceUpdate:{ type: Date},
    regdate: { type: Date, default: Date.now },
    lastlogin: { type: Date}
});
var usermodul = mongoose.model('cashwalletusers', userSchema);

const merchantSchema = new mongoose.Schema({ 
    merchantName:String,
    merchantNickname:String,
    merchantuserID:Number,
    feedback:String,
    OrderTime:String,
    limitFrom:String,
    limitTo:String,
    totalFund:String,
    postCode:String,
    merchantType:String,
    merchantStatus:String,
    onlineOffline:Number,
    usdtRate:String,
    mobile:String,
    country:String,
    countryCode:String,
    currency:String,
    currencySymbol:String,
    date: { type: Date, default: Date.now },
});
var merchantmodul = mongoose.model('cashwalletmerchants', merchantSchema);

const merchantorderSchema = new mongoose.Schema({ 
    userName:String,
    userID:Number,
    merchantNickname:String,
    merchantuserID:Number,
    OrderID:String,
    merchantType:String,
    postCode:String,
    merchantStatus:String,
    orderAmount:String,
    marchantPaytoCust:String,
    orderTime:String,
    frzeeFiatAmount:String,
    frzeeUsdtAmount:String,
    usdtRate:String,
    currencyRate:String,
    currency:String,
    currencySymbol:String,
    orderStatus:String,
    date: { type: Date, default: Date.now }
});
var merchantordermodul = mongoose.model('cashwalletmerchantorders', merchantorderSchema);

const forgetPasswordSchema = new mongoose.Schema({ 
    userName:String,
    userID:Number,
    countryCode:String,
    email:String,
    mobile:String,
    newPassword:String,
    status:String,
    daterequest: { type: Date, default: Date.now }
});
var forgetPasswordmodul = mongoose.model('cashwalletforgetpasswords', forgetPasswordSchema);

const verificationSchema = new mongoose.Schema({ 
    userName:String,
    userID:Number,
    selfyPicture:String,
    addressProofID:String,
    addressProofPicture:String,
    idProof:String,
    idNo:String,
    idProofPicture:String,
    address1:String,
    address2:String,
    city:String,
    state:String,
    country:String,
    postCode:String,
    videoRecording:String,
    varyficatinStatus:String,

    date:{ type: Date, default: Date.now }
});
var verificationmodul = mongoose.model('cashwalletverifications', verificationSchema);

const paymentmethodSchema = new mongoose.Schema({ 
    userName:String,
    userID:Number,
    paymentMethod:String,
    country:String,
    currency:String,
    upi:String,
    bankName:String,
    accountNo:String,
    ifscCode:String,
    branch:String,
    branchDistrict:String,
    sortCode:String,
    IBAN:String,
    date:{ type: Date, default: Date.now }
});
var paymentmethodmodul = mongoose.model('cashwalletpaymentmethods', paymentmethodSchema);

const adminSchema = new mongoose.Schema({ 
    userID:Number,
    password:String,
    address:String,
    mobile:String,
    type:String,
    status:String,
});
var adminmodul = mongoose.model('cashwalletadmins', adminSchema);


const contrySchema = new mongoose.Schema({ 
    country:String,
    countryCode:String,
    currency:String,
    currencySymbol:String
});
var contrymodul = mongoose.model('cashwalletcuntrys', contrySchema);

const fundreciveSchema = new mongoose.Schema({ 
    virtualAddress:String,
    payNetworkChannel:String,
    cryptoCurrency:String,
    qrCode:String
});
var fundrecivemodul = mongoose.model('cashwalletfundrecives', fundreciveSchema);

const paacryptoeainingSchema = new mongoose.Schema({ 
    amount:String,
    usdt:String,
    currency:String,
    currencySymbol:String,
    date: { type: Date, default: Date.now },

});
var paacryptoeainingmodul = mongoose.model('cashwalletpaacryptoeainings', paacryptoeainingSchema);

const chargesSchema = new mongoose.Schema({ 
    charges:String,
    limitAmount:Number,
    currency:String,

});
var chargesmodul = mongoose.model('cashwalletcharges', chargesSchema);


const mycurrencySchema = new mongoose.Schema({ 
    userID:Number,
    currency: String,
    currencySymbol: String,
    lastcheckBalance:String,
    lastCheckUsdtAmount:String,
    frzeeFiatAmount:String,
    frzeeUsdtAmount:String,
    lastCheckDate:{ type: Date}
});
var mycurrencymodul = mongoose.model('cashwalletmycurrencys', mycurrencySchema);

const usdtrateSchema = new mongoose.Schema({ 
    country:String,
    currency:String,
    usdtRate:String
});
var usdtratemodul = mongoose.model('cashwalletusdtrates', usdtrateSchema);


const transactionledgerSchema = new mongoose.Schema({ 
    userID:String,
    trasactionID:String,
    /////Transact from
    accountFrom:String,
    userNameFrom:String,
    /////Transact to/////
    accountTo:String,
    userNameTo:String,
    transactionType:String,
    TransacFee:String,
    withdralFaitAmount:String,
    withdralusdtAmount:String,
    depositFaitAmount:String,
    dipositusdtAmount:String,
    cryptoCurrency:String,
    fiatCurrency:String,
    transactionStatus:String,
    remarks:String,
    reference:String,
    date:{ type: Date, default: Date.now }
   
});
var transactionledgermodul = mongoose.model('cashwallettransactionledgers', transactionledgerSchema);


const tangenLedgerSchema = new mongoose.Schema({ 
    trasactionID:String,
    transactionType:String,
    depositAmount:String,
    withdralAmount:String,
    cryptoCurrency:String,
    fiatCurrency:String,
    currency:String,
    cryptoWalletAddress:String,
    cryptoTransactionID:String,
    screenSort:String,
    userID:String,
    accountNumber:String,
    password:String,
    email:String,
    mobile:String,
    countryCode:String,
    status:String,
    remarks:String,
    date:{ type: Date, default: Date.now }
});
var tangenLedgermodul = mongoose.model('cashwallettangenledgers', tangenLedgerSchema);

module.exports={
    counter:countermodul,
    user:usermodul,
    admin:adminmodul,
    contry:contrymodul,
    fundrecive:fundrecivemodul,
    tangenLedger:tangenLedgermodul,
    verification:verificationmodul,
    transactionledger:transactionledgermodul,
    mycurrency:mycurrencymodul,
    usdtrate:usdtratemodul,
    paacryptoeaining:paacryptoeainingmodul,
    charges:chargesmodul,
    forgetPassword:forgetPasswordmodul,
    merchant:merchantmodul,
    merchantorder:merchantordermodul,
    paymentmethod:paymentmethodmodul
}