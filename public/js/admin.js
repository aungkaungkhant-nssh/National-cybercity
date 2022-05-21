function deleteProduct(btn){
    const productId =btn.parentNode.querySelector("[name=id]").value;
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
    const productList = btn.closest(".product-list");
    fetch("/admin/product/"+productId,{
        method:"DELETE",
        headers:{
            "csrf-token":csrf
        }
    })
    .then((result)=>{
        return result.json(); // change the json decode
    })
    .then((data)=>{
        console.log(data);
        productList.parentNode.removeChild(productList);
    })
    .catch((err)=>console.log(err))

}