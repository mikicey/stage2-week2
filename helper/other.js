module.exports.sendErr = (message,res) => {
    res.status(400).send({
        status:"error",
        message:message
    })
};