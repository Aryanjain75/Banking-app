const data = new Map();

function getdata() {
    return data.get("accountno");
}

function putdata(accountno) {
    console.log(accountno);
    data.set("accountno", accountno);
}

module.exports = { getdata, putdata };
