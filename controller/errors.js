exports.get500 = (req,res,next)=>{
    return res.status(500).render('500',{
        pageTitle:"500",
        path:""
    })
}

exports.get400 = (req,res,next)=>{
    return res.status(404).render('404',{
        pageTitle:"404",
        path:""
    });
}